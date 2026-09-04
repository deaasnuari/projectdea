const DonorInfo = require('../models/DonorInfo')
const Donation = require('../models/Donation')

// Petakan `metric` sebuah stat "auto" ke angka hasil agregat Donation.stats().
function metricValue(metric, s) {
  if (!s) return 0
  switch (metric) {
    case 'dana':
      return Number(s.total_terverifikasi) || 0
    case 'donasi_terverifikasi':
      return Number(s.terverifikasi) || 0
    case 'total_donasi':
      return Number(s.total) || 0
    case 'donasi_program':
      return Number(s.dari_program) || 0
    case 'donasi_tentang':
      return Number(s.dari_tentang) || 0
    case 'donatur':
    default:
      return Number(s.donatur) || 0
  }
}

// GET /api/donor-info  (publik)
// Stat ber-source 'auto' dihitung ulang di sini dari tabel donations,
// sehingga halaman publik langsung menerima angka final.
async function get(_req, res, next) {
  try {
    const info = await DonorInfo.get()
    if (!info) return res.json({ title: '', description: '', stats: [] })

    const hasAuto = info.stats.some((s) => s.source === 'auto')
    let dstats = null
    if (hasAuto) {
      try {
        dstats = await Donation.stats()
      } catch {
        dstats = null // agregat gagal → pakai nilai cadangan `value`
      }
    }

    const stats = info.stats.map((s) =>
      s.source === 'auto' && dstats ? { ...s, value: metricValue(s.metric, dstats) } : s,
    )
    res.json({ ...info, stats })
  } catch (err) {
    next(err)
  }
}

// PUT /api/donor-info  (admin)
async function update(req, res, next) {
  try {
    const b = req.body || {}
    const title = String(b.title || '').trim()
    const description = String(b.description || '').trim()
    if (!title || !description) return res.status(400).json({ error: 'Judul & isi informasi wajib diisi' })

    const stats = Array.isArray(b.stats)
      ? b.stats
          .map((s) => ({
            label: String((s && s.label) || '').trim(),
            source: s && s.source === 'auto' ? 'auto' : 'manual',
            metric:
              s && DonorInfo.METRIC_KEYS.includes(s.metric) ? s.metric : 'donatur',
            value: Number(s && s.value) || 0,
          }))
          .filter((s) => s.label)
      : []

    res.json(await DonorInfo.save({ title, description, stats }))
  } catch (err) {
    next(err)
  }
}

module.exports = { get, update }
