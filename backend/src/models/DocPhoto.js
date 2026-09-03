const { query } = require('../config/db')

function toApi(row) {
  if (!row) return null
  return {
    id: row.id,
    image: row.image || '',
    caption: row.caption || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function nextOrder() {
  const { rows } = await query('select coalesce(max(sort_order), -1) + 1 as n from doc_photos')
  return rows[0].n
}

async function list() {
  const { rows } = await query('select * from doc_photos order by sort_order asc, created_at asc')
  return rows.map(toApi)
}

async function findById(id) {
  const { rows } = await query('select * from doc_photos where id = $1', [id])
  return toApi(rows[0])
}

async function create(d) {
  const { rows } = await query(
    `insert into doc_photos (image, caption, sort_order)
     values ($1, $2, $3)
     returning *`,
    [String(d.image || '').trim(), String(d.caption || '').trim(), await nextOrder()],
  )
  return toApi(rows[0])
}

async function update(id, d) {
  const cur = await findById(id)
  if (!cur) return null
  const { rows } = await query(
    `update doc_photos set image = $2, caption = $3, updated_at = now()
     where id = $1
     returning *`,
    [
      id,
      d.image != null ? String(d.image).trim() : cur.image,
      d.caption != null ? String(d.caption).trim() : cur.caption,
    ],
  )
  return toApi(rows[0])
}

async function remove(id) {
  const { rowCount } = await query('delete from doc_photos where id = $1', [id])
  return rowCount > 0
}

async function count() {
  const { rows } = await query('select count(*)::int as n from doc_photos')
  return rows[0].n
}

module.exports = { toApi, list, findById, create, update, remove, count }
