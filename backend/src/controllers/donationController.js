const Donation = require('../models/Donation')

// POST /api/donations  (publik — dikirim dari modal donasi)
async function create(req, res, next) {
  try {
    const b = req.body || {}
    const amount = Math.round(Number(b.amount) || 0)
    if (amount <= 0) return res.status(400).json({ error: 'Nominal tidak valid' })

    const anonymous = !!b.anonymous
    const donorName = anonymous ? 'Anonim' : String(b.donorName || '').trim()
    if (!anonymous && !donorName) return res.status(400).json({ error: 'Nama donatur wajib diisi' })

    // Batasi ukuran bukti (data URL) supaya baris tidak membengkak.
    let proof = typeof b.proof === 'string' ? b.proof : null
    if (proof && proof.length > 1_500_000) proof = null

    const row = await Donation.create({
      donorName,
      anonymous,
      jenisId: b.jenisId,
      jenisLabel: b.jenisLabel,
      program: b.program,
      source: b.source,
      amount,
      bankId: b.bankId,
      bankName: b.bankName,
      note: b.note ? String(b.note).trim() : null,
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
    res.set('Content-Type', m[1])
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

// DELETE /api/donations/:id  (admin)
async function remove(req, res, next) {
  try {
    const ok = await Donation.remove(req.params.id)
    if (!ok) return res.status(404).json({ error: 'Donasi tidak ditemukan' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, list, stats, jenisOptions, proof, updateStatus, remove }
