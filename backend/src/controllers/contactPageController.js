const ContactPage = require('../models/ContactPage')

// GET /api/contact  (publik)
async function get(_req, res, next) {
  try {
    const data = await ContactPage.get()
    res.json(data || { hero: {}, info: [], form: {} })
  } catch (err) {
    next(err)
  }
}

// PUT /api/contact  (admin) — simpan seluruh dokumen
async function update(req, res, next) {
  try {
    const b = req.body || {}
    if (typeof b !== 'object') return res.status(400).json({ error: 'Body harus objek' })
    res.json(await ContactPage.save({ hero: b.hero, info: b.info, form: b.form }))
  } catch (err) {
    next(err)
  }
}

module.exports = { get, update }
