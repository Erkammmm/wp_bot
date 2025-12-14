# 🚀 7/24 Ücretsiz Deployment Rehberi

## ⚠️ ÖNEMLİ NOT

**Internet olmadan çalışması mümkün değil** çünkü:
- WhatsApp Web internet gerektirir
- Gemini API internet gerektirir
- Cloud servisler internet gerektirir

**Ama PC kapalıyken çalışması için cloud'a deploy edebilirsiniz!**

---

## 🎯 En İyi Ücretsiz Seçenekler

### ⭐ SEÇENEK 1: Railway.app (ÖNERİLEN)

**Avantajlar:**
- ✅ Tamamen ücretsiz (500 saat/ay)
- ✅ Kolay kurulum
- ✅ Otomatik deploy
- ✅ 7/24 çalışır

**Adımlar:**

1. **GitHub'a Yükle**
   ```powershell
   git init
   git add .
   git commit -m "WhatsApp bot"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
   git push -u origin main
   ```

2. **Railway'a Deploy**
   - [Railway.app](https://railway.app) hesabı oluştur (GitHub ile giriş)
   - "New Project" → "Deploy from GitHub repo"
   - Reponuzu seçin
   - Settings > Variables > New Variable:
     - `GEMINI_API_KEY` = API key'iniz
     - `GEMINI_MODEL` = `gemini-2.5-flash` (opsiyonel)

3. **QR Kodu Al**
   - Yerel bilgisayarda `npm start` çalıştır
   - QR kodu tara
   - `.wwebjs_auth` klasörünü Railway'a yükle (Volume olarak)

**Ücretsiz Limit:** 500 saat/ay (ayın her günü 24 saat = 744 saat, yani yeterli!)

---

### ⭐ SEÇENEK 2: Render.com

**Avantajlar:**
- ✅ Ücretsiz tier var
- ✅ Kolay kurulum
- ⚠️ 15 dakika kullanılmazsa uyku moduna geçer (ama mesaj gelince uyanır)

**Adımlar:**

1. **GitHub'a Yükle** (yukarıdaki gibi)

2. **Render'a Deploy**
   - [Render.com](https://render.com) hesabı oluştur
   - "New Web Service" → GitHub repo'yu bağla
   - Ayarlar:
     - **Build Command:** `npm install`
     - **Start Command:** `node bot.js`
   - Environment Variables:
     - `GEMINI_API_KEY` = API key'iniz
     - `GEMINI_MODEL` = `gemini-2.5-flash`

3. **QR Kodu Al** (yukarıdaki gibi)

**Not:** Render ücretsiz tier'da 15 dakika kullanılmazsa uyku moduna geçer, ama mesaj gelince otomatik uyanır.

---

### ⭐ SEÇENEK 3: Fly.io

**Avantajlar:**
- ✅ Ücretsiz tier (3 shared-cpu-1x VM)
- ✅ 7/24 çalışır
- ✅ Hızlı

**Adımlar:**

1. **Fly.io CLI Kur**
   ```powershell
   # PowerShell'de
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login Ol**
   ```powershell
   fly auth login
   ```

3. **Deploy Et**
   ```powershell
   fly launch
   # Sorulara cevap ver, otomatik deploy eder
   ```

4. **Environment Variables Ekle**
   ```powershell
   fly secrets set GEMINI_API_KEY=your_key
   fly secrets set GEMINI_MODEL=gemini-2.5-flash
   ```

---

## 📋 Deployment Öncesi Kontrol Listesi

- [ ] GitHub hesabı var
- [ ] Kod GitHub'a yüklendi
- [ ] `.env` dosyası `.gitignore`'da (güvenlik)
- [ ] `siparisler.json` `.gitignore`'da
- [ ] `.wwebjs_auth` klasörü hazır (QR tarandı)

---

## 🔧 QR Kod Sorunu Çözümü

Cloud'da QR kod göremeyeceksiniz. İki yöntem:

### Yöntem 1: Yerel Bilgisayarda QR Tarla
1. Yerel bilgisayarda `npm start` çalıştır
2. QR kodu tara
3. `.wwebjs_auth` klasörünü bul
4. Cloud servise yükle (Volume/Storage olarak)

### Yöntem 2: Web Sunucusu Aktif Et
1. `.env` dosyasına ekle: `ENABLE_WEB_SERVER=true`
2. Cloud'da `PORT=3000` environment variable ekle
3. Cloud size bir URL verecek
4. Bu URL'den QR kodu görebilirsiniz

---

## ✅ Deployment Sonrası

1. **Logları Kontrol Et**
   - Railway/Render/Fly.io dashboard'dan logları görüntüleyin
   - "✅ WhatsApp bot hazır ve çalışıyor!" mesajını görmelisiniz

2. **Test Et**
   - Başka bir telefondan mesaj gönderin
   - Bot yanıt vermeli

3. **Siparişleri Kontrol Et**
   - Cloud servisinde `siparisler.json` dosyasını kontrol edin
   - Veya local'de indirip kontrol edin

---

## 💰 Maliyet

**Tüm seçenekler ücretsiz!**
- Railway: 500 saat/ay ücretsiz
- Render: Ücretsiz tier (uyku modu var)
- Fly.io: 3 VM ücretsiz

**Not:** WhatsApp Web ve Gemini API internet gerektirir, bu yüzden internet olmadan çalışmaz.

---

## 🆘 Sorun Giderme

### Bot bağlanmıyor
- `.wwebjs_auth` klasörünü kontrol edin
- Logları kontrol edin

### QR kod göremiyorum
- Web sunucusunu aktif edin (`ENABLE_WEB_SERVER=true`)
- Veya yerel bilgisayarda QR tarla, auth klasörünü yükle

### Mesajlar gelmiyor
- WhatsApp Business hesabı kullanıyor musunuz?
- Bot'un mesaj gönderme izni var mı?

---

## 🎯 Önerilen: Railway.app

En kolay ve en stabil seçenek Railway.app. Adım adım:

1. GitHub'a yükle
2. Railway'a bağla
3. Environment variables ekle
4. Deploy et
5. QR tarla (yerel bilgisayarda)
6. `.wwebjs_auth` klasörünü Railway'a yükle

**Hazır! Bot 7/24 çalışıyor! 🎉**

