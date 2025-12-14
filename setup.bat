@echo off
echo ====================================
echo WhatsApp Bot Kurulum
echo ====================================
echo.

echo [1/3] Node.js kontrol ediliyor...
node --version >nul 2>&1
if errorlevel 1 (
    echo HATA: Node.js bulunamadi!
    echo Lutfen Node.js kurun: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js bulundu!
echo.

echo [2/3] Bagimliliklari yukleniyor...
call npm install
if errorlevel 1 (
    echo HATA: npm install basarisiz!
    pause
    exit /b 1
)
echo Bagimliliklar yuklendi!
echo.

echo [3/3] .env dosyasi kontrol ediliyor...
if not exist .env (
    echo .env dosyasi bulunamadi!
    echo.
    echo Lutfen .env dosyasi olusturun ve icerisine su satiri ekleyin:
    echo GEMINI_API_KEY=your_api_key_here
    echo.
    echo Gemini API Key almak icin: https://makersuite.google.com/app/apikey
    echo.
    pause
    exit /b 1
)
echo .env dosyasi bulundu!
echo.

echo ====================================
echo Kurulum tamamlandi!
echo ====================================
echo.
echo Botu baslatmak icin: npm start
echo.
pause

