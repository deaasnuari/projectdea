const TextElement = require('../models/TextElement')
const { COOKIE_NAME, verifyToken } = require('../lib/session')

// Cek sesi admin TANPA menolak request (dipakai di endpoint publik list/getOne
// supaya admin yang sedang login melihat draft-nya sendiri, sementara
// pengunjung biasa tetap cuma melihat versi yang sudah dipublikasikan).
function isAdminSession(req) {
  return verifyToken(req.cookies?.[COOKIE_NAME]) !== null
}

// GET /api/text-elements            → semua
// GET /api/text-elements?page=xxx   → per halaman
async function list(req, res, next) {
  try {
    const includeDraft = isAdminSession(req)
    const page = req.query.page ? String(req.query.page) : null
    const data = page
      ? await TextElement.byPage(page, { includeDraft })
      : await TextElement.list({ includeDraft })
    res.json({ data })
  } catch (err) {
    next(err)
  }
}

// GET /api/text-elements/:elementKey
async function getOne(req, res, next) {
  try {
    const includeDraft = isAdminSession(req)
    const row = await TextElement.get(req.params.elementKey, { includeDraft })
    if (!row) return res.status(404).json({ error: 'Elemen tidak ditemukan' })
    res.json(row)
  } catch (err) {
    next(err)
  }
}

// PUT /api/text-elements/:elementKey  (admin) — tahan isi + styling sebagai
// DRAFT. Belum tampil di halaman publik sampai admin klik "Selesai Edit"
// (lihat endpoint publish di bawah).
async function update(req, res, next) {
  try {
    const b = req.body || {}
    const saved = await TextElement.upsertDraft(req.params.elementKey, {
      page: b.page,
      section: b.section,
      content: b.content,
      fontFamily: b.fontFamily,
      fontSize: b.fontSize,
      fontWeight: b.fontWeight,
      fontStyle: b.fontStyle,
      textDecoration: b.textDecoration,
      textColor: b.textColor,
      textAlign: b.textAlign,
      lineHeight: b.lineHeight,
      letterSpacing: b.letterSpacing,
      offsetX: b.offsetX,
      offsetY: b.offsetY,
      boxWidth: b.boxWidth,
    })
    res.json(saved)
  } catch (err) {
    if (/wajib/i.test(err.message)) return res.status(400).json({ error: err.message })
    next(err)
  }
}

// DELETE /api/text-elements/:elementKey  (admin) — tahan "kembalikan ke
// bawaan" sebagai draft; baris live-nya baru benar-benar dihapus saat publish.
async function remove(req, res, next) {
  try {
    await TextElement.stageReset(req.params.elementKey)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

// POST /api/text-elements/publish  { page }  (admin) — "Selesai Edit": salin
// seluruh draft halaman ini ke kolom live, baru kelihatan di halaman publik.
async function publish(req, res, next) {
  try {
    const page = String((req.body || {}).page || '').trim()
    if (!page) return res.status(400).json({ error: 'page wajib diisi' })
    const result = await TextElement.publishPage(page)
    res.json({ ok: true, ...result })
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getOne, update, remove, publish }
