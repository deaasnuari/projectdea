const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

// Folder file gambar. Di-gitignore; dilayani statis lewat /uploads di server.js.
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads')

const EXT = { png: 'png', jpeg: 'jpg', jpg: 'jpg', webp: 'webp', gif: 'gif' }
const MAX_BYTES = 5 * 1024 * 1024

function publicBase(req) {
  return process.env.BACKEND_PUBLIC_URL || `${req.protocol}://${req.get('host')}`
}

// POST /api/uploads  (admin) — body { dataUrl: "data:image/...;base64,..." }
// → simpan sebagai file, balas { url }.
function create(req, res, next) {
  try {
    const m = /^data:image\/([a-z]+);base64,(.+)$/is.exec(req.body?.dataUrl || '')
    if (!m) return res.status(400).json({ error: 'dataUrl gambar tidak valid' })

    const ext = EXT[m[1].toLowerCase()]
    if (!ext) return res.status(415).json({ error: 'Tipe gambar tidak didukung' })

    const buf = Buffer.from(m[2], 'base64')
    if (buf.length === 0) return res.status(400).json({ error: 'Gambar kosong' })
    if (buf.length > MAX_BYTES) return res.status(413).json({ error: 'Gambar maksimal 5MB' })

    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
    const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`
    fs.writeFileSync(path.join(UPLOAD_DIR, name), buf)

    res.status(201).json({ url: `${publicBase(req)}/uploads/${name}` })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, UPLOAD_DIR }
