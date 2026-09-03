const DonationType = require('../models/DonationType')

// GET /api/donation-types?scope=  (publik)
async function list(req, res, next) {
  try {
    res.json({ data: await DonationType.list(req.query.scope) })
  } catch (err) {
    next(err)
  }
}

// POST /api/donation-types  (admin)
async function create(req, res, next) {
  try {
    const b = req.body || {}
    const label = String(b.label || '').trim()
    if (!label) return res.status(400).json({ error: 'Nama jenis donasi wajib diisi' })
    const row = await DonationType.create({
      scope: b.scope,
      key: b.key,
      label,
      programLabel: b.programLabel ? String(b.programLabel).trim() : label,
    })
    res.status(201).json(row)
  } catch (err) {
    next(err)
  }
}

// PUT /api/donation-types/:id  (admin)
async function update(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const b = req.body || {}
    const patch = {}
    if (b.label != null) patch.label = String(b.label).trim()
    if (b.programLabel != null) patch.programLabel = String(b.programLabel).trim()
    const row = await DonationType.update(id, patch)
    if (!row) return res.status(404).json({ error: 'Jenis donasi tidak ditemukan' })
    res.json(row)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/donation-types/:id  (admin)
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const ok = await DonationType.remove(id)
    if (!ok) return res.status(404).json({ error: 'Jenis donasi tidak ditemukan' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { list, create, update, remove }
