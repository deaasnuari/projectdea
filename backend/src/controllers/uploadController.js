const { addWatermark } = require('../lib/watermark')
const { saveImage, StorageError } = require('../lib/imageStorage')
const log = require('../lib/logger')

const EXT = { png: 'png', jpeg: 'jpg', jpg: 'jpg', webp: 'webp', gif: 'gif' }
// Vercel membatasi body request ±4,5 MB; base64 membengkak ±33%, jadi file maksimal 3 MB.
// (Browser sudah memperkecil gambar sebelum dikirim, biasanya jauh di bawah ini.)
const MAX_BYTES = 3 * 1024 * 1024

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
// → simpan ke Vercel Blob (atau folder lokal saat development), balas { url }.
async function create(req, res, next) {
  try {
    const m = /^data:image\/([a-z]+);base64,(.+)$/is.exec(req.body?.dataUrl || '')
    if (!m) return res.status(400).json({ error: 'dataUrl gambar tidak valid' })

    const ext = EXT[m[1].toLowerCase()]
    if (!ext) return res.status(415).json({ error: 'Tipe gambar tidak didukung' })

    let buf = Buffer.from(m[2], 'base64')
    if (buf.length === 0) return res.status(400).json({ error: 'Gambar kosong' })
    if (buf.length > MAX_BYTES) return res.status(413).json({ error: 'Gambar maksimal 3MB' })

    // Cek isi file sebenarnya (magic bytes), bukan cuma label tipe di data URL.
    if (!matchesSignature(buf, ext)) return res.status(415).json({ error: 'Isi file bukan gambar yang valid' })

    // Watermark logo (kecuali diminta mati: foto profil, latar situs, dll.).
    if (req.body?.watermark !== false) {
      try {
        buf = await addWatermark(buf, ext)
      } catch (e) {
        log.warn('upload', 'Watermark gagal, gambar asli dipakai', e)
      }
    }

    const url = await saveImage(buf, ext, { publicBase: publicBase(req) })
    res.status(201).json({ url })
  } catch (err) {
    if (err instanceof StorageError) {
      log.error('upload', `${err.message} ${err.detail}`.trim())
      return res.status(err.status).json({ error: err.message })
    }
    next(err)
  }
}

module.exports = { create }
