// Watermark logo LAZIS di pojok kanan bawah gambar yang diunggah admin, supaya
// kalau gambarnya dipakai/diedit di tempat lain asalnya tetap ketahuan.
// Dipasang di FILE (bukan overlay CSS), jadi tidak bisa dihapus lewat Inspect.
// Gambar kecil (< 400 px lebar) dilewati — biasanya ikon/foto profil.
const path = require('node:path')
const sharp = require('sharp')

const LOGO = path.join(__dirname, '..', '..', 'assets', 'watermark.png')
const MIN_WIDTH = 400

async function addWatermark(buf, ext) {
  if (ext === 'gif') return buf // animasi — biarkan apa adanya
  const img = sharp(buf, { failOn: 'none' }).rotate() // hormati orientasi EXIF
  const meta = await img.metadata()
  if (!meta.width || !meta.height || meta.width < MIN_WIDTH) return buf

  const logoW = Math.max(96, Math.round(meta.width * 0.16))
  const logo = await sharp(LOGO).resize({ width: logoW }).png().toBuffer()
  const logoH = (await sharp(logo).metadata()).height
  const padX = 10
  const padY = 6
  const badgeW = logoW + padX * 2
  const badgeH = logoH + padY * 2
  const margin = Math.max(10, Math.round(meta.width * 0.015))

  // Lencana gelap transparan di belakang logo putih → terbaca di foto terang maupun gelap.
  const badge = Buffer.from(
    `<svg width="${badgeW}" height="${badgeH}"><rect width="${badgeW}" height="${badgeH}" rx="8" fill="rgb(6,30,40)" fill-opacity="0.55"/></svg>`,
  )
  const left = Math.max(0, meta.width - badgeW - margin)
  const top = Math.max(0, meta.height - badgeH - margin)

  const out = img.composite([
    { input: badge, left, top },
    { input: logo, left: left + padX, top: top + padY },
  ])
  if (ext === 'png') return out.png().toBuffer()
  if (ext === 'webp') return out.webp({ quality: 88 }).toBuffer()
  return out.jpeg({ quality: 88 }).toBuffer()
}

module.exports = { addWatermark }
