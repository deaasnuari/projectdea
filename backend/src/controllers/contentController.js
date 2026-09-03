const SiteContent = require('../models/SiteContent')
const { ALL, CONTENT_KEYS } = require('../../db/defaults')

// GET /api/content/:key  (publik)
async function get(req, res, next) {
  try {
    const { key } = req.params
    if (!CONTENT_KEYS.includes(key)) return res.status(404).json({ error: 'Key tidak dikenal' })

    const row = await SiteContent.findByKey(key)
    if (!row) {
      // Belum di-seed — kembalikan default supaya frontend tetap jalan.
      return res.json({ key, data: ALL[key], updated_at: null })
    }
    res.json({ key, data: row.data, updated_at: row.updated_at })
  } catch (err) {
    next(err)
  }
}

// PUT /api/content/:key  (admin)
async function update(req, res, next) {
  try {
    const { key } = req.params
    if (!CONTENT_KEYS.includes(key)) return res.status(404).json({ error: 'Key tidak dikenal' })

    const data = req.body
    if (data === null || typeof data !== 'object') {
      return res.status(400).json({ error: 'Body harus objek atau array' })
    }

    const row = await SiteContent.upsert(key, data)
    res.json({ key, data: row.data, updated_at: row.updated_at })
  } catch (err) {
    next(err)
  }
}

module.exports = { get, update }
