const Donation = require('../models/Donation')
const { line, text, isProof } = require('../lib/validate')

// POST /api/donations  (publik — dikirim dari modal donasi)
async function create(req, res, next) {
  try {
    const b = req.body || {}
    const amount = Math.round(Number(b.amount) || 0)
    // Batas wajar: > 0 dan ≤ Rp 100 miliar (mencegah angka raksasa/overflow di DB).
    if (!Number.isFinite(amount) || amount <= 0 || amount > 100_000_000_000) {
      return res.status(400).json({ error: 'Nominal tidak valid' })
    }

    const anonymous = b.anonymous === true || b.anonymous === 'true'
    const donorName = anonymous ? 'Anonim' : line(b.donorName, 100)
    if (!anonymous && !donorName) return res.status(400).json({ error: 'Nama donatur wajib diisi' })

    // Bukti transfer: hanya gambar jpeg/png/webp yang valid; selain itu diabaikan.
    const proof = isProof(b.proof) ? b.proof : null

    const row = await Donation.create({
      donorName,
      anonymous,
      jenisId: line(b.jenisId, 60) || null,
      jenisLabel: line(b.jenisLabel, 120) || null,
      program: line(b.program, 200) || null,
      source: line(b.source, 20),
      amount,
      bankId: line(b.bankId, 60) || null,
      bankName: line(b.bankName, 120) || null,
      note: text(b.note, 500) || null,
      proof,
    })
    res.status(201).json({ id: row.id, status: row.status, created_at: row.created_at })
  } catch (err) {
    next(err)
  }
}

// GET /api/donations?status=&source=&jenis=  (admin)
async function list(req, res, next) {
  try {
    res.json({
      data: await Donation.list({
        status: req.query.status,
        source: req.query.source,
        jenis: req.query.jenis,
        trash: req.query.trash === '1',
      }),
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/donations/stats  (admin)
async function stats(_req, res, next) {
  try {
    res.json(await Donation.stats())
  } catch (err) {
    next(err)
  }
}

// GET /api/donations/jenis-options  (admin) — isi dropdown filter jenis
async function jenisOptions(_req, res, next) {
  try {
    res.json({ data: await Donation.jenisOptions() })
  } catch (err) {
    next(err)
  }
}

// GET /api/donations/:id/proof  (admin — gambar bukti)
async function proof(req, res, next) {
  try {
    const dataUrl = await Donation.findProof(req.params.id)
    if (!dataUrl) return res.status(404).json({ error: 'Tidak ada bukti' })
    const m = /^data:(.+?);base64,(.*)$/s.exec(dataUrl)
    if (!m) return res.status(415).json({ error: 'Format bukti tidak dikenal' })
    // Tipe hanya dari daftar putih (data lama bisa saja berisi tipe lain) +
    // diunduh sebagai file, bukan dirender di origin API.
    const type = /^image\/(jpeg|jpg|png|webp)$/.test(m[1]) ? m[1] : 'application/octet-stream'
    res.set({ 'Content-Type': type, 'Content-Disposition': 'inline; filename="bukti"', 'X-Content-Type-Options': 'nosniff' })
    res.send(Buffer.from(m[2], 'base64'))
  } catch (err) {
    next(err)
  }
}

// PATCH /api/donations/:id/status  (admin)
async function updateStatus(req, res, next) {
  try {
    const row = await Donation.updateStatus(req.params.id, req.body?.status)
    if (!row) return res.status(400).json({ error: 'Status tidak valid atau data tidak ditemukan' })
    res.json(row)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/donations/:id  (admin) — pindahkan ke Sampah
async function remove(req, res, next) {
  try {
    const ok = await Donation.remove(req.params.id)
    if (!ok) return res.status(404).json({ error: 'Donasi tidak ditemukan' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

// Aksi massal Sampah: body { ids: [1,2,3] }
//   POST /api/donations/bulk-delete   → pindahkan ke Sampah
//   POST /api/donations/bulk-restore  → pulihkan dari Sampah
//   POST /api/donations/bulk-purge    → hapus permanen (hanya isi Sampah)
function bulk(fnName) {
  return async (req, res, next) => {
    try {
      const ids = Array.isArray(req.body?.ids) ? req.body.ids : []
      if (ids.length === 0) return res.status(400).json({ error: 'Tidak ada donasi yang dipilih' })
      const count = await Donation[fnName](ids)
      res.json({ ok: true, count, deleted: count })
    } catch (err) {
      next(err)
    }
  }
}
const removeBulk = bulk('removeMany')
const restoreBulk = bulk('restoreMany')
const purgeBulk = bulk('purgeMany')

// POST /api/donations/trash/empty  (admin) — kosongkan Sampah
async function emptyTrash(_req, res, next) {
  try {
    res.json({ ok: true, count: await Donation.emptyTrash() })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  create,
  list,
  stats,
  jenisOptions,
  proof,
  updateStatus,
  remove,
  removeBulk,
  restoreBulk,
  purgeBulk,
  emptyTrash,
}
