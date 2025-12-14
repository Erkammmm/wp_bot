# 🚀 Başlangıç Rehberi - Adım Adım

## 📋 ADIM 1: Gereksinimleri Kontrol Et

### Node.js Kurulu mu?
PowerShell'de şu komutu çalıştır:
```powershell
node --version
```

Eğer hata verirse, [Node.js'i indirip kurun](https://nodejs.org/) (18 veya üzeri versiyon)

### Gemini API Key'iniz var mı?
- [Google AI Studio](https://makersuite.google.com/app/apikey) adresine gidin
- API Key oluşturun (ücretsiz)
- Key'i kopyalayın

---

## 📋 ADIM 2: Projeyi Hazırla

### 1. Bağımlılıkları Yükle
PowerShell'de proje klasöründe:
```powershell
npm install
```

### 2. .env Dosyası Oluştur
Proje klasöründe `.env` dosyası oluşturun ve içine şunu yazın:
```
GEMINI_API_KEY=AIzaSy...buraya_api_key_yapistir
GEMINI_MODEL=gemini-2.5-flash
```

**ÖNEMLİ:** 
- `GEMINI_API_KEY`: Google AI Studio'dan aldığınız API key
- `GEMINI_MODEL`: `gemini-2.5-flash` (hafif ve güçlü - önerilen)

---

## 📋 ADIM 3: İlk Test (Yerel Bilgisayarda)

### Botu Başlat
```powershell
npm start
```

### QR Kodu Tara
1. Terminalde QR kod çıkacak
2. WhatsApp'ınızı açın
3. **Ayarlar > Bağlı Cihazlar > Cihaz Bağla**
4. QR kodu tarayın

### Test Et
WhatsApp'tan kendinize mesaj gönderin. Bot yanıt vermeli!

---

## 📋 ADIM 4: 7/24 Çalışma İçin Cloud'a Deploy

Bilgisayarınız kapalıyken de çalışması için cloud'a deploy etmeniz gerekiyor.

### ⭐ SEÇENEK 1: Railway.app (ÖNERİLEN - ÜCRETSİZ)

#### 1. GitHub'a Yükle
```powershell
# Git kurulu değilse: https://git-scm.com/downloads

git init
git add .
git commit -m "WhatsApp bot"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
git push -u origin main
```

**Not:** GitHub hesabınız yoksa [buradan oluşturun](https://github.com)

#### 2. Railway'a Deploy Et
1. [Railway.app](https://railway.app) hesabı oluştur (GitHub ile giriş yap)
2. "New Project" tıkla
3. "Deploy from GitHub repo" seç
4. Reponuzu seçin
5. "Settings" > "Variables" > "New Variable"
   - Name: `GEMINI_API_KEY`
   - Value: Gemini API key'iniz
6. Deploy başlar, 2-3 dakika sürer

#### 3. QR Kodu Al (ÖNEMLİ!)
Cloud'da QR kod göremeyeceksiniz. İki seçenek:

**Yöntem A: Yerel Bilgisayarda QR Tarat**
1. Yerel bilgisayarda `npm start` çalıştır
2. QR kodu tara
3. `.wwebjs_auth` klasörünü bul
4. Bu klasörü Railway'a yükle (Volume olarak)

**Yöntem B: Web Sunucusu Aktif Et**
1. `.env` dosyasına ekle: `ENABLE_WEB_SERVER=true`
2. Railway'da `PORT` environment variable ekle: `3000`
3. Railway size bir URL verecek (örn: `https://your-app.railway.app`)
4. Bu URL'den QR kodu görebilirsiniz

---

### ⭐ SEÇENEK 2: Render.com (ÜCRETSİZ)

1. [Render.com](https://render.com) hesabı oluştur
2. "New Web Service" tıkla
3. GitHub repo'nuzu bağla
4. Ayarlar:
   - **Build Command:** `npm install`
   - **Start Command:** `node bot.js`
5. "Environment" sekmesine git
6. `GEMINI_API_KEY` ekle
7. Deploy!

---

### ⭐ SEÇENEK 3: Kendi Bilgisayarınızda 7/24 (Gelişmiş)

Bilgisayarınızın sürekli açık kalması gerekir.

#### Windows'ta Servis Olarak Çalıştırma:

1. **PM2 Kur** (Node.js process manager):
```powershell
npm install -g pm2
```

2. **Botu PM2 ile Başlat**:
```powershell
pm2 start bot.js --name whatsapp-bot
```

3. **Otomatik Başlatma**:
```powershell
pm2 startup
pm2 save
```

Artık bilgisayar açıldığında bot otomatik başlayacak!

---

## ✅ Kontrol Listesi

- [ ] Node.js kurulu
- [ ] Gemini API Key alındı
- [ ] `npm install` çalıştırıldı
- [ ] `.env` dosyası oluşturuldu ve API key eklendi
- [ ] Yerel test yapıldı (QR kod tarandı)
- [ ] Cloud'a deploy edildi (Railway/Render)
- [ ] QR kod cloud'da tarandı veya yerel auth yüklendi
- [ ] Bot 7/24 çalışıyor!

---

## 🆘 Sorun mu Var?

### Bot bağlanmıyor
- `.wwebjs_auth` klasörünü sil, yeniden QR tara
- WhatsApp Web başka yerde açık mı kontrol et

### Cloud'da QR göremiyorum
- Web sunucusunu aktif et (`ENABLE_WEB_SERVER=true`)
- Veya yerel bilgisayarda QR tara, `.wwebjs_auth` klasörünü yükle

### Mesajlar gelmiyor
- WhatsApp Business hesabı kullanıyor musunuz?
- Bot'un mesaj gönderme izni var mı?

---

## 📞 Yardım

Herhangi bir sorun olursa:
1. Konsol loglarını kontrol edin
2. `siparisler.json` dosyasını kontrol edin (siparişler kaydediliyor mu?)
3. Railway/Render loglarını kontrol edin

**Başarılar! 🎉**

