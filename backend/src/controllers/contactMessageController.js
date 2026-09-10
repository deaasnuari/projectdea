const ContactMessage = require('../models/ContactMessage')

// POST /api/contact-messages  (publik — dari formulir Kontak Kami)
async function create(req, res, next) {
  try {
    const b = req.body || {}
    const name = String(b.name || '').trim()
    const email = String(b.email || '').trim()
    const phone = String(b.phone || '').trim()
    const message = String(b.message || '').trim()
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Nama, email, no. HP, dan pesan wajib diisi' })
    }
    if (message.length > 5000) return res.status(400).json({ error: 'Pesan terlalu panjang' })
    // Wajib menyetujui pelindungan data pribadi (UU No. 27 Tahun 2022) dulu.
    if (b.consent !== true) {
      return res.status(400).json({ error: 'Persetujuan pelindungan data pribadi wajib diberikan' })
    }

    const row = await ContactMessage.create({ name, email, phone, message, consent: true })
    res.status(201).json({ id: row.id, created_at: row.created_at })
  } catch (err) {
    next(err)
  }
}

// GET /api/contact-messages?status=  (admin)
async function list(req, res, next) {
  try {
    res.json({
      data: await ContactMessage.list({ status: req.query.status }),
      stats: await ContactMessage.stats(),
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/contact-messages/stats  (admin) — dipakai badge sidebar & polling
async function stats(_req, res, next) {
  try {
    res.json(await ContactMessage.stats())
  } catch (err) {
    next(err)
  }
}

// PATCH /api/contact-messages/:id  (admin) — ubah status
async function updateStatus(req, res, next) {
  try {
    const row = await ContactMessage.updateStatus(req.params.id, req.body?.status)
    if (!row) return res.status(400).json({ error: 'Status tidak valid atau data tidak ditemukan' })
    res.json(row)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/contact-messages/:id  (admin)
async function remove(req, res, next) {
  try {
    const ok = await ContactMessage.remove(req.params.id)
    if (!ok) return res.status(404).json({ error: 'Pesan tidak ditemukan' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, list, stats, updateStatus, remove }
