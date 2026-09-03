const { query } = require('../config/db')

const STATUSES = ['baru', 'dibaca', 'selesai']

function toApi(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name || '',
    email: row.email || '',
    message: row.message || '',
    status: row.status,
    created_at: row.created_at,
  }
}

async function create(d) {
  const { rows } = await query(
    `insert into contact_messages (name, email, message)
     values ($1, $2, $3)
     returning *`,
    [String(d.name || '').trim(), String(d.email || '').trim(), String(d.message || '').trim()],
  )
  return toApi(rows[0])
}

async function list({ status } = {}) {
  const where = status && STATUSES.includes(status) ? 'where status = $1' : ''
  const params = where ? [status] : []
  const { rows } = await query(
    `select * from contact_messages ${where} order by created_at desc limit 500`,
    params,
  )
  return rows.map(toApi)
}

async function updateStatus(id, status) {
  if (!STATUSES.includes(status)) return null
  const { rows } = await query(
    'update contact_messages set status = $2 where id = $1 returning *',
    [id, status],
  )
  return toApi(rows[0])
}

async function remove(id) {
  const { rowCount } = await query('delete from contact_messages where id = $1', [id])
  return rowCount > 0
}

async function stats() {
  const { rows } = await query(`
    select
      count(*)::int as total,
      count(*) filter (where status = 'baru')::int as baru,
      count(*) filter (where status = 'dibaca')::int as dibaca,
      count(*) filter (where status = 'selesai')::int as selesai
    from contact_messages
  `)
  return rows[0]
}

module.exports = { STATUSES, toApi, create, list, updateStatus, remove, stats }
