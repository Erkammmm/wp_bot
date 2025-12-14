import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable bulunamadı!');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    // Gemini model seçimi: gemini-2.5-flash (hızlı, hafif ve güçlü - önerilen)
    // Sistem prompt'u ile fine-tuning gibi çalışır - her konuda konuşabilir, bizim verilerimizle özelleştirilmiş
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.model = this.genAI.getGenerativeModel({ model: modelName });
    console.log(`🤖 Gemini model: ${modelName} (LLM - her konuda konuşabilir)`);

    // Sistem promptu - satış asistanı karakteri
    this.systemPrompt = `Sen bir WhatsApp Business satış asistanısın. Instagram mesaj reklamlarından gelen müşterilerle birebir sohbet ediyorsun.

AMACIN:
- Mont ürününü satmak
- Müşteriyi sıkmadan ikna etmek
- İnsan gibi yazmak (robot gibi değil)
- Her mesajı hemen değil, 3–5 saniye gecikmeyle göndermek
- Tek mesajda her şeyi dökmemek
- Sadece müşteri ne soruyorsa onu cevaplamak

GENEL DAVRANIŞ KURALLARI:
- Samimi, doğal, sıcak, arkadaşça yaz (robot gibi değil, gerçek bir insan gibi)
- Uzun paragraflar yazma
- Gerekmedikçe teknik detay verme
- Emoji kullanımı çok az ve yerinde olsun (❄️ 🧥 😊 gibi)
- Asla "ben bir yapay zekayım" deme
- Asla otomatik bot gibi hissettirme
- Müşteri kararsızsa güven ver, satış artırıcı cümleler kullan
- Her zaman samimi, sıcak ve satış odaklı ol (ama baskıcı değil)
- Müşteri soru sorduktan sonra cevabı 3–5 saniye gecikmeyle yazıyormuş gibi davran
- ASLA "(3-5 saniye gecikme)" gibi teknik açıklamalar yazma - sadece doğal mesaj yaz

ÜRÜN BİLGİLERİ (SADECE GEREKTİĞİNDE KULLAN):
- Ürün fiyatı: 1800 TL
- Aralık ayına özel indirimlidir
- Ocak ayında fiyat 2000 TL üzeri olacaktır
- Trendyol / Hepsiburada'da 2000 TL üzeri satılmaktadır
- İçi kürklü
- Dışı A kalite suni deri
- Kalın ve kışlıktır
- İç cebi vardır
- Dar kalıptır (önemli)
- Kapıda nakit ödeme mevcuttur
- Teslimden sonra 7 gün içinde iade & değişim vardır

BEDEN TABLOSU (SADECE BEDEN SORULURSA KULLAN):
- 50–54 kg: Boy 160–190 → S
- 55–59 kg: Boy 160–164 → M, Boy 165–190 → S
- 60–64 kg: Boy 160–169 → M, Boy 170–190 → S
- 65–69 kg: Boy 160–169 → L, Boy 171–190 → M
- 70–74 kg: Boy 160–174 → L, Boy 175–190 → M
- 75–79 kg: Boy 161–174 → XL, Boy 175–190 → L
- 80–89 kg: Boy 160–190 → XL
- 90–100 kg: Boy 160–190 → 3XL

BEDEN YAZARKEN:
- Önce kilo + boy sor
- "Dar kalıp olduğu için" uyarısını nazikçe ekle
- Emin değilse bir beden büyüğü öner

SOHBET AKIŞI ÖRNEK DAVRANIŞLAR:

EĞER MÜŞTERİ "FİYAT?" DERSE:
- Sadece fiyatı ve kısa bir avantajı söyle
- İndirim vurgusu yap ama bastırma

EĞER "BEDEN?" DERSE:
- Önce kilo + boy sor
- Tabloyu olduğu gibi dökme
- Sadece o kişiye uygun bedeni söyle

EĞER "KALIN MI?" DERSE:
- İçi kürklü ve kışlık olduğunu belirt
- Aşırı teknik anlatma

EĞER "İADE VAR MI?" DERSE:
- 7 gün içinde iade & değişim olduğunu söyle
- Güven veren bir dil kullan

EĞER KARARSIZLIK VARSA:
- "Şu an en çok tercih edilen model"
- "Aralık indirimi"
- "Kapıda ödeme" gibi güven artırıcı tek bir cümle ekle

KESİNLİKLE YAPMA:
- Tek mesajda fiyat + beden + iade + ödeme + her şeyi anlatma
- Uzun satış metni yazma
- Baskıcı olma

SİPARİŞ ALMA SÜRECİ (ÇOK ÖNEMLİ):

EĞER MÜŞTERİ SATIN ALMAYA İKNA OLURSA (örnek: "alacağım", "sipariş", "istiyorum", "alayım", "tamam", "oluşturalım" gibi):
1. Hemen sipariş bilgilerini TEK BİR MESAJDA iste
2. Şu bilgileri MUTLAKA topla (hepsini birden iste):
   - İsim Soyisim
   - Detaylı Adres (PTT kargo için eksiksiz ve net olmalı - mahalle, sokak, bina no, daire, ilçe, il hepsi olmalı)
   - Telefon Numarası
3. "Kapıda nakit ödeme mevcuttur" bilgisini ekle
4. Samimi, sıcak ve satış artırıcı bir dil kullan

SİPARİŞ BİLGİ TOPLAMA ÖRNEĞİ (TEK MESAJ):
"Harika! 😊 Sipariş için şu bilgilere ihtiyacım var:

• İsim Soyisim
• Detaylı Adres (mahalle, sokak, bina no, daire, ilçe, il - PTT kargo için eksiksiz olsun)
• Telefon Numarası

Bu bilgiler yeterli olacaktır. Kapıda nakit ödeme mevcuttur. 🧥"

VEYA DAHA SAMİMİ VERSİYON:
"Harika! 😊 Siparişi oluşturalım. Şu bilgilere ihtiyacım var:

• İsim Soyisim
• Detaylı Adres (mahalle, sokak, bina no, daire, ilçe, il - PTT kargo için eksiksiz olsun)
• Telefon Numarası

Bu bilgiler yeterli olacaktır. Kapıda nakit ödeme mevcuttur. 🧥"

ÖNEMLİ: 
- Bilgileri TEK TEK sorma, hepsini birden iste
- Samimi ve sıcak bir dil kullan
- "Bu bilgiler yeterli olacaktır" gibi güven verici ifadeler kullan

HEDEF:
Müşteri kendini gerçek bir insanla konuşuyormuş gibi hissetsin ve satın almaya ikna olsun.

Satışı %20–30 artıracak ikna cümleleri kullan.`;

    // İkna cümleleri (ekstra satış artırıcı)
    this.persuasionTips = [
      "Şu an en çok tercih edilen model",
      "Aralık indirimi sadece bu ay geçerli",
      "Kapıda ödeme ile risk yok",
      "7 gün içinde memnun kalmazsanız iade edebilirsiniz",
      "Ocak ayında fiyat artacak, şimdi almak avantajlı",
      "Trendyol'da 2000 TL üzeri satılıyor, burada indirimli"
    ];
  }

  async generateResponse(userMessage, conversationHistory, contactName, orderStatus = 'none', order = null) {
    try {
      // Konuşma geçmişini formatla
      let conversationText = this.systemPrompt + '\n\n';
      
      // Müşteri adını ekle
      conversationText += `Müşteri adı: ${contactName}\n\n`;
      
      // Sipariş durumunu ekle
      if (orderStatus === 'collecting' && order) {
        const missingFields = this.getMissingFieldsForPrompt(order);
        conversationText += `SİPARİŞ DURUMU: Bilgi toplama aşamasındasın.\n`;
        conversationText += `Eksik bilgiler: ${missingFields.join(', ')}\n`;
        conversationText += `Toplanan bilgiler:\n`;
        if (order.data.name) conversationText += `- İsim: ${order.data.name}\n`;
        if (order.data.phone) conversationText += `- Telefon: ${order.data.phone}\n`;
        if (order.data.address) conversationText += `- Adres: ${order.data.address}\n`;
        conversationText += `\nŞimdi eksik bilgileri sırayla iste. Tek tek, nazikçe.\n\n`;
      }
      
      conversationText += 'Konuşma geçmişi:\n';

      // Son mesajları ekle
      for (const msg of conversationHistory) {
        if (msg.role === 'user') {
          conversationText += `Müşteri: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          conversationText += `Sen: ${msg.content}\n`;
        }
      }

      conversationText += `\nMüşteri: ${userMessage}\n`;
      conversationText += `Sen (kısa, samimi, ikna edici yanıt ver):`;

      // Gemini API çağrısı - sistem prompt ile fine-tuning gibi çalışır
      // Sistem prompt'u her mesajda gönderiyoruz, böylece model bizim verilerimizle özelleştirilmiş gibi davranır
      const result = await this.model.generateContent(conversationText);
      const response = await result.response;
      let text = response.text().trim();

      // Yanıtı temizle ve optimize et
      text = this.cleanResponse(text);

      // Çok uzunsa kısalt
      if (text.length > 500) {
        text = text.substring(0, 497) + '...';
      }

      return text;

    } catch (error) {
      console.error('Gemini API hatası:', error);
      
      // Fallback yanıtlar
      return this.getFallbackResponse(userMessage);
    }
  }

  cleanResponse(text) {
    // Gereksiz ön ekleri temizle
    text = text.replace(/^(Sen:|Asistan:|Bot:)\s*/i, '');
    text = text.replace(/^["']|["']$/g, ''); // Tırnak işaretlerini kaldır
    
    // "(3-5 saniye gecikme)" gibi metinleri kaldır (müşteriye gösterilmemeli)
    text = text.replace(/\(3-5\s*saniye\s*gecikme\)/gi, '');
    text = text.replace(/\(3-5\s*second\s*delay\)/gi, '');
    text = text.replace(/\(gecikme\)/gi, '');
    
    // Birden fazla boşluğu tek boşluğa çevir
    text = text.replace(/\s+/g, ' ');
    
    return text.trim();
  }

  getMissingFieldsForPrompt(order) {
    const missing = [];
    if (!order.data.name) missing.push('İsim Soyisim');
    if (!order.data.address) missing.push('Detaylı Adres (mahalle, sokak, no, daire, ilçe, il)');
    if (!order.data.phone) missing.push('Telefon Numarası');
    return missing;
  }

  getFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Fiyat soruları
    if (lowerMessage.includes('fiyat') || lowerMessage.includes('kaç') || lowerMessage.includes('pahalı') || lowerMessage.includes('ucuz')) {
      return '1800 TL. Aralık ayına özel indirimli 🧥';
    }

    // Beden soruları
    if (lowerMessage.includes('beden') || lowerMessage.includes('numara') || lowerMessage.includes('size')) {
      return 'Hangi beden uygun olur diye bakalım. Kilo ve boyunuzu söyler misiniz?';
    }

    // Kalınlık/sıcaklık
    if (lowerMessage.includes('kalın') || lowerMessage.includes('sıcak') || lowerMessage.includes('kışlık')) {
      return 'Evet, içi kürklü ve kışlık. Çok sıcak tutuyor ❄️';
    }

    // İade/değişim
    if (lowerMessage.includes('iade') || lowerMessage.includes('değişim') || lowerMessage.includes('geri')) {
      return 'Tabii, teslimden sonra 7 gün içinde iade veya değişim yapabilirsiniz.';
    }

    // Ödeme
    if (lowerMessage.includes('ödeme') || lowerMessage.includes('nasıl öde') || lowerMessage.includes('ödeme şekli')) {
      return 'Kapıda nakit ödeme mevcut. Teslimatta ödeyebilirsiniz.';
    }

    // Kargo/teslimat
    if (lowerMessage.includes('kargo') || lowerMessage.includes('teslimat') || lowerMessage.includes('gönder')) {
      return 'PTT kargo ile gönderiyoruz. Adresiniz eksiksiz olursa sorunsuz ulaşır.';
    }

    // Ürün bilgisi
    if (lowerMessage.includes('mont') || lowerMessage.includes('hakkında') || lowerMessage.includes('bilgi') || lowerMessage.includes('nasıl')) {
      return 'İçi kürklü, dışı A kalite suni deri. Kalın ve kışlık. Dar kalıp. 1800 TL. Detaylı bilgi için sorabilirsiniz 🧥';
    }

    // Satın alma niyeti
    if (lowerMessage.includes('alacağım') || lowerMessage.includes('alayım') || lowerMessage.includes('istiyorum') || lowerMessage.includes('sipariş')) {
      return 'Harika! Sipariş için birkaç bilgiye ihtiyacım var. İsim ve soyisminizi alabilir miyim?';
    }

    // Onaylama
    if (lowerMessage === 'evet' || lowerMessage === 'tabi' || lowerMessage === 'tabii' || lowerMessage === 'tamam' || lowerMessage === 'olur') {
      return 'Mont hakkında ne öğrenmek istersiniz? Fiyat, beden, kargo gibi konularda yardımcı olabilirim 🧥';
    }

    // Genel yanıt
    return 'Merhaba! Mont hakkında bilgi almak ister misiniz? Fiyat, beden, kargo gibi konularda yardımcı olabilirim 🧥';
  }
}

