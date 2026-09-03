const { query } = require('../config/db')

// Model: satu-satunya tempat query ke tabel `site_content`.
// Tiap baris = satu dokumen JSON (objek atau array) per `key`.

async function findByKey(key) {
  const { rows } = await query('select data, updated_at from site_content where key = $1', [key])
  return rows[0] || null
}

async function upsert(key, data) {
  const { rows } = await query(
    `insert into site_content (key, data, updated_at)
     values ($1, $2::jsonb, now())
     on conflict (key) do update set data = excluded.data, updated_at = now()
     returning data, updated_at`,
    [key, JSON.stringify(data)],
  )
  return rows[0]
}

async function keys() {
  const { rows } = await query('select key from site_content order by key')
  return rows.map((r) => r.key)
}

const ping = () => query('select 1')

module.exports = { findByKey, upsert, keys, ping }
