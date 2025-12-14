# 📸 Medya Dosyaları Rehberi

## 📁 Klasör Yapısı

Bot, `media` klasöründeki fotoğraf ve videoları otomatik olarak algılar ve müşteri istediğinde gönderir.

## 📂 Media Klasörü Oluşturma

1. Proje klasöründe `media` klasörü oluşturun
2. Fotoğraf ve videoları bu klasöre koyun

```
WP_BOT/
  ├── media/
  │   ├── mont-yakin-cekim.jpg
  │   ├── mont-detay.jpg
  │   └── mont-video.mp4
  ├── bot.js
  └── ...
```

## 🖼️ Desteklenen Formatlar

### Fotoğraflar:
- `.jpg`, `.jpeg`
- `.png`
- `.gif`
- `.webp`

### Videolar:
- `.mp4`
- `.mov`
- `.avi`
- `.webm`

## 🔍 Otomatik Algılama

Bot şu kelimeleri algıladığında medya gönderir:

**Fotoğraf için:**
- "fotoğraf", "fotograf"
- "resim"
- "görsel", "görüntü"
- "yakın çekim", "yakın"
- "detay", "detaylı foto"

**Video için:**
- "video", "videoyu"
- "video gönder", "video izle"

## 📝 Örnek Kullanım

Müşteri: "Yakın çekim fotoğraf gönderir misin?"
→ Bot otomatik olarak `media` klasöründeki ilk fotoğrafı gönderir

Müşteri: "Video var mı?"
→ Bot otomatik olarak `media` klasöründeki ilk videoyu gönderir

## ⚙️ Özelleştirme

`media-handler.js` dosyasında:
- Algılanacak kelimeleri değiştirebilirsiniz
- Dosya isimlerine göre özel eşleştirme yapabilirsiniz

## 📌 Notlar

- Bot başlatıldığında `media` klasörü otomatik oluşturulur
- Dosyalar proje klasöründe `media/` altında olmalıdır
- Birden fazla fotoğraf varsa ilk bulunan gönderilir

