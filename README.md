# WhatsApp Business Satış Asistanı Bot

Instagram reklamlarından gelen müşterilerle otomatik sohbet eden, 7/24 çalışan WhatsApp satış asistanı.

## 🎯 Özellikler

- ✅ 7/24 otomatik çalışma
- ✅ Gemini AI ile doğal sohbet
- ✅ İnsan gibi davranış (3-5 saniye gecikme)
- ✅ Konuşma geçmişi takibi
- ✅ **Otomatik sipariş alma sistemi**
- ✅ **Sipariş bilgilerini otomatik toplama ve kaydetme**
- ✅ Mont satışı için optimize edilmiş
- ✅ Docker ile kolay deployment
- ✅ Cloud-ready (Railway, Render, Heroku vb.)

## 🚀 Hızlı Başlangıç

### 1. Gereksinimler

- Node.js 18+ 
- WhatsApp Business hesabı
- Gemini API Key ([Google AI Studio](https://makersuite.google.com/app/apikey) üzerinden alın)

### 2. Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env

# .env dosyasını düzenle ve GEMINI_API_KEY'i ekle
# GEMINI_API_KEY=your_api_key_here
```

### 3. Çalıştırma

#### Yerel Bilgisayarda:

```bash
npm start
```

İlk çalıştırmada QR kod çıkacak. WhatsApp'ınızı açıp QR kodu tarayın.

#### Docker ile:

```bash
# Docker Compose ile başlat
docker-compose up -d

# Logları görüntüle
docker-compose logs -f
```

## ☁️ Cloud Deployment (7/24 Çalışma)

### Railway.app (Önerilen - Ücretsiz)

1. [Railway.app](https://railway.app) hesabı oluştur
2. "New Project" → "Deploy from GitHub repo"
3. Repoyu seç ve deploy et
4. Environment Variables'a `GEMINI_API_KEY` ekle
5. Deploy tamamlandığında bot otomatik çalışır

### Render.com

1. [Render.com](https://render.com) hesabı oluştur
2. "New Web Service" → GitHub repo'yu bağla
3. Build Command: `npm install`
4. Start Command: `node bot.js`
5. Environment Variables'a `GEMINI_API_KEY` ekle

### Heroku

1. Heroku CLI ile login ol
2. `heroku create whatsapp-sales-bot`
3. `heroku config:set GEMINI_API_KEY=your_key`
4. `git push heroku main`

## 📱 WhatsApp Bağlantısı

**ÖNEMLİ:** Cloud'da çalışırken QR kod göremeyeceksiniz. İki seçenek:

### Seçenek 1: Yerel Bilgisayarda QR Tarat, Sonra Cloud'a Deploy

1. Yerel bilgisayarda `npm start` çalıştır
2. QR kodu WhatsApp ile tara
3. `.wwebjs_auth` klasörünü cloud'a yükle (volume olarak)

### Seçenek 2: Remote QR Code (Gelişmiş)

QR kodunu web üzerinden göstermek için ek bir endpoint ekleyebiliriz.

## 🔧 Yapılandırma

### Environment Variables

- `GEMINI_API_KEY`: Gemini API anahtarı (zorunlu)

### Bot Ayarları

`bot.js` dosyasında aşağıdaki ayarları değiştirebilirsiniz:

- Gecikme süresi (varsayılan: 3-5 saniye)
- Konuşma geçmişi saklama süresi (varsayılan: 24 saat)
- Maksimum mesaj uzunluğu

## 📊 İstatistikler ve Loglar

Bot çalışırken konsolda şunları göreceksiniz:

- ✅ Bağlantı durumu
- 📨 Gelen mesajlar
- ✅ Gönderilen yanıtlar
- 🛒 Yeni siparişler
- 📝 Sipariş bilgileri (isim, telefon, adres)
- ✅ Tamamlanan siparişler
- ❌ Hatalar

## 📦 Sipariş Yönetimi

Bot müşteri satın almaya ikna olduğunda otomatik olarak:

1. **Sipariş başlatır** - "alacağım", "sipariş" gibi kelimeler algılanır
2. **Bilgileri toplar** - İsim, adres, telefon numarası
3. **Kaydeder** - Tüm siparişler `siparisler.json` dosyasına kaydedilir
4. **Onay gönderir** - Müşteriye sipariş özeti gönderilir

### Sipariş Bilgileri

- 👤 **İsim Soyisim**
- 📍 **Detaylı Adres** (PTT kargo için eksiksiz - mahalle, sokak, no, daire, ilçe, il)
- 📞 **Telefon Numarası**

Siparişler `siparisler.json` dosyasında saklanır. Bu dosya otomatik olarak oluşturulur.

## 🛠️ Sorun Giderme

### Bot bağlanmıyor

- WhatsApp Web'in başka bir yerde açık olmadığından emin olun
- `.wwebjs_auth` klasörünü silip yeniden QR tarayın

### Mesajlar gelmiyor

- WhatsApp Business hesabı kullanıyorsanız emin olun
- Bot'un mesaj gönderme izni olduğundan emin olun

### Gemini API hatası

- API key'in doğru olduğundan emin olun
- API quota limitini kontrol edin

## 📝 Notlar

- Bot sadece bireysel sohbetlerde çalışır (grup mesajlarını yok sayar)
- Her müşteri için ayrı konuşma geçmişi tutulur
- 24 saatten eski konuşmalar otomatik temizlenir
- Bot kendi gönderdiği mesajları yok sayar

## 🔒 Güvenlik

- `.env` dosyasını asla commit etmeyin
- API key'lerinizi güvende tutun
- WhatsApp oturum verilerini (`wwebjs_auth`) güvenli saklayın

## 📞 Destek

Sorunlar için GitHub Issues kullanabilirsiniz.

---

**Not:** Bu bot WhatsApp Web API'sini kullanır. WhatsApp'ın resmi API'si değildir ve kullanım şartlarına dikkat edin.

