const { query } = require('../config/db')

function obj(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? v : {}
}

function toApi(row) {
  if (!row) return null
  return {
    hero: obj(row.hero),
    info: Array.isArray(row.info) ? row.info : [],
    form: obj(row.form),
    updated_at: row.updated_at,
  }
}

async function get() {
  const { rows } = await query('select * from contact_page where id = 1')
  return toApi(rows[0])
}

async function save(d) {
  const hero = obj(d.hero)
  const info = (Array.isArray(d.info) ? d.info : [])
    .map((it) => ({
      id: String(it.id || `info-${Math.random().toString(36).slice(2, 8)}`),
      type: String(it.type || 'alamat'),
      label: String(it.label || '').trim(),
      value: String(it.value || '').trim(),
    }))
    .filter((it) => it.label || it.value)
  const form = obj(d.form)

  const { rows } = await query(
    `insert into contact_page (id, hero, info, form, updated_at)
     values (1, $1::jsonb, $2::jsonb, $3::jsonb, now())
     on conflict (id) do update
       set hero = excluded.hero,
           info = excluded.info,
           form = excluded.form,
           updated_at = now()
     returning *`,
    [JSON.stringify(hero), JSON.stringify(info), JSON.stringify(form)],
  )
  return toApi(rows[0])
}

module.exports = { toApi, get, save }
