const { query } = require('../config/db')

function toApi(row) {
  if (!row) return null
  return {
    title: row.title || '',
    description: row.description || '',
    stats: Array.isArray(row.stats)
      ? row.stats.map((s) => ({ value: Math.round(Number(s.value) || 0), label: String(s.label || '') }))
      : [],
    updated_at: row.updated_at,
  }
}

async function get() {
  const { rows } = await query('select * from donor_info where id = 1')
  return toApi(rows[0])
}

async function save(d) {
  const stats = Array.isArray(d.stats)
    ? d.stats.map((s) => ({ value: Math.round(Number(s.value) || 0), label: String(s.label || '').trim() }))
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

module.exports = { toApi, get, save }
