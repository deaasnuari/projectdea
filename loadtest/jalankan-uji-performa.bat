@echo off
setlocal
rem Klik dua kali untuk uji performa lengkap: backend + frontend + Locust + browser.
rem  - Backend dinyalakan di jendela baru dengan batas API dinaikkan (HANYA untuk uji lokal).
rem  - Frontend dinyalakan di jendela baru kalau belum hidup.
rem  - Locust jalan otomatis (30 pengguna) lalu browser membuka http://localhost:8089
rem Selesai uji: tutup jendela Locust DAN jendela "Backend (uji performa)" supaya batas API kembali 300/menit.
cd /d "%~dp0.."

netstat -ano | findstr /R /C:":3001 .*LISTENING" >nul
if %errorlevel%==0 (
  echo.
  echo Backend sudah berjalan di port 3001 dengan batas API bawaan ^(300 request/menit^).
  echo Tutup dulu terminal backend itu ^(tekan Ctrl+C^), lalu jalankan file ini lagi.
  echo Kalau tidak, sebagian request akan gagal 429 dan hasil ujinya menyesatkan.
  echo.
  pause
  exit /b 1
)

echo Menyalakan backend dengan batas API dinaikkan...
start "Backend (uji performa)" cmd /k "cd /d backend && set API_RATE_LIMIT=100000&& npm run dev"

netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul
if not %errorlevel%==0 (
  echo Menyalakan frontend ^(build dulu, sekitar 15-30 detik^)...
  start "Frontend (uji performa)" cmd /k "cd /d frontend && npm run dev"
)

echo Menunggu backend dan frontend siap...
set /a n=0
:tunggu
curl.exe -s -f -o nul http://localhost:3001/api/health && curl.exe -s -f -o nul http://localhost:3000/login && goto siap
set /a n+=1
if %n% GEQ 60 (
  echo Server belum siap setelah 2 menit. Cek jendela backend dan frontend, lalu jalankan lagi.
  pause
  exit /b 1
)
timeout /t 2 >nul
goto tunggu

:siap
echo Siap. Membuka tampilan Locust...
start "" cmd /c "timeout /t 3 >nul & start http://localhost:8089"
python -m locust --config loadtest/locust.conf
echo.
echo Selesai. Tutup jendela "Backend (uji performa)" supaya batas API kembali 300/menit.
pause
