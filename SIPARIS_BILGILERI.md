# 📦 Sipariş Bilgileri Depolama

## 📁 Dosya Konumu

Tüm siparişler **`siparisler.json`** dosyasında saklanır.

Bu dosya proje klasörünüzde otomatik olarak oluşturulur:
```
WP_BOT/
  ├── siparisler.json  ← Siparişler burada
  ├── bot.js
  └── ...
```

## 📋 Sipariş Formatı

Her sipariş şu bilgileri içerir:

```json
{
  "chatId": "905416321726@c.us",
  "contactName": "Mehmet Yılmaz",
  "status": "completed",
  "data": {
    "name": "Mehmet Yılmaz",
    "address": "Bahçeşehir 2.kısım mahallesi 651.ada a2 1 daire 24",
    "phone": "08503089983"
  },
  "startedAt": "2024-12-20T10:30:00.000Z",
  "completedAt": "2024-12-20T10:35:00.000Z",
  "updatedAt": "2024-12-20T10:35:00.000Z"
}
```

## 🔍 Sipariş Durumları

- **`collecting`**: Bilgi toplama aşamasında
- **`completed`**: Sipariş tamamlandı

## 📊 Sipariş Bilgileri

Her siparişte şu bilgiler saklanır:

1. **İsim Soyisim** (`name`)
2. **Detaylı Adres** (`address`) - PTT kargo için eksiksiz
3. **Telefon Numarası** (`phone`)

## 🔒 Güvenlik

- `siparisler.json` dosyası `.gitignore`'da (Git'e yüklenmez)
- Hassas müşteri bilgileri içerir
- Güvenli saklayın

## 📝 Kullanım

Siparişleri görmek için:
```bash
# Windows'ta
notepad siparisler.json

# Veya herhangi bir metin editörü ile açın
```

## 💡 İpucu

Siparişleri Excel'e aktarmak için:
1. `siparisler.json` dosyasını açın
2. JSON verilerini Excel'e kopyalayın
3. Veya online JSON to CSV converter kullanın

