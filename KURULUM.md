# 🚀 Hızlı Kurulum Rehberi

## Adım 1: Gereksinimler

- Node.js 18 veya üzeri ([İndir](https://nodejs.org/))
- WhatsApp Business hesabı
- Gemini API Key ([Al](https://makersuite.google.com/app/apikey))

## Adım 2: Projeyi Hazırlama

```bash
# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
echo GEMINI_API_KEY=your_api_key_here > .env
```

`.env` dosyasını açıp `your_api_key_here` yerine Gemini API key'inizi yazın.

## Adım 3: İlk Çalıştırma

```bash
npm start
```

Terminalde QR kod çıkacak. WhatsApp'ınızı açıp **Ayarlar > Bağlı Cihazlar > Cihaz Bağla** ile QR kodu tarayın.

## Adım 4: Cloud'a Deploy (7/24 Çalışma)

### Railway.app (Önerilen - Ücretsiz)

1. [Railway.app](https://railway.app) hesabı oluştur
2. GitHub repo'nuzu bağla
3. "New Project" → "Deploy from GitHub repo"
4. Environment Variables'a `GEMINI_API_KEY` ekle
5. Deploy!

**ÖNEMLİ:** Cloud'da QR kod göremeyeceksiniz. İki seçenek:

**Seçenek A:** Yerel bilgisayarda QR tarat, `.wwebjs_auth` klasörünü Railway'a yükle
**Seçenek B:** Web sunucusunu aktif et (`ENABLE_WEB_SERVER=true`) ve Railway URL'inden QR'ı gör

### Render.com

1. [Render.com](https://render.com) hesabı oluştur
2. "New Web Service" → GitHub repo'yu bağla
3. Build: `npm install`
4. Start: `node bot.js`
5. Environment: `GEMINI_API_KEY=your_key`

## Adım 5: Test

Bot çalıştıktan sonra WhatsApp'tan kendinize mesaj gönderin. Bot otomatik yanıt verecek!

## 🔧 Opsiyonel Ayarlar

### Web Sunucusu (QR Kod Görüntüleme)

`.env` dosyasına ekleyin:
```
ENABLE_WEB_SERVER=true
PORT=3000
```

Sonra `http://localhost:3000` adresinden QR kodu görebilirsiniz.

### Docker ile Çalıştırma

```bash
docker-compose up -d
```

## ❓ Sorun Giderme

**Bot bağlanmıyor:**
- `.wwebjs_auth` klasörünü silip yeniden QR tarayın
- WhatsApp Web'in başka yerde açık olmadığından emin olun

**Mesajlar gelmiyor:**
- WhatsApp Business hesabı kullanıyorsanız emin olun
- Bot'un mesaj gönderme izni olduğundan emin olun

**Gemini API hatası:**
- API key'in doğru olduğundan emin olun
- Quota limitini kontrol edin

## 📊 İstatistikler

Bot çalışırken konsolda göreceksiniz:
- ✅ Bağlantı durumu
- 📨 Gelen mesajlar
- ✅ Gönderilen yanıtlar

---

**Başarılar! 🎉**

