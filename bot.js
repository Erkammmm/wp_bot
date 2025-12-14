import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
import qrcode from 'qrcode-terminal';
import { GeminiService } from './gemini-service.js';
import { OrderManager } from './order-manager.js';
import dotenv from 'dotenv';

dotenv.config();

class WhatsAppSalesBot {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    });

    this.geminiService = new GeminiService();
    this.orderManager = new OrderManager();
    this.conversations = new Map(); // Müşteri konuşma geçmişleri
    this.processingMessages = new Set(); // İşlenmekte olan mesajlar

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // QR Code göster
    this.client.on('qr', async (qr) => {
      console.log('QR Code oluşturuldu, WhatsApp\'ı tarayın:');
      qrcode.generate(qr, { small: true });
      
      // Web sunucusuna QR kodunu gönder (opsiyonel)
      if (process.env.ENABLE_WEB_SERVER === 'true') {
        try {
          const { updateQR } = await import('./server.js');
          updateQR(qr);
        } catch (error) {
          // Web sunucusu çalışmıyorsa hata vermesin
        }
      }
    });

    // Bağlantı hazır
    this.client.on('ready', () => {
      console.log('✅ WhatsApp bot hazır ve çalışıyor!');
      console.log('📱 7/24 satış asistanı aktif');
    });

    // Bağlantı hatası
    this.client.on('disconnected', (reason) => {
      console.log('❌ WhatsApp bağlantısı kesildi:', reason);
      console.log('🔄 Yeniden bağlanılıyor...');
    });

    // Mesaj alındı
    this.client.on('message', async (message) => {
      await this.handleMessage(message);
    });

    // Kimlik doğrulama hatası
    this.client.on('auth_failure', (msg) => {
      console.error('❌ Kimlik doğrulama hatası:', msg);
    });
  }

  async handleMessage(message) {
    try {
      // Kendi mesajlarımızı ve grup mesajlarını yok say
      if (message.fromMe || message.isGroupMsg) {
        return;
      }

      const chatId = message.from;
      const messageBody = message.body.trim();

      // Boş mesajları yok say
      if (!messageBody || messageBody.length === 0) {
        return;
      }

      // Zaten işlenmekte olan bir mesaj varsa bekle
      if (this.processingMessages.has(chatId)) {
        return;
      }

      this.processingMessages.add(chatId);

      // Contact bilgisini güvenli şekilde al (hata durumunda fallback)
      let contactName = chatId.split('@')[0]; // Telefon numarası
      let contact = null;
      
      try {
        contact = await message.getContact();
        contactName = contact.pushname || contact.number || contactName;
      } catch (contactError) {
        // Contact bilgisi alınamazsa sadece telefon numarasını kullan
        console.log('⚠️ Contact bilgisi alınamadı, telefon numarası kullanılıyor');
      }

      console.log(`📨 Yeni mesaj: ${contactName} - "${messageBody}"`);

      // Konuşma geçmişini al veya oluştur
      if (!this.conversations.has(chatId)) {
        this.conversations.set(chatId, {
          messages: [],
          startTime: new Date(),
          contactName: contactName
        });
      }

      const conversation = this.conversations.get(chatId);

      // Müşteri mesajını geçmişe ekle
      conversation.messages.push({
        role: 'user',
        content: messageBody,
        timestamp: new Date()
      });

      // Son 10 mesajı context olarak al (çok uzun olmasın)
      const recentMessages = conversation.messages.slice(-10);

      // Sipariş durumunu kontrol et
      const orderStatus = this.orderManager.getOrderStatus(chatId);
      const order = this.orderManager.getOrder(chatId);

      // Müşteri satın alma niyetinde mi kontrol et
      const purchaseIntent = this.detectPurchaseIntent(messageBody);
      
      // Eğer satın alma niyeti varsa ve sipariş başlatılmamışsa başlat
      if (purchaseIntent && orderStatus === 'none') {
        this.orderManager.startOrder(chatId, contactName);
        console.log(`🛒 Yeni sipariş başlatıldı: ${contactName}`);
      }

      // Eğer sipariş toplama aşamasındaysa bilgileri çıkar
      if (orderStatus === 'collecting') {
        const extractedInfo = this.orderManager.extractOrderInfo(messageBody);
        
        // Eksik bilgileri güncelle
        const missingFields = this.orderManager.getMissingFields(chatId);
        
        if (missingFields.includes('name') && extractedInfo.name) {
          this.orderManager.updateOrderField(chatId, 'name', extractedInfo.name);
          console.log(`📝 İsim kaydedildi: ${extractedInfo.name}`);
        }
        
        if (missingFields.includes('phone') && extractedInfo.phone) {
          this.orderManager.updateOrderField(chatId, 'phone', extractedInfo.phone);
          console.log(`📞 Telefon kaydedildi: ${extractedInfo.phone}`);
        }
        
        if (missingFields.includes('address') && extractedInfo.address) {
          this.orderManager.updateOrderField(chatId, 'address', extractedInfo.address);
          console.log(`📍 Adres kaydedildi: ${extractedInfo.address.substring(0, 50)}...`);
        }

        // Manuel olarak da bilgi çıkar (kullanıcı direkt yazmışsa)
        this.extractAndSaveOrderInfo(chatId, messageBody, missingFields);
      }

      // Gemini'den yanıt al (sipariş durumunu da gönder)
      const response = await this.geminiService.generateResponse(
        messageBody,
        recentMessages,
        contactName || 'Müşteri',
        orderStatus,
        order
      );

      // 3-5 saniye arası rastgele gecikme (insan gibi davranmak için)
      const delay = 3000 + Math.random() * 2000; // 3000-5000ms
      await this.sleep(delay);

      // Yanıtı gönder
      await message.reply(response);

      // Bot yanıtını geçmişe ekle
      conversation.messages.push({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });

      console.log(`✅ Yanıt gönderildi: "${response.substring(0, 50)}..."`);

      // Sipariş tamamlandı mı kontrol et
      if (orderStatus === 'collecting' && this.orderManager.isOrderComplete(chatId)) {
        const completed = this.orderManager.completeOrder(chatId);
        if (completed) {
          const completedOrder = this.orderManager.getOrder(chatId);
          console.log(`✅ Sipariş tamamlandı: ${completedOrder.data.name} - ${completedOrder.data.phone}`);
          
          // Sipariş özeti gönder
          await this.sendOrderConfirmation(message, completedOrder);
        }
      }

      // Eski konuşmaları temizle (bellek yönetimi - son 24 saat)
      this.cleanOldConversations();

    } catch (error) {
      console.error('❌ Mesaj işleme hatası:', error);
      
      // Hata durumunda nazik bir yanıt gönder
      try {
        await message.reply('Üzgünüm, bir sorun oluştu. Lütfen tekrar deneyin. 😊');
      } catch (replyError) {
        console.error('Yanıt gönderme hatası:', replyError);
      }
    } finally {
      // İşleme tamamlandı, set'ten çıkar
      const chatId = message.from;
      this.processingMessages.delete(chatId);
    }
  }

  cleanOldConversations() {
    const now = new Date();
    const maxAge = 24 * 60 * 60 * 1000; // 24 saat

    for (const [chatId, conversation] of this.conversations.entries()) {
      if (now - conversation.startTime > maxAge) {
        this.conversations.delete(chatId);
      }
    }
  }

  // Satın alma niyetini algıla
  detectPurchaseIntent(message) {
    const lowerMessage = message.toLowerCase();
    const purchaseKeywords = [
      'alacağım', 'alayım', 'alıyorum', 'alırım',
      'sipariş', 'sipariş ver', 'sipariş vereyim',
      'istiyorum', 'istiyoruz',
      'tamam', 'olur', 'evet alacağım', 'alıyorum',
      'kargola', 'gönder', 'satın al'
    ];
    
    return purchaseKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  // Mesajdan sipariş bilgisi çıkar ve kaydet
  extractAndSaveOrderInfo(chatId, message, missingFields) {
    const order = this.orderManager.getOrder(chatId);
    if (!order) return;

    // İsim soyisim (büyük harfle başlayan 2-3 kelime)
    if (missingFields.includes('name')) {
      const namePattern = /(?:isim|ad|adım|soyad|soyisim)[\s:]*([A-ZÇĞİÖŞÜ][a-zçğıöşü]+(?:\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+){1,2})/i;
      const nameMatch = message.match(namePattern);
      if (nameMatch && nameMatch[1]) {
        this.orderManager.updateOrderField(chatId, 'name', nameMatch[1].trim());
        console.log(`📝 İsim kaydedildi (pattern): ${nameMatch[1].trim()}`);
      }
    }

    // Telefon (5XX XXX XX XX formatı)
    if (missingFields.includes('phone')) {
      const phonePattern = /(?:telefon|tel|numara)[\s:]*(\d{10,11})/i;
      const phoneMatch = message.match(phonePattern);
      if (phoneMatch && phoneMatch[1]) {
        this.orderManager.updateOrderField(chatId, 'phone', phoneMatch[1].trim());
        console.log(`📞 Telefon kaydedildi (pattern): ${phoneMatch[1].trim()}`);
      }
    }

    // Adres (uzun metin, adres kelimeleri içeren)
    if (missingFields.includes('address')) {
      const addressPattern = /(?:adres|adresi|adresim)[\s:]*([^\n]{20,})/i;
      const addressMatch = message.match(addressPattern);
      if (addressMatch && addressMatch[1]) {
        let address = addressMatch[1].trim();
        // Telefon ve isim varsa çıkar
        if (order.data.phone) {
          address = address.replace(order.data.phone, '').trim();
        }
        if (order.data.name) {
          address = address.replace(order.data.name, '').trim();
        }
        if (address.length > 15) {
          this.orderManager.updateOrderField(chatId, 'address', address);
          console.log(`📍 Adres kaydedildi (pattern): ${address.substring(0, 50)}...`);
        }
      }
    }
  }

  // Sipariş onay mesajı gönder
  async sendOrderConfirmation(message, order) {
    const confirmation = `✅ Siparişiniz alındı!

📋 Sipariş Özeti:
👤 İsim: ${order.data.name}
📞 Telefon: ${order.data.phone}
📍 Adres: ${order.data.address}

💵 Kapıda nakit ödeme mevcuttur.
📦 En kısa sürede kargoya verilecek.

Teşekkürler! 🧥`;

    await this.sleep(2000); // 2 saniye bekle
    const sentMessage = await message.reply(confirmation);
    
    // WhatsApp etiketleme dene (WhatsApp Business API gerekli)
    try {
      // whatsapp-web.js'de label özelliği varsa dene
      if (sentMessage && typeof sentMessage.addLabel === 'function') {
        await sentMessage.addLabel('Sipariş Alındı');
        console.log('🏷️ Mesaja etiket eklendi: "Sipariş Alındı"');
      } else {
        // Alternatif: Chat'e label ekle
        const chat = await sentMessage.getChat();
        if (chat && typeof chat.addLabel === 'function') {
          await chat.addLabel('Sipariş Alındı');
          console.log('🏷️ Chat\'e etiket eklendi: "Sipariş Alındı"');
        } else {
          console.log('⚠️ WhatsApp etiketleme özelliği mevcut değil (WhatsApp Business API gerekli)');
        }
      }
    } catch (labelError) {
      // Etiketleme başarısız olursa devam et (kritik değil)
      console.log('⚠️ Etiket eklenemedi (opsiyonel özellik):', labelError.message);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async start() {
    try {
      await this.client.initialize();
    } catch (error) {
      console.error('❌ Bot başlatma hatası:', error);
      process.exit(1);
    }
  }
}

// Web sunucusunu başlat (opsiyonel - QR kod görüntüleme için)
if (process.env.ENABLE_WEB_SERVER === 'true') {
  import('./server.js').then(() => {
    console.log('✅ Web sunucusu aktif - QR kod web üzerinden görüntülenebilir');
  }).catch((err) => {
    console.log('⚠️ Web sunucusu başlatılamadı (opsiyonel özellik)');
  });
}

// Bot'u başlat
const bot = new WhatsAppSalesBot();
bot.start();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Bot kapatılıyor...');
  await bot.client.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Bot kapatılıyor...');
  await bot.client.destroy();
  process.exit(0);
});

