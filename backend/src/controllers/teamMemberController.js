const TeamMember = require('../models/TeamMember')

// GET /api/team  (publik)
async function list(_req, res, next) {
  try {
    res.json({ data: await TeamMember.list() })
  } catch (err) {
    next(err)
  }
}

// POST /api/team  (admin)
async function create(req, res, next) {
  try {
    const b = req.body || {}
    const name = String(b.name || '').trim()
    const role = String(b.role || '').trim()
    if (!name || !role) return res.status(400).json({ error: 'Nama & jabatan wajib diisi' })
    res.status(201).json(
      await TeamMember.create({ name, role, photo: typeof b.photo === 'string' ? b.photo : null }),
    )
  } catch (err) {
    next(err)
  }
}

// PUT /api/team/:id  (admin)
async function update(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const b = req.body || {}
    const patch = {}
    if (b.name != null) patch.name = String(b.name).trim()
    if (b.role != null) patch.role = String(b.role).trim()
    if (b.photo != null) patch.photo = typeof b.photo === 'string' ? b.photo : ''
    const row = await TeamMember.update(id, patch)
    if (!row) return res.status(404).json({ error: 'Anggota tim tidak ditemukan' })
    res.json(row)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/team/:id  (admin)
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const ok = await TeamMember.remove(id)
    if (!ok) return res.status(404).json({ error: 'Anggota tim tidak ditemukan' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { list, create, update, remove }
