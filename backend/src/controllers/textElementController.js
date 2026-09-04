const TextElement = require('../models/TextElement')

// GET /api/text-elements            → semua
// GET /api/text-elements?page=xxx   → per halaman
async function list(req, res, next) {
  try {
    const page = req.query.page ? String(req.query.page) : null
    const data = page ? await TextElement.byPage(page) : await TextElement.list()
    res.json({ data })
  } catch (err) {
    next(err)
  }
}

// GET /api/text-elements/:elementKey
async function getOne(req, res, next) {
  try {
    const row = await TextElement.get(req.params.elementKey)
    if (!row) return res.status(404).json({ error: 'Elemen tidak ditemukan' })
    res.json(row)
  } catch (err) {
    next(err)
  }
}

// PUT /api/text-elements/:elementKey  (admin) — simpan isi + styling
async function update(req, res, next) {
  try {
    const b = req.body || {}
    const saved = await TextElement.upsert(req.params.elementKey, {
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
    })
    res.json(saved)
  } catch (err) {
    if (/wajib/i.test(err.message)) return res.status(400).json({ error: err.message })
    next(err)
  }
}

// DELETE /api/text-elements/:elementKey  (admin) — kembalikan ke bawaan
async function remove(req, res, next) {
  try {
    await TextElement.remove(req.params.elementKey)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getOne, update, remove }
