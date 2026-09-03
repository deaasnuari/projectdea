const { query } = require('../config/db')

function toApi(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    role: row.role || '',
    photo: row.photo || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function list() {
  const { rows } = await query('select * from team_members order by sort_order asc, created_at asc')
  return rows.map(toApi)
}

async function findById(id) {
  const { rows } = await query('select * from team_members where id = $1', [id])
  return toApi(rows[0])
}

async function nextOrder() {
  const { rows } = await query('select coalesce(max(sort_order), -1) + 1 as n from team_members')
  return rows[0].n
}

async function create(d) {
  const { rows } = await query(
    `insert into team_members (name, role, photo, sort_order)
     values ($1, $2, $3, $4)
     returning *`,
    [
      String(d.name || '').trim(),
      String(d.role || '').trim(),
      typeof d.photo === 'string' ? d.photo : null,
      await nextOrder(),
    ],
  )
  return toApi(rows[0])
}

async function update(id, d) {
  const cur = await findById(id)
  if (!cur) return null
  const { rows } = await query(
    `update team_members set name = $2, role = $3, photo = $4, updated_at = now()
     where id = $1
     returning *`,
    [
      id,
      d.name != null ? String(d.name).trim() : cur.name,
      d.role != null ? String(d.role).trim() : cur.role,
      d.photo != null ? (typeof d.photo === 'string' ? d.photo : '') : cur.photo,
    ],
  )
  return toApi(rows[0])
}

async function remove(id) {
  const { rowCount } = await query('delete from team_members where id = $1', [id])
  return rowCount > 0
}

async function count() {
  const { rows } = await query('select count(*)::int as n from team_members')
  return rows[0].n
}

module.exports = { toApi, list, findById, create, update, remove, count }
