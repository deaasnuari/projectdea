const DocVideo = require('../models/DocVideo')
const DocPhoto = require('../models/DocPhoto')

// ---- Video ----
async function listVideos(_req, res, next) {
  try {
    res.json({ data: await DocVideo.list() })
  } catch (err) {
    next(err)
  }
}

async function createVideo(req, res, next) {
  try {
    const b = req.body || {}
    const title = String(b.title || '').trim()
    const videoUrl = String(b.videoUrl || '').trim()
    if (!title || !videoUrl) return res.status(400).json({ error: 'Judul & link video wajib diisi' })
    res.status(201).json(
      await DocVideo.create({
        title,
        videoUrl,
        image: b.image ? String(b.image).trim() : null,
        badge: b.badge ? String(b.badge).trim() : null,
        desc: b.desc ? String(b.desc).trim() : null,
        date: b.date ? String(b.date).trim() : null,
        duration: b.duration ? String(b.duration).trim() : null,
      }),
    )
  } catch (err) {
    next(err)
  }
}

async function updateVideo(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const b = req.body || {}
    const patch = {}
    for (const k of ['title', 'videoUrl', 'image', 'badge', 'desc', 'date', 'duration']) {
      if (b[k] != null) patch[k] = String(b[k])
    }
    const row = await DocVideo.update(id, patch)
    if (!row) return res.status(404).json({ error: 'Video tidak ditemukan' })
    res.json(row)
  } catch (err) {
    next(err)
  }
}

async function removeVideo(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const ok = await DocVideo.remove(id)
    if (!ok) return res.status(404).json({ error: 'Video tidak ditemukan' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

// ---- Foto galeri ----
async function listPhotos(_req, res, next) {
  try {
    res.json({ data: await DocPhoto.list() })
  } catch (err) {
    next(err)
  }
}

async function createPhoto(req, res, next) {
  try {
    const b = req.body || {}
    const image = String(b.image || '').trim()
    if (!image) return res.status(400).json({ error: 'Foto wajib diunggah' })
    res.status(201).json(await DocPhoto.create({ image, caption: b.caption || '' }))
  } catch (err) {
    next(err)
  }
}

async function updatePhoto(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const b = req.body || {}
    const patch = {}
    if (b.image != null) patch.image = String(b.image)
    if (b.caption != null) patch.caption = String(b.caption)
    const row = await DocPhoto.update(id, patch)
    if (!row) return res.status(404).json({ error: 'Foto tidak ditemukan' })
    res.json(row)
  } catch (err) {
    next(err)
  }
}

async function removePhoto(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const ok = await DocPhoto.remove(id)
    if (!ok) return res.status(404).json({ error: 'Foto tidak ditemukan' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listVideos,
  createVideo,
  updateVideo,
  removeVideo,
  listPhotos,
  createPhoto,
  updatePhoto,
  removePhoto,
}
