const { query } = require('../config/db')

// Tiap "stat" ringkasan donatur bisa:
//  - source 'manual' → angka diketik admin (disimpan di `value`)
//  - source 'auto'   → angka diambil dari agregat tabel `donations`
//                      (Riwayat Donasi), sesuai `metric`. Nilai `value`
//                      tetap disimpan sebagai cadangan kalau agregat gagal.
const METRIC_KEYS = [
  'donatur',
  'dana',
  'donasi_terverifikasi',
  'total_donasi',
  'donasi_program',
  'donasi_tentang',
]

function normStat(s) {
  const source = s && s.source === 'auto' ? 'auto' : 'manual'
  const metric = s && METRIC_KEYS.includes(s.metric) ? s.metric : 'donatur'
  return {
    label: String((s && s.label) || ''),
    value: Math.round(Number(s && s.value) || 0),
    source,
    metric,
  }
}

function toApi(row) {
  if (!row) return null
  return {
    title: row.title || '',
    description: row.description || '',
    stats: Array.isArray(row.stats) ? row.stats.map(normStat) : [],
    updated_at: row.updated_at,
  }
}

async function get() {
  const { rows } = await query('select * from donor_info where id = 1')
  return toApi(rows[0])
}

async function save(d) {
  const stats = Array.isArray(d.stats)
    ? d.stats.map((s) => normStat({ ...s, label: String((s && s.label) || '').trim() }))
    : []
  const { rows } = await query(
    `insert into donor_info (id, title, description, stats, updated_at)
     values (1, $1, $2, $3::jsonb, now())
     on conflict (id) do update
       set title = excluded.title,
           description = excluded.description,
           stats = excluded.stats,
           updated_at = now()
     returning *`,
    [String(d.title || '').trim(), String(d.description || '').trim(), JSON.stringify(stats)],
  )
  return toApi(rows[0])
}

module.exports = { toApi, get, save, METRIC_KEYS }
