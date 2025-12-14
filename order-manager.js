import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORDERS_FILE = path.join(__dirname, 'siparisler.json');

export class OrderManager {
  constructor() {
    this.orders = new Map(); // chatId -> order data
    this.loadOrders();
  }

  // Sipariş durumunu kontrol et
  getOrderStatus(chatId) {
    const order = this.orders.get(chatId);
    if (!order) return 'none';
    return order.status || 'none';
  }

  // Sipariş bilgilerini al
  getOrder(chatId) {
    return this.orders.get(chatId) || null;
  }

  // Sipariş başlat
  startOrder(chatId, contactName) {
    this.orders.set(chatId, {
      chatId,
      contactName,
      status: 'collecting',
      data: {
        name: null,
        address: null,
        phone: null
      },
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    this.saveOrders();
  }

  // Sipariş bilgisi güncelle
  updateOrderField(chatId, field, value) {
    const order = this.orders.get(chatId);
    if (!order) return false;

    if (field === 'name' || field === 'address' || field === 'phone') {
      order.data[field] = value;
      order.updatedAt = new Date().toISOString();
      this.orders.set(chatId, order);
      this.saveOrders();
      return true;
    }
    return false;
  }

  // Sipariş tamamlandı mı kontrol et
  isOrderComplete(chatId) {
    const order = this.orders.get(chatId);
    if (!order || order.status !== 'collecting') return false;

    return order.data.name && order.data.address && order.data.phone;
  }

  // Siparişi tamamla
  completeOrder(chatId) {
    const order = this.orders.get(chatId);
    if (!order) return false;

    if (this.isOrderComplete(chatId)) {
      order.status = 'completed';
      order.completedAt = new Date().toISOString();
      this.orders.set(chatId, order);
      this.saveOrders();
      return true;
    }
    return false;
  }

  // Eksik bilgileri kontrol et
  getMissingFields(chatId) {
    const order = this.orders.get(chatId);
    if (!order) return ['name', 'address', 'phone'];

    const missing = [];
    if (!order.data.name) missing.push('name');
    if (!order.data.address) missing.push('address');
    if (!order.data.phone) missing.push('phone');
    return missing;
  }

  // Mesajdan bilgi çıkar (basit parsing)
  extractOrderInfo(message) {
    const info = {
      name: null,
      address: null,
      phone: null
    };

    // Telefon numarası (5XX XXX XX XX veya 0XXX XXX XX XX formatı)
    const phoneRegex = /(0?5\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}|\d{10,11})/g;
    const phoneMatch = message.match(phoneRegex);
    if (phoneMatch) {
      info.phone = phoneMatch[0].replace(/[\s.-]/g, '');
    }

    // İsim (büyük harfle başlayan kelimeler, 2-3 kelime)
    const nameRegex = /([A-ZÇĞİÖŞÜ][a-zçğıöşü]+(?:\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+){1,2})/;
    const nameMatch = message.match(nameRegex);
    if (nameMatch) {
      info.name = nameMatch[1];
    }

    // Adres (mahalle, sokak, no, daire, ilçe, il gibi kelimeler içeren uzun metin)
    const addressKeywords = ['mahalle', 'sokak', 'cadde', 'no', 'daire', 'ilçe', 'il', 'apartman', 'blok', 'kat'];
    const hasAddressKeywords = addressKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    if (hasAddressKeywords || message.length > 30) {
      // İsim ve telefon çıkarıldıktan sonra kalan kısım adres olabilir
      let addressText = message;
      if (info.name) {
        addressText = addressText.replace(info.name, '').trim();
      }
      if (info.phone) {
        addressText = addressText.replace(phoneMatch[0], '').trim();
      }
      if (addressText.length > 10) {
        info.address = addressText;
      }
    }

    return info;
  }

  // Siparişleri dosyaya kaydet
  async saveOrders() {
    try {
      const ordersArray = Array.from(this.orders.values());
      await fs.writeFile(ORDERS_FILE, JSON.stringify(ordersArray, null, 2), 'utf-8');
    } catch (error) {
      console.error('Sipariş kaydetme hatası:', error);
    }
  }

  // Siparişleri dosyadan yükle
  async loadOrders() {
    try {
      const data = await fs.readFile(ORDERS_FILE, 'utf-8');
      const ordersArray = JSON.parse(data);
      this.orders = new Map(ordersArray.map(order => [order.chatId, order]));
      console.log(`📦 ${this.orders.size} sipariş yüklendi`);
    } catch (error) {
      // Dosya yoksa yeni başlat
      this.orders = new Map();
      console.log('📦 Yeni sipariş sistemi başlatıldı');
    }
  }

  // Tüm siparişleri getir
  getAllOrders() {
    return Array.from(this.orders.values());
  }

  // Tamamlanmış siparişleri getir
  getCompletedOrders() {
    return Array.from(this.orders.values()).filter(order => order.status === 'completed');
  }
}

