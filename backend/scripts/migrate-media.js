require('dotenv').config()

const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const { pool } = require('../src/config/db')

// Pindahkan gambar yang masih tersimpan sebagai base64 (data URL) di kolom
// tabel → jadi FILE di folder ./uploads, kolomnya diganti dengan URL-nya.
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
const BASE = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 3001}`
const EXT = { png: 'png', jpeg: 'jpg', jpg: 'jpg', webp: 'webp', gif: 'gif' }

const TARGETS = [
  { table: 'blog_posts', col: 'image' },
  { table: 'programs', col: 'image' },
  { table: 'team_members', col: 'photo' },
]

function writeFileFromDataUrl(dataUrl) {
  const m = /^data:image\/([a-z]+);base64,(.+)$/is.exec(dataUrl)
  if (!m) return null
  const ext = EXT[m[1].toLowerCase()]
  if (!ext) return null
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`
  fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(m[2], 'base64'))
  return `${BASE}/uploads/${name}`
}

;(async () => {
  try {
    let moved = 0
    for (const { table, col } of TARGETS) {
      const { rows } = await pool.query(
        `select id, ${col} as val from ${table} where ${col} like 'data:image/%'`,
      )
      for (const r of rows) {
        const url = writeFileFromDataUrl(r.val)
        if (!url) continue
        await pool.query(`update ${table} set ${col} = $2, updated_at = now() where id = $1`, [r.id, url])
        moved += 1
        console.log(`  ${table}#${r.id} → ${url}`)
      }
    }
    console.log(moved ? `✓ ${moved} gambar dipindah ke ./uploads` : '· tidak ada base64 untuk dipindah')
  } catch (err) {
    console.error('✗ gagal:', err.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
})()
