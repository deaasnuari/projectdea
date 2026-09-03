const Program = require('../models/Program')

function toLines(input, sep) {
  if (Array.isArray(input)) return input.map((p) => String(p).trim()).filter(Boolean)
  if (typeof input === 'string') {
    const parts = sep === 'para' ? input.split(/\n\s*\n/) : input.split('\n')
    return parts.map((p) => p.trim()).filter(Boolean)
  }
  return []
}

// GET /api/programs  (publik) — kirim semua + flag `active`; frontend publik
// yang menyaring yang ditutup, jadi tidak tergantung status login browser.
async function list(_req, res, next) {
  try {
    res.json({ data: await Program.list({ includeInactive: true }) })
  } catch (err) {
    next(err)
  }
}

// GET /api/programs/:slug  (publik)
async function getOne(req, res, next) {
  try {
    const p = await Program.findBySlug(req.params.slug, { includeInactive: true })
    if (!p) return res.status(404).json({ error: 'Program tidak ditemukan' })
    res.json(p)
  } catch (err) {
    next(err)
  }
}

// POST /api/programs  (admin)
async function create(req, res, next) {
  try {
    const b = req.body || {}
    const title = String(b.title || '').trim()
    if (!title) return res.status(400).json({ error: 'Judul program wajib diisi' })

    const p = await Program.create({
      slug: b.slug,
      title,
      badge: b.badge ? String(b.badge).trim() : null,
      icon: b.icon ? String(b.icon).trim() : null,
      image: typeof b.image === 'string' ? b.image : null,
      jenisId: b.jenisId ? String(b.jenisId).trim() : null,
      theme: b.theme ? String(b.theme).trim() : 'green',
      desc: b.desc ? String(b.desc).trim() : null,
      harapan: b.harapan ? String(b.harapan).trim() : null,
      deskripsiLengkap: toLines(b.deskripsiLengkap, 'para'),
      manfaat: toLines(b.manfaat, 'line'),
      target: b.target,
      collected: b.collected,
      donors: b.donors,
    })
    res.status(201).json(p)
  } catch (err) {
    next(err)
  }
}

// PUT /api/programs/:id  (admin)
async function update(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })

    const b = req.body || {}
    const patch = {}
    if (b.slug != null) patch.slug = String(b.slug).trim()
    if (b.title != null) patch.title = String(b.title).trim()
    if (b.badge != null) patch.badge = String(b.badge).trim()
    if (b.icon != null) patch.icon = String(b.icon).trim()
    if (b.image != null) patch.image = typeof b.image === 'string' ? b.image : ''
    if (b.jenisId != null) patch.jenisId = String(b.jenisId).trim()
    if (b.theme != null) patch.theme = String(b.theme).trim()
    if (b.desc != null) patch.desc = String(b.desc).trim()
    if (b.harapan != null) patch.harapan = String(b.harapan).trim()
    if (b.deskripsiLengkap != null) patch.deskripsiLengkap = toLines(b.deskripsiLengkap, 'para')
    if (b.manfaat != null) patch.manfaat = toLines(b.manfaat, 'line')
    if (b.target != null) patch.target = b.target
    if (b.collected != null) patch.collected = b.collected
    if (b.donors != null) patch.donors = b.donors
    if (typeof b.active === 'boolean') patch.active = b.active

    const p = await Program.update(id, patch)
    if (!p) return res.status(404).json({ error: 'Program tidak ditemukan' })
    res.json(p)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/programs/:id  (admin)
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const ok = await Program.remove(id)
    if (!ok) return res.status(404).json({ error: 'Program tidak ditemukan' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getOne, create, update, remove }
