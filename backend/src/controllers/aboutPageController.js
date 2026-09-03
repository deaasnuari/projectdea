const AboutPage = require('../models/AboutPage')

// GET /api/about  (publik)
async function get(_req, res, next) {
  try {
    const data = await AboutPage.get()
    res.json(data || {}) // belum diisi → frontend pakai default-nya
  } catch (err) {
    next(err)
  }
}

// PUT /api/about  (admin) — simpan seluruh dokumen konten Tentang Kami
async function update(req, res, next) {
  try {
    const b = req.body
    if (!b || typeof b !== 'object' || Array.isArray(b)) {
      return res.status(400).json({ error: 'Body harus objek konten' })
    }
    res.json(await AboutPage.save(b))
  } catch (err) {
    next(err)
  }
}

module.exports = { get, update }
