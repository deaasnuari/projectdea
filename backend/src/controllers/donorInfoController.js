const DonorInfo = require('../models/DonorInfo')

// GET /api/donor-info  (publik)
async function get(_req, res, next) {
  try {
    const info = await DonorInfo.get()
    // Belum diisi → biarkan frontend pakai default-nya.
    res.json(info || { title: '', description: '', stats: [] })
  } catch (err) {
    next(err)
  }
}

// PUT /api/donor-info  (admin)
async function update(req, res, next) {
  try {
    const b = req.body || {}
    const title = String(b.title || '').trim()
    const description = String(b.description || '').trim()
    if (!title || !description) return res.status(400).json({ error: 'Judul & isi informasi wajib diisi' })

    const stats = Array.isArray(b.stats)
      ? b.stats
          .map((s) => ({ value: Number(s.value) || 0, label: String(s.label || '').trim() }))
          .filter((s) => s.label)
      : []

    res.json(await DonorInfo.save({ title, description, stats }))
  } catch (err) {
    next(err)
  }
}

module.exports = { get, update }
