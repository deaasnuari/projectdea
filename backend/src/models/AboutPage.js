const { query } = require('../config/db')

function obj(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? v : {}
}

function toApi(row) {
  if (!row) return null
  return obj(row.data)
}

async function get() {
  const { rows } = await query('select * from about_page where id = 1')
  return toApi(rows[0])
}

async function save(data) {
  const { rows } = await query(
    `insert into about_page (id, data, updated_at)
     values (1, $1::jsonb, now())
     on conflict (id) do update
       set data = excluded.data, updated_at = now()
     returning *`,
    [JSON.stringify(obj(data))],
  )
  return toApi(rows[0])
}

module.exports = { toApi, get, save }
