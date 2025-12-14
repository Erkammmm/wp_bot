# 🔑 Gemini API Key Alma Rehberi

## ⚠️ ÖNEMLİ: Doğru Yerden Alın!

Gemini API key'i **Google AI Studio**'dan alınmalı, Google Cloud Console'dan değil!

## 📋 Adım Adım:

### 1. Google AI Studio'ya Git
https://makersuite.google.com/app/apikey

### 2. Google Hesabınızla Giriş Yapın

### 3. "Create API Key" Butonuna Tıklayın

### 4. Proje Seçin veya Yeni Proje Oluşturun
- Eğer "Create API Key in new project" seçeneği varsa onu seçin
- Veya mevcut bir projeyi seçin

### 5. API Key'i Kopyalayın
- Oluşturulan API key'i kopyalayın
- Format: `AIzaSy...` şeklinde olmalı

### 6. .env Dosyasına Ekleyin
```
GEMINI_API_KEY=AIzaSy...buraya_yapistir
```

## ✅ Kontrol:
- API key `AIzaSy` ile başlamalı
- Uzunluğu yaklaşık 39 karakter olmalı
- Google AI Studio'dan alınmış olmalı (Google Cloud Console değil!)

## ❌ YANLIŞ:
- Google Cloud Console'dan API key almak
- Service Account key kullanmak
- OAuth credentials kullanmak

## ✅ DOĞRU:
- Google AI Studio'dan API key almak
- "Create API Key" butonunu kullanmak

---

**Not:** Eğer hala çalışmıyorsa, API key'inizi Google AI Studio'da kontrol edin ve gerekirse yeni bir tane oluşturun.

