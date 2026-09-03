const { query } = require('../config/db')

const SCOPES = ['tentang', 'program']

function toApi(row) {
  if (!row) return null
  return {
    id: row.id,
    scope: row.scope,
    name: row.name,
    short: row.short || '',
    noRek: row.no_rek || '',
    badgeClass: row.badge_class || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function list(scope) {
  if (scope && SCOPES.includes(scope)) {
    const { rows } = await query(
      'select * from bank_accounts where scope = $1 order by sort_order asc, created_at asc',
      [scope],
    )
    return rows.map(toApi)
  }
  const { rows } = await query('select * from bank_accounts order by scope, sort_order asc, created_at asc')
  return rows.map(toApi)
}

async function findById(id) {
  const { rows } = await query('select * from bank_accounts where id = $1', [id])
  return toApi(rows[0])
}

async function create(d) {
  const scope = SCOPES.includes(d.scope) ? d.scope : 'tentang'
  const { rows } = await query(
    `insert into bank_accounts (scope, name, short, no_rek, badge_class)
     values ($1, $2, $3, $4, $5)
     returning *`,
    [scope, String(d.name || '').trim(), d.short || null, String(d.noRek || '').trim(), d.badgeClass || null],
  )
  return toApi(rows[0])
}

async function update(id, d) {
  const cur = await findById(id)
  if (!cur) return null
  const val = (v, fallback) => (v != null ? v : fallback)
  const { rows } = await query(
    `update bank_accounts set
       name = $2, short = $3, no_rek = $4, badge_class = $5, updated_at = now()
     where id = $1
     returning *`,
    [
      id,
      val(d.name != null ? String(d.name).trim() : null, cur.name),
      val(d.short, cur.short),
      val(d.noRek != null ? String(d.noRek).trim() : null, cur.noRek),
      val(d.badgeClass, cur.badgeClass),
    ],
  )
  return toApi(rows[0])
}

async function remove(id) {
  const { rowCount } = await query('delete from bank_accounts where id = $1', [id])
  return rowCount > 0
}

async function count() {
  const { rows } = await query('select count(*)::int as n from bank_accounts')
  return rows[0].n
}

module.exports = { SCOPES, toApi, list, findById, create, update, remove, count }
