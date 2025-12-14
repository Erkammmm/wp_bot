# 📱 QR Kod Tarama Rehberi (Railway.app)

## 🎯 Sorun: Cloud'da QR Kod Göremiyorum

Railway'da deploy ettiniz ama QR kod göremiyorsunuz. İki çözüm var:

---

## ✅ ÇÖZÜM 1: Web Sunucusu Aktif Et (ÖNERİLEN)

### Adım 1: Railway'da Environment Variable Ekle

1. Railway dashboard'a gidin
2. Projenize tıklayın
3. **Variables** sekmesine gidin
4. **New Variable** butonuna tıklayın
5. Şu değişkenleri ekleyin:

```
ENABLE_WEB_SERVER=true
PORT=3000
```

### Adım 2: Railway URL'ini Alın

1. Railway dashboard'da **Settings** sekmesine gidin
2. **Generate Domain** butonuna tıklayın
3. Size bir URL verecek (örn: `whatsapp-bot-production.up.railway.app`)

### Adım 3: QR Kodu Görüntüle

1. Bot'u yeniden başlatın (Railway'da **Redeploy** veya otomatik restart)
2. Railway URL'inize gidin (örn: `https://whatsapp-bot-production.up.railway.app`)
3. QR kod ekranda görünecek
4. WhatsApp'ınızı açın → **Ayarlar > Bağlı Cihazlar > Cihaz Bağla**
5. QR kodu tarayın

### Adım 4: Kontrol Et

1. Railway **Logs** sekmesine gidin
2. Şu mesajı görmelisiniz: `✅ WhatsApp bot hazır ve çalışıyor!`
3. WhatsApp'tan test mesajı gönderin

---

## ✅ ÇÖZÜM 2: Yerel Bilgisayarda QR Tarla (Alternatif)

Eğer web sunucusu çalışmazsa:

### Adım 1: Yerel Bilgisayarda Çalıştır

```powershell
cd C:\Users\cetki\Desktop\WP_BOT
npm start
```

### Adım 2: QR Kodu Tara

1. Terminalde QR kod görünecek
2. WhatsApp'ınızı açın → **Ayarlar > Bağlı Cihazlar > Cihaz Bağla**
3. QR kodu tarayın

### Adım 3: Auth Klasörünü Railway'a Yükle

1. `.wwebjs_auth` klasörünü bulun (proje klasöründe)
2. Bu klasörü Railway'a yüklemek için:
   - Railway'da **Volumes** sekmesine gidin
   - Veya Railway CLI kullanın

**Not:** Bu yöntem daha karmaşık, Çözüm 1'i öneriyoruz.

---

## 🔧 Sorun Giderme

### QR Kod Görünmüyor

1. **Environment Variables Kontrol:**
   - `ENABLE_WEB_SERVER=true` var mı?
   - `PORT=3000` var mı?

2. **Logları Kontrol:**
   - Railway **Logs** sekmesinde hata var mı?
   - `🌐 QR Code sunucusu http://localhost:3000 adresinde çalışıyor` mesajı var mı?

3. **URL Kontrol:**
   - Railway domain'i oluşturuldu mu?
   - URL'e erişebiliyor musunuz?

### Bot Bağlanmıyor

1. **QR Kodu Yeniden Oluştur:**
   - Railway'da bot'u restart edin
   - Yeni QR kod oluşacak

2. **Auth Klasörünü Sil:**
   - Railway'da `.wwebjs_auth` klasörünü silin (varsa)
   - Yeniden QR tara

### Web Sunucusu Çalışmıyor

1. **server.js Kontrol:**
   - `server.js` dosyası projede var mı?
   - Railway'a yüklendi mi?

2. **Port Kontrol:**
   - Railway otomatik port atar
   - `PORT` environment variable'ı ekleyin

---

## 📋 Hızlı Kontrol Listesi

- [ ] Railway'da `ENABLE_WEB_SERVER=true` eklendi
- [ ] Railway'da `PORT=3000` eklendi (veya Railway otomatik port kullanıyor)
- [ ] Railway domain oluşturuldu
- [ ] Bot restart edildi
- [ ] Railway URL'ine gidildi
- [ ] QR kod görüntülendi
- [ ] WhatsApp'ta QR kod tarandı
- [ ] Loglarda "✅ WhatsApp bot hazır" mesajı var

---

## 🎯 Önerilen: Çözüm 1 (Web Sunucusu)

En kolay ve hızlı yöntem web sunucusunu aktif etmek. Sadece 2 environment variable ekleyip Railway URL'inden QR kodu görebilirsiniz.

**Başarılar! 🚀**

