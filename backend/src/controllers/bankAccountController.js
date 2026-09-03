const BankAccount = require('../models/BankAccount')

// GET /api/bank-accounts?scope=  (publik)
async function list(req, res, next) {
  try {
    res.json({ data: await BankAccount.list(req.query.scope) })
  } catch (err) {
    next(err)
  }
}

// POST /api/bank-accounts  (admin)
async function create(req, res, next) {
  try {
    const b = req.body || {}
    const name = String(b.name || '').trim()
    const noRek = String(b.noRek || '').trim()
    if (!name || !noRek) return res.status(400).json({ error: 'Nama bank & nomor rekening wajib diisi' })

    const row = await BankAccount.create({
      scope: b.scope,
      name,
      noRek,
      short: b.short ? String(b.short).trim().toUpperCase() : name.slice(0, 3).toUpperCase(),
      badgeClass: b.badgeClass || null,
    })
    res.status(201).json(row)
  } catch (err) {
    next(err)
  }
}

// PUT /api/bank-accounts/:id  (admin)
async function update(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })

    const b = req.body || {}
    const patch = {}
    if (b.name != null) patch.name = String(b.name).trim()
    if (b.noRek != null) patch.noRek = String(b.noRek).trim()
    if (b.short != null) patch.short = String(b.short).trim().toUpperCase()
    if (b.badgeClass != null) patch.badgeClass = b.badgeClass

    const row = await BankAccount.update(id, patch)
    if (!row) return res.status(404).json({ error: 'Rekening tidak ditemukan' })
    res.json(row)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/bank-accounts/:id  (admin)
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const ok = await BankAccount.remove(id)
    if (!ok) return res.status(404).json({ error: 'Rekening tidak ditemukan' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { list, create, update, remove }
