@echo off
rem Klik dua kali untuk menjalankan uji performa dan membuka tampilan webnya.
rem Sebelum itu:
rem   1. Frontend (3000) hidup.
rem   2. Backend (3001) hidup, dijalankan dengan batas API dinaikkan (hanya untuk uji lokal):
rem        cd backend
rem        $env:API_RATE_LIMIT="100000"; npm run dev
rem      Tanpa itu, sebagian request akan 429 karena batas 300/menit per IP.
rem Tutup jendela ini (atau Ctrl+C) untuk berhenti.
cd /d "%~dp0.."
start "" cmd /c "timeout /t 4 >nul & start http://localhost:8089"
python -m locust --config loadtest/locust.conf
pause
