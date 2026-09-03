const HomePage = require('../models/HomePage')

// GET /api/home  (publik)
async function get(_req, res, next) {
  try {
    const data = await HomePage.get()
    res.json(data || {}) // belum diisi → frontend pakai default-nya
  } catch (err) {
    next(err)
  }
}

// PUT /api/home  (admin) — simpan seluruh dokumen konten "Kami Peduli"
async function update(req, res, next) {
  try {
    const b = req.body
    if (!b || typeof b !== 'object' || Array.isArray(b)) {
      return res.status(400).json({ error: 'Body harus objek konten' })
    }
    res.json(await HomePage.save(b))
  } catch (err) {
    next(err)
  }
}

module.exports = { get, update }
