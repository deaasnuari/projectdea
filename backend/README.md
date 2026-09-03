# LAZIS PLN Batam — Backend

API konten situs. **Express.js + PostgreSQL**. Jalan di port **3001**.

## Struktur

```
server.js                 entrypoint (express app, cors, mount /api)
src/
  config/db.js            pool PostgreSQL
  lib/session.js          token sesi (HMAC) + opsi cookie
  models/
    SiteContent.js        query tabel site_content
    Admin.js              verifikasi kredensial admin
  controllers/
    contentController.js  get / update konten
    authController.js      login / logout / me
    healthController.js
  middleware/requireAdmin.js
  routes/
    index.js  auth.routes.js  content.routes.js
db/
  schema.sql   setup.sql   defaults.js (data awal untuk seed)
scripts/migrate.js  scripts/seed.js
```

## Setup

```bash
cd backend
npm install
cp .env.example .env        # sesuaikan DATABASE_URL & SESSION_SECRET
```

### 1. Database

Sudah ada PostgreSQL jalan. Buat DB (kalau belum) & sesuaikan `DATABASE_URL` di `.env`.
Contoh bikin role+db khusus (jalankan sebagai `postgres`):

```bash
psql -U postgres -f db/setup.sql
```

### 2. Tabel + data awal

```bash
npm run db:migrate
npm run db:seed
# reset dari nol: npm run db:reset
```

### 3. Jalankan

```bash
npm run dev                 # http://localhost:3001 (auto-reload: node --watch)
curl http://localhost:3001/api/health
```

## Endpoint

| Method | Path | Akses |
|---|---|---|
| GET | `/api/health` | publik |
| POST | `/api/auth/login` | publik — body `{ username, password }`, set cookie sesi |
| POST | `/api/auth/logout` | publik |
| GET | `/api/auth/me` | publik — `{ admin: boolean }` |
| GET | `/api/content/:key` | publik |
| PUT | `/api/content/:key` | admin (cookie sesi) |

`:key` → `kami-peduli`, `tentang`, `kontak`, `donor`, `donation-methods`, `programs`, `blog`, `tim`.
Tiap key = satu dokumen JSON di tabel `site_content`.

## Frontend

`frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```
Login admin: `ADMIN_USERNAME` / `ADMIN_PASSWORD` di `.env`.
