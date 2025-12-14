import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// QR kod görüntüleme endpoint'i
let currentQR = null;

// QR kod güncelleme fonksiyonu (bot tarafından çağrılacak)
export function updateQR(qrCode) {
  currentQR = qrCode;
}

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WhatsApp Bot QR Code</title>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: #f5f5f5;
        }
        .container {
          text-align: center;
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        pre {
          background: #f0f0f0;
          padding: 20px;
          border-radius: 5px;
          font-size: 12px;
          line-height: 1.4;
        }
        .status {
          margin-top: 20px;
          padding: 10px;
          border-radius: 5px;
        }
        .connected {
          background: #d4edda;
          color: #155724;
        }
        .waiting {
          background: #fff3cd;
          color: #856404;
        }
      </style>
      <script>
        setInterval(() => location.reload(), 5000);
      </script>
    </head>
    <body>
      <div class="container">
        <h1>📱 WhatsApp Bot QR Code</h1>
        <div id="status" class="status waiting">QR kod bekleniyor...</div>
        <div id="qrcode"></div>
      </div>
      <script>
        const qr = \`${currentQR || 'Henüz QR kod oluşturulmadı'}\`;
        if (qr && qr !== 'Henüz QR kod oluşturulmadı') {
          document.getElementById('qrcode').innerHTML = '<pre>' + qr + '</pre>';
          document.getElementById('status').textContent = 'QR kodu WhatsApp ile tarayın';
          document.getElementById('status').className = 'status waiting';
        } else {
          document.getElementById('status').textContent = 'Bot başlatılıyor, lütfen bekleyin...';
        }
      </script>
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

