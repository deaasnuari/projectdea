const PageTypography = require('../models/PageTypography')

// Untuk sekarang hanya halaman "Kami Peduli". Kalau nanti ada halaman lain,
// tinggal baca ?page= dari query.
function pageOf(req) {
  const p = String(req.query.page || 'kami-peduli')
  return PageTypography.PAGE_IDS[p] ? p : 'kami-peduli'
}

// GET /api/page-typography  (publik)
async function get(req, res, next) {
  try {
    res.json(await PageTypography.get(pageOf(req)))
  } catch (err) {
    next(err)
  }
}

// PUT /api/page-typography  (admin)
async function update(req, res, next) {
  try {
    const b = req.body || {}
    res.json(
      await PageTypography.save(pageOf(req), {
        bodyFont: b.bodyFont,
        headingFont: b.headingFont,
        fontScale: b.fontScale,
      }),
    )
  } catch (err) {
    next(err)
  }
}

// POST /api/page-typography/reset  (admin) — balik ke tampilan bawaan
async function reset(req, res, next) {
  try {
    res.json(await PageTypography.reset(pageOf(req)))
  } catch (err) {
    next(err)
  }
}

module.exports = { get, update, reset }
