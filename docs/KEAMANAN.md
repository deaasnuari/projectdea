# Dokumentasi Keamanan — Lazis PLN Batam

Dokumen ini mencatat audit keamanan dan perbaikan yang dilakukan pada aplikasi
(frontend Next.js + backend Express/PostgreSQL), cara mengujinya, dan hal yang
harus diatur saat deploy ke produksi.

## 1. Ringkasan

| # | Masalah / Risiko | Tingkat | Status |
|---|---|---|---|
| 1 | Ganti password publik tanpa password lama (pengambilalihan akun admin) | Kritis | Diperbaiki |
| 2 | Login bisa ditebak tanpa batas (brute force) | Tinggi | Diperbaiki |
| 3 | Secret sesi & password admin bawaan (`admin123`) bisa terpakai di produksi | Tinggi | Diperbaiki (server menolak start) |
| 4 | Tidak ada header keamanan HTTP | Sedang | Diperbaiki |
| 5 | Request pengubah data dari situs lain (CSRF) | Sedang | Diperbaiki |
| 6 | Endpoint publik (donasi) rentan spam/banjir request | Sedang | Diperbaiki |
| 7 | Upload gambar hanya memeriksa label tipe, bukan isi file | Sedang | Diperbaiki |
| 8 | Pesan error server membocorkan detail internal | Rendah | Diperbaiki |
| 9 | Kebijakan password lemah (min. 6 karakter) | Rendah | Diperbaiki |
| 10 | SQL injection | — | Sudah aman sejak awal (query berparameter) |

## 2. Detail perbaikan

### 2.1 Alur password
- **Ganti password** (`POST /api/auth/change-password`) kini wajib menyertakan
  `currentPassword` yang benar. Percobaan salah ikut dihitung oleh pembatas login.
- **Lupa password** memakai kode sekali pakai lewat email:
  1. `POST /api/auth/forgot-password` `{ username }` → kode 6 digit dikirim
     **hanya ke email yang terdaftar pada akun itu**. Jawaban API selalu sama,
     baik username ada maupun tidak, sehingga username tidak bisa ditebak.
  2. `POST /api/auth/reset-password` `{ username, code, newPassword }`.
  - Kode berlaku 15 menit, maksimal 5 percobaan, disimpan sebagai hash SHA-256
    dan dibandingkan dengan `timingSafeEqual`.
  - Akun tanpa email terdaftar tidak dapat memakai jalur ini.
- **Kebijakan password baru**: minimal 8 karakter, wajib huruf dan angka
  (`backend/src/lib/passwordPolicy.js`). Password disimpan dengan hash `scrypt`
  + salt acak. Login tidak memeriksa kebijakan ini, jadi akun lama tetap bisa masuk.

### 2.2 Anti brute force
Lima kali login gagal berturut-turut dari satu kombinasi **IP + username**
mengunci akses selama **15 menit** (HTTP 429 + header `Retry-After`). Login
berhasil mereset hitungan. Pesan penguncian ditampilkan apa adanya di form login.

### 2.3 Header keamanan (`backend/src/middleware/security.js`)
`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
`Content-Security-Policy` ketat, `Referrer-Policy: no-referrer`,
`Permissions-Policy`, serta `Strict-Transport-Security` saat produksi.
Header `X-Powered-By` dihapus.

### 2.4 Anti-CSRF dan CORS
- Request `POST/PUT/PATCH/DELETE` dengan header `Origin` dari situs yang tidak
  diizinkan ditolak (HTTP 403).
- CORS yang tidak diizinkan kini ditolak dengan benar (bukan error 500).
- Cookie sesi: `httpOnly`, `SameSite=Lax`, `Secure` di produksi, berlaku 7 hari,
  ditandatangani HMAC-SHA256.
- Origin yang diizinkan: `FRONTEND_ORIGIN` di `.env`; saat pengembangan juga
  `localhost` dan IP jaringan lokal (`192.168.x.x`, `10.x.x.x`, `172.16–31.x.x`).

### 2.5 Pembatasan request (rate limit)
| Endpoint | Batas per IP |
|---|---|
| Seluruh `/api` | 300 / menit |
| `POST /api/donations` | 5 / menit dan 30 / jam |
| `POST /api/contact-messages` | 2 / menit dan 10 / jam |
| `POST /api/auth/forgot-password`, `/reset-password` | 10 / jam |
| Login | kunci 15 menit setelah 5 kali gagal |

### 2.6 Upload gambar
Selain membatasi tipe (png/jpg/webp/gif) dan ukuran (maks. 5 MB), isi file kini
diperiksa lewat *magic bytes*. Hanya admin yang dapat mengunggah. SVG tidak diizinkan.

### 2.7 Penanganan error
Detail error internal hanya dikirim saat pengembangan. JSON rusak dibalas 400,
data terlalu besar dibalas 413.

### 2.8 Pengaman mode produksi
Dengan `NODE_ENV=production`, server **menolak start** bila `SESSION_SECRET`
kurang dari 32 karakter atau `ADMIN_PASSWORD` kosong / `admin123`.

### 2.9 SQL injection
Seluruh query memakai parameter (`$1, $2, …`); bagian dinamis (filter status,
sumber, dsb.) hanya menyusun nomor parameter dari daftar nilai yang sudah
divalidasi. Diuji dengan input `admin' or '1'='1` — login ditolak.

## 3. Cara pengujian

Jalankan backend, lalu:

```bash
# Header keamanan
curl -si http://localhost:3001/api/health | grep -iE "x-content|x-frame|content-security"

