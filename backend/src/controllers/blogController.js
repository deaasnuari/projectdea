const BlogPost = require('../models/BlogPost')

// Normalisasi field "content": bisa dikirim sebagai array paragraf, atau
// sebagai satu string (paragraf dipisah baris kosong).
function normalizeContent(input) {
  if (Array.isArray(input)) return input.map((p) => String(p).trim()).filter(Boolean)
  if (typeof input === 'string') {
    return input
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
  }
  return []
}

// GET /api/blog  (publik)
async function list(_req, res, next) {
  try {
    res.json({ data: await BlogPost.list() })
  } catch (err) {
    next(err)
  }
}

// GET /api/blog/:slug  (publik)
async function getOne(req, res, next) {
  try {
    const post = await BlogPost.findBySlug(req.params.slug)
    if (!post) return res.status(404).json({ error: 'Artikel tidak ditemukan' })
    res.json(post)
  } catch (err) {
    next(err)
  }
}

// POST /api/blog  (admin)
async function create(req, res, next) {
  try {
    const b = req.body || {}
    const title = String(b.title || '').trim()
    if (!title) return res.status(400).json({ error: 'Judul wajib diisi' })

    const post = await BlogPost.create({
      slug: b.slug,
      title,
      badge: b.badge ? String(b.badge).trim() : null,
      date: b.date ? String(b.date).trim() : null,
      image: typeof b.image === 'string' ? b.image : null,
      desc: b.desc ? String(b.desc).trim() : null,
      content: normalizeContent(b.content),
    })
    res.status(201).json(post)
  } catch (err) {
    next(err)
  }
}

// PUT /api/blog/:id  (admin)
async function update(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })

    const b = req.body || {}
    const patch = {}
    if (b.slug != null) patch.slug = String(b.slug).trim()
    if (b.title != null) patch.title = String(b.title).trim()
    if (b.badge != null) patch.badge = String(b.badge).trim()
    if (b.date != null) patch.date = String(b.date).trim()
    if (b.image != null) patch.image = typeof b.image === 'string' ? b.image : ''
    if (b.desc != null) patch.desc = String(b.desc).trim()
    if (b.content != null) patch.content = normalizeContent(b.content)

    const post = await BlogPost.update(id, patch)
    if (!post) return res.status(404).json({ error: 'Artikel tidak ditemukan' })
    res.json(post)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/blog/:id  (admin)
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const ok = await BlogPost.remove(id)
    if (!ok) return res.status(404).json({ error: 'Artikel tidak ditemukan' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getOne, create, update, remove }
