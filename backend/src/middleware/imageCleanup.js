// Hapus file di Vercel Blob yang SUDAH TIDAK DIPAKAI setelah admin mengubah/menghapus data.
//
// Cara kerja (berlaku untuk semua fitur, termasuk gambar di dalam isi HTML/blok):
//   1. sebelum aksi admin: catat semua URL Blob yang tersimpan di database,
//   2. setelah aksi berhasil: catat lagi,
//   3. URL yang hilang dari SELURUH kolom database dihapus dari Blob.
// Gambar yang masih dipakai di mana pun (artikel lain, draf, halaman) tidak dihapus.
//
// Penghapusan tidak bisa dibatalkan, jadi hanya aktif di deployment production Vercel
// (VERCEL_ENV=production) atau bila sengaja diizinkan dengan BLOB_ALLOW_DELETE=1.
// Alasannya: database lokal/preview tidak tahu gambar mana yang dipakai production.
// Kegagalan di sini hanya dicatat di log dan tidak menggagalkan aksi admin.
const { query } = require('../config/db')
const { COOKIE_NAME, verifyToken } = require('../lib/session')
const { storageMode, deleteBlobs, scrub, BLOB_PREFIX } = require('../lib/imageStorage')
const log = require('../lib/logger')

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
const URL_PATTERN = `https://[a-z0-9-]+\\.public\\.blob\\.vercel-storage\\.com/${BLOB_PREFIX}[A-Za-z0-9._-]+`

const enabled = () =>
  storageMode() === 'blob' && (process.env.VERCEL_ENV === 'production' || process.env.BLOB_ALLOW_DELETE === '1')

const quote = (id) => `"${String(id).replace(/"/g, '""')}"`

// Semua URL Blob milik aplikasi yang tersimpan di kolom teks/JSON mana pun.
async function referencedUrls() {
  const { rows } = await query(
    `select table_name as t, column_name as c from information_schema.columns
     where table_schema = current_schema() and data_type in ('text', 'character varying', 'json', 'jsonb', 'ARRAY')`,
  )
  if (rows.length === 0) return new Set()
  // Pola tanpa grup tangkap → m[1] berisi seluruh URL yang cocok.
  const union = rows
    .map((r) => `select m[1] as url from ${quote(r.t)}, regexp_matches(${quote(r.c)}::text, $1, 'g') as m`)
    .join(' union ')
  const found = await query(union, [URL_PATTERN])
  return new Set(found.rows.map((r) => r.url))
}

async function imageCleanup(req, res, next) {
  if (!MUTATING.has(req.method) || /^\/(auth|uploads)(\/|$)/.test(req.path)) return next()
  if (!enabled() || !verifyToken(req.cookies?.[COOKIE_NAME])) return next()

  let before
  try {
    before = await referencedUrls()
  } catch (err) {
    log.warn('blob', 'Pembersihan gambar dilewati (gagal membaca database)', err)
    return next()
  }
  if (before.size === 0) return next()

  // Dikerjakan SEBELUM respons dikirim: di Vercel Functions, pekerjaan sesudah respons
  // bisa dihentikan di tengah jalan.
  const send = res.json.bind(res)
  res.json = (body) => {
    res.json = send
    if (res.statusCode >= 400) return send(body)
    referencedUrls()
      .then((after) => {
        const unused = [...before].filter((url) => !after.has(url))
        return unused.length ? deleteBlobs(unused) : null
      })
      .catch((err) => log.warn('blob', `Gagal menghapus gambar tak terpakai: ${scrub(err?.message)}`))
      .finally(() => send(body))
    return res
  }
  next()
}

module.exports = { imageCleanup, referencedUrls }