# Ganti password tanpa password lama → ditolak (400)
curl -s -X POST http://localhost:3001/api/auth/change-password \
  -H 'Content-Type: application/json' -d '{"username":"admin","newPassword":"hacked123"}'

# Origin asing → ditolak (403)
curl -s -X POST http://localhost:3001/api/auth/login -H 'Origin: http://evil.com' \
  -H 'Content-Type: application/json' -d '{"username":"a","password":"b"}'

# SQL injection → ditolak (401)
curl -s -X POST http://localhost:3001/api/auth/login -H 'Content-Type: application/json' \
  -d "{\"username\":\"admin' or '1'='1\",\"password\":\"x\"}"

# Brute force → percobaan ke-6 dan seterusnya dijawab 429
for i in 1 2 3 4 5 6 7; do curl -s -o /dev/null -w "$i:%{http_code} " \
  -X POST http://localhost:3001/api/auth/login -H 'Content-Type: application/json' \
  -d '{"username":"zz","password":"salah"}'; done
```

Hasil yang diharapkan: 400, 403, 401, dan `401 401 401 401 401 429 429`.

## 4. Konfigurasi produksi (wajib sebelum deploy)

Di `backend/.env`:

```env
NODE_ENV=production
SESSION_SECRET=<string acak, min. 32 karakter>
ADMIN_USERNAME=<username admin>
ADMIN_PASSWORD=<password kuat & unik, bukan admin123>
FRONTEND_ORIGIN=https://<domain-frontend>
TRUST_PROXY=1            # bila di belakang Nginx / hosting proxy
SMTP_USER=...            # email pengirim (untuk kode reset & pesan kontak)
SMTP_PASS=...            # App Password
MAIL_TO=<email resmi Lazis PLN>
```

Wajib menggunakan **HTTPS** agar cookie sesi (`Secure`) dan HSTS bekerja.

## 5. Keterbatasan dan saran lanjutan
- Penghitung login gagal, pembatas request, dan kode reset disimpan di memori
  server → hilang saat restart dan tidak dibagi antar-instance. Untuk beberapa
  server, pindahkan ke Redis.
- Sesi berupa token bertanda tangan tanpa daftar pencabutan; logout hanya
  menghapus cookie di browser. Pertimbangkan penyimpanan sesi di database bila
  perlu pencabutan paksa.
- Belum ada autentikasi dua faktor (2FA) dan pencatatan audit login.
- Akun bawaan dari `.env` tidak memiliki email, sehingga tidak bisa reset lewat
  email; buat akun admin dengan email di menu Daftar Akun.
- Disarankan menjalankan `npm audit` secara berkala untuk dependensi.

## 6. Berkas yang diubah / ditambahkan

| Berkas | Perubahan |
|---|---|
| `backend/server.js` | Header, origin guard, rate limit umum, pengaman produksi, handler error |
| `backend/src/middleware/security.js` | Header keamanan, origin guard, penghitung login gagal (baru) |
| `backend/src/lib/passwordPolicy.js` | Aturan password (baru) |
| `backend/src/controllers/authController.js` | Login terkunci, ganti password, lupa/reset password |
| `backend/src/routes/auth.routes.js`, `donations.routes.js` | Rate limit |
| `backend/src/controllers/uploadController.js` | Cek magic bytes |
| `backend/src/models/AdminAccount.js`, `lib/mailer.js` | Kebijakan password, tujuan email per-pesan |
| `frontend/app/login/LoginForm.jsx`, `services/adminAuth.js`, `services/adminAccounts.js` | Alur lupa password 2 langkah, pesan error login |
| `frontend/app/admin/daftar-akun/page.js` | Validasi password 8 karakter |
