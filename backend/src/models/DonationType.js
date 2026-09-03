const { query } = require('../config/db')

const SCOPES = ['tentang', 'program']

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function toApi(row) {
  if (!row) return null
  return {
    id: row.id,
    scope: row.scope,
    key: row.key || slugify(row.label),
    label: row.label,
    programLabel: row.program_label || row.label,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function list(scope) {
  if (scope && SCOPES.includes(scope)) {
    const { rows } = await query(
      'select * from donation_types where scope = $1 order by sort_order asc, created_at asc',
      [scope],
    )
    return rows.map(toApi)
  }
  const { rows } = await query('select * from donation_types order by scope, sort_order asc, created_at asc')
  return rows.map(toApi)
}

async function findById(id) {
  const { rows } = await query('select * from donation_types where id = $1', [id])
  return toApi(rows[0])
}

async function uniqueKey(scope, base, exceptId = null) {
  let key = slugify(base) || `jenis-${Date.now()}`
  let n = 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { rows } = await query(
      'select id from donation_types where scope = $1 and key = $2 and ($3::bigint is null or id <> $3)',
      [scope, key, exceptId],
    )
    if (rows.length === 0) return key
    n += 1
    key = `${slugify(base)}-${n}`
  }
}

async function create(d) {
  const scope = SCOPES.includes(d.scope) ? d.scope : 'tentang'
  const label = String(d.label || '').trim()
  const key = d.key ? await uniqueKey(scope, d.key) : await uniqueKey(scope, label)
  const { rows } = await query(
    `insert into donation_types (scope, key, label, program_label)
     values ($1, $2, $3, $4)
     returning *`,
    [scope, key, label, d.programLabel ? String(d.programLabel).trim() : null],
  )
  return toApi(rows[0])
}

async function update(id, d) {
  const cur = await findById(id)
  if (!cur) return null
  const { rows } = await query(
    `update donation_types set
       label = $2, program_label = $3, updated_at = now()
     where id = $1
     returning *`,
    [
      id,
      d.label != null ? String(d.label).trim() : cur.label,
      d.programLabel != null ? String(d.programLabel).trim() : cur.programLabel,
    ],
  )
  return toApi(rows[0])
}

async function remove(id) {
  const { rowCount } = await query('delete from donation_types where id = $1', [id])
  return rowCount > 0
}

async function count() {
  const { rows } = await query('select count(*)::int as n from donation_types')
  return rows[0].n
}

module.exports = { SCOPES, slugify, toApi, list, findById, create, update, remove, count }
