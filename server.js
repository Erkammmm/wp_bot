import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// QR kod görüntüleme endpoint'i
let currentQR = null;
let currentQRImage = null;

// QR kod güncelleme fonksiyonu (bot tarafından çağrılacak)
export async function updateQR(qrCode) {
  currentQR = qrCode;
  
  // QR kod'u görsel olarak oluştur
  try {
    currentQRImage = await QRCode.toDataURL(qrCode, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 400
    });
  } catch (error) {
    console.error('QR kod görsel oluşturma hatası:', error);
    currentQRImage = null;
  }
}

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WhatsApp Bot QR Code</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 500px;
          width: 100%;
        }
        h1 {
          color: #333;
          margin-bottom: 20px;
          font-size: 24px;
        }
        .qr-container {
          margin: 30px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 15px;
        }
        .qr-image {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .status {
          margin-top: 20px;
          padding: 15px;
          border-radius: 10px;
          font-weight: 500;
        }
        .connected {
          background: #d4edda;
          color: #155724;
          border: 2px solid #c3e6cb;
        }
        .waiting {
          background: #fff3cd;
          color: #856404;
          border: 2px solid #ffeaa7;
        }
        .loading {
          background: #e7f3ff;
          color: #004085;
          border: 2px solid #b3d7ff;
        }
        .instructions {
          margin-top: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
          text-align: left;
          font-size: 14px;
          color: #555;
        }
        .instructions ol {
          margin-left: 20px;
          margin-top: 10px;
        }
        .instructions li {
          margin-bottom: 8px;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .loading .qr-image {
          animation: pulse 2s ease-in-out infinite;
        }
      </style>
      <script>
        // Her 3 saniyede bir sayfayı yenile
        setInterval(() => {
          if (!document.getElementById('qr-image') || !document.getElementById('qr-image').src) {
            location.reload();
          }
        }, 3000);
      </script>
    </head>
    <body>
      <div class="container">
        <h1>📱 WhatsApp Bot QR Code</h1>
        <div class="qr-container">
          ${currentQRImage ? 
            `<img id="qr-image" src="${currentQRImage}" alt="QR Code" class="qr-image" />` : 
            `<div style="padding: 40px; color: #999;">QR kod oluşturuluyor...</div>`
          }
        </div>
        <div id="status" class="status ${currentQRImage ? 'waiting' : 'loading'}">
          ${currentQRImage ? 
            '✅ QR kodu WhatsApp ile tarayın' : 
            '⏳ Bot başlatılıyor, lütfen bekleyin...'
          }
        </div>
        ${currentQRImage ? `
        <div class="instructions">
          <strong>Nasıl Tarayacaksınız?</strong>
          <ol>
            <li>WhatsApp'ınızı açın</li>
            <li>Ayarlar → Bağlı Cihazlar → Cihaz Bağla</li>
            <li>QR kodu telefonunuzla tarayın</li>
          </ol>
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `);
});

// QR kod güncelleme endpoint'i (bot tarafından kullanılacak)
app.post('/qr', express.json(), (req, res) => {
  currentQR = req.body.qr || null;
  res.json({ success: true });
});

app.get('/status', (req, res) => {
  res.json({ 
    qr_available: currentQR !== null,
    timestamp: new Date().toISOString()
  });
});

const server = app.listen(PORT, () => {
  console.log(`🌐 QR Code sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});

export default server;

