const { query } = require('../config/db')

function toApi(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    videoUrl: row.video_url || '',
    image: row.image || '',
    badge: row.badge || '',
    desc: row.desc || '',
    date: row.date || '',
    duration: row.duration || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function nextOrder() {
  const { rows } = await query('select coalesce(max(sort_order), -1) + 1 as n from doc_videos')
  return rows[0].n
}

async function list() {
  const { rows } = await query('select * from doc_videos order by sort_order asc, created_at asc')
  return rows.map(toApi)
}

async function findById(id) {
  const { rows } = await query('select * from doc_videos where id = $1', [id])
  return toApi(rows[0])
}

async function create(d) {
  const { rows } = await query(
    `insert into doc_videos (title, video_url, image, badge, "desc", "date", duration, sort_order)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     returning *`,
    [
      String(d.title || '').trim(),
      String(d.videoUrl || '').trim(),
      d.image || null,
      d.badge || null,
      d.desc || null,
      d.date || null,
      d.duration || null,
      await nextOrder(),
    ],
  )
  return toApi(rows[0])
}

async function update(id, d) {
  const cur = await findById(id)
  if (!cur) return null
  const v = (val, fallback) => (val != null ? val : fallback)
  const { rows } = await query(
    `update doc_videos set
       title = $2, video_url = $3, image = $4, badge = $5,
       "desc" = $6, "date" = $7, duration = $8, updated_at = now()
     where id = $1
     returning *`,
    [
      id,
      v(d.title != null ? String(d.title).trim() : null, cur.title),
      v(d.videoUrl != null ? String(d.videoUrl).trim() : null, cur.videoUrl),
      v(d.image, cur.image),
      v(d.badge, cur.badge),
      v(d.desc, cur.desc),
      v(d.date, cur.date),
      v(d.duration, cur.duration),
    ],
  )
  return toApi(rows[0])
}

async function remove(id) {
  const { rowCount } = await query('delete from doc_videos where id = $1', [id])
  return rowCount > 0
}

async function count() {
  const { rows } = await query('select count(*)::int as n from doc_videos')
  return rows[0].n
}

module.exports = { toApi, list, findById, create, update, remove, count }
