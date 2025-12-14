@echo off
echo ====================================
echo WhatsApp Bot Baslatiliyor...
echo ====================================
echo.

if not exist .env (
    echo HATA: .env dosyasi bulunamadi!
    echo Lutfen once setup.bat calistirin.
    pause
    exit /b 1
)

echo Bot baslatiliyor...
echo QR kod terminalde gorunecek.
echo.
echo WhatsApp'ta: Ayarlar ^> Bagli Cihazlar ^> Cihaz Bagla
echo.

call npm start

pause

