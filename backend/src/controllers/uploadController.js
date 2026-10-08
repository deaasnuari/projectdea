const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

// Folder file gambar. Di-gitignore; dilayani statis lewat /uploads di server.js.
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads')

const EXT = { png: 'png', jpeg: 'jpg', jpg: 'jpg', webp: 'webp', gif: 'gif' }
const MAX_BYTES = 5 * 1024 * 1024

const SIGNATURES = {
  png: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  jpg: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  gif: (b) => b.subarray(0, 4).toString('latin1') === 'GIF8',
  webp: (b) => b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP',
}
const matchesSignature = (buf, ext) => buf.length > 12 && SIGNATURES[ext]?.(buf) === true

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

    // Cek isi file sebenarnya (magic bytes), bukan cuma label tipe di data URL.
    if (!matchesSignature(buf, ext)) return res.status(415).json({ error: 'Isi file bukan gambar yang valid' })

    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
    const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`
    fs.writeFileSync(path.join(UPLOAD_DIR, name), buf)

    res.status(201).json({ url: `${publicBase(req)}/uploads/${name}` })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, UPLOAD_DIR }
