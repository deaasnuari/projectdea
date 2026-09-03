const { query } = require('../config/db')

// Nama kolom DB sudah sama dengan field form (title, badge, "date", image,
// "desc", content) — tinggal rapikan null → string kosong.
function toApi(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    badge: row.badge || '',
    date: row.date || '',
    image: row.image || '',
    desc: row.desc || '',
    content: Array.isArray(row.content) ? row.content : [],
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120)
}

async function list() {
  const { rows } = await query('select * from blog_posts order by created_at desc')
  return rows.map(toApi)
}

async function findBySlug(slug) {
  const { rows } = await query('select * from blog_posts where slug = $1', [slug])
  return toApi(rows[0])
}

async function findById(id) {
  const { rows } = await query('select * from blog_posts where id = $1', [id])
  return toApi(rows[0])
}

// Pastikan slug unik: kalau sudah dipakai baris lain, tambahkan sufiks angka.
async function uniqueSlug(base, exceptId = null) {
  let slug = slugify(base) || `artikel-${Date.now()}`
  let n = 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { rows } = await query(
      'select id from blog_posts where slug = $1 and ($2::bigint is null or id <> $2)',
      [slug, exceptId],
    )
    if (rows.length === 0) return slug
    n += 1
    slug = `${slugify(base)}-${n}`
  }
}

async function create(d) {
  const slug = await uniqueSlug(d.slug || d.title)
  const { rows } = await query(
    `insert into blog_posts (slug, title, badge, "date", image, "desc", content)
     values ($1, $2, $3, $4, $5, $6, $7::jsonb)
     returning *`,
    [
      slug,
      String(d.title || '').trim(),
      d.badge || null,
      d.date || null,
      d.image || null,
      d.desc || null,
      JSON.stringify(Array.isArray(d.content) ? d.content : []),
    ],
  )
  return toApi(rows[0])
}

async function update(id, d) {
  const current = await findById(id)
  if (!current) return null
  const slug =
    d.slug && d.slug !== current.slug ? await uniqueSlug(d.slug, id) : current.slug
  const { rows } = await query(
    `update blog_posts set
       slug = $2,
       title = $3,
       badge = $4,
       "date" = $5,
       image = $6,
       "desc" = $7,
       content = $8::jsonb,
       updated_at = now()
     where id = $1
     returning *`,
    [
      id,
      slug,
      d.title != null ? String(d.title).trim() : current.title,
      d.badge != null ? d.badge : current.badge,
      d.date != null ? d.date : current.date,
      d.image != null ? d.image : current.image,
      d.desc != null ? d.desc : current.desc,
      JSON.stringify(Array.isArray(d.content) ? d.content : current.content),
    ],
  )
  return toApi(rows[0])
}

async function remove(id) {
  const { rowCount } = await query('delete from blog_posts where id = $1', [id])
  return rowCount > 0
}

async function count() {
  const { rows } = await query('select count(*)::int as n from blog_posts')
  return rows[0].n
}

module.exports = { toApi, slugify, list, findBySlug, findById, create, update, remove, count }
