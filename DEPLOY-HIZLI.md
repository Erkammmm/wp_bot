# ⚡ Hızlı Deployment (5 Dakika)

## 🎯 Railway.app ile 7/24 Ücretsiz Çalıştırma

### Adım 1: GitHub'a Yükle (2 dakika)

```powershell
# Git kurulu değilse: https://git-scm.com/downloads

git init
git add .
git commit -m "WhatsApp bot"
git branch -M main

# GitHub'da yeni repo oluştur, sonra:
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
git push -u origin main
```

### Adım 2: Railway'a Deploy (2 dakika)

1. [railway.app](https://railway.app) → "Start a New Project"
2. "Deploy from GitHub repo" seç
3. Reponuzu seçin
4. Settings > Variables:
   - `GEMINI_API_KEY` = API key'iniz
   - `GEMINI_MODEL` = `gemini-2.5-flash` (opsiyonel)

### Adım 3: QR Kod (1 dakika)

**Yerel bilgisayarda:**
```powershell
npm start
```
QR kodu tara, sonra `.wwebjs_auth` klasörünü Railway'a yükle.

**VEYA** Web sunucusunu aktif et:
- Railway'da `ENABLE_WEB_SERVER=true` ekle
- Railway size URL verecek, oradan QR gör

### ✅ Hazır!

Bot artık 7/24 çalışıyor! PC kapalı olsa bile.

---

## 📱 Alternatif: Render.com

1. [render.com](https://render.com) → "New Web Service"
2. GitHub repo'yu bağla
3. Build: `npm install`
4. Start: `node bot.js`
5. Environment: `GEMINI_API_KEY=your_key`

**Not:** Render ücretsiz tier'da 15 dakika kullanılmazsa uyku moduna geçer, ama mesaj gelince uyanır.

---

## ⚠️ ÖNEMLİ

**Internet olmadan çalışmaz** çünkü:
- WhatsApp Web internet gerektirir
- Gemini API internet gerektirir

**Ama PC kapalıyken çalışır** (cloud'da olduğu için)!

