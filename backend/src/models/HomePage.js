const { query } = require('../config/db')

function obj(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? v : {}
}

// videos & galeri punya tabel sendiri (doc_videos / doc_photos) — jangan
// disimpan di sini supaya tidak ada dua sumber kebenaran.
function strip(data) {
  const d = { ...obj(data) }
  delete d.videos
  delete d.galeri
  return d
}

function toApi(row) {
  return row ? strip(row.data) : null
}

async function get() {
  const { rows } = await query('select * from home_page where id = 1')
  return toApi(rows[0])
}

async function save(data) {
  const { rows } = await query(
    `insert into home_page (id, data, updated_at)
     values (1, $1::jsonb, now())
     on conflict (id) do update
       set data = excluded.data, updated_at = now()
     returning *`,
    [JSON.stringify(strip(data))],
  )
  return toApi(rows[0])
}

module.exports = { toApi, get, save }
