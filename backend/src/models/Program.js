const { query } = require('../config/db')

function toApi(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    badge: row.badge || '',
    icon: row.icon || '',
    image: row.image || '',
    jenisId: row.jenis_id || '',
    theme: row.theme || 'green',
    desc: row.desc || '',
    harapan: row.harapan || '',
    deskripsiLengkap: Array.isArray(row.deskripsi) ? row.deskripsi : [],
    manfaat: Array.isArray(row.manfaat) ? row.manfaat : [],
    target: Number(row.target) || 0,
    collected: Number(row.collected) || 0,
    donors: Number(row.donors) || 0,
    active: row.active !== false,
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

async function uniqueSlug(base, exceptId = null) {
  let slug = slugify(base) || `program-${Date.now()}`
  let n = 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { rows } = await query(
      'select id from programs where slug = $1 and ($2::bigint is null or id <> $2)',
      [slug, exceptId],
    )
    if (rows.length === 0) return slug
    n += 1
    slug = `${slugify(base)}-${n}`
  }
}

async function list({ includeInactive = false } = {}) {
  const where = includeInactive ? '' : 'where active'
  const { rows } = await query(
    `select * from programs ${where} order by sort_order asc, created_at asc`,
  )
  return rows.map(toApi)
}

async function findBySlug(slug, { includeInactive = false } = {}) {
  const { rows } = await query('select * from programs where slug = $1', [slug])
  const p = toApi(rows[0])
  if (!p) return null
  if (!includeInactive && !p.active) return null
  return p
}

async function findById(id) {
  const { rows } = await query('select * from programs where id = $1', [id])
  return toApi(rows[0])
}

async function create(d) {
  const slug = await uniqueSlug(d.slug || d.title)
  const { rows } = await query(
    `insert into programs
       (slug, title, badge, icon, image, jenis_id, theme, "desc", harapan,
        deskripsi, manfaat, target, collected, donors)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12,$13,$14)
     returning *`,
    [
      slug,
      String(d.title || '').trim(),
      d.badge || null,
      d.icon || null,
      d.image || null,
      d.jenisId || null,
      d.theme || 'green',
      d.desc || null,
      d.harapan || null,
      JSON.stringify(Array.isArray(d.deskripsiLengkap) ? d.deskripsiLengkap : []),
      JSON.stringify(Array.isArray(d.manfaat) ? d.manfaat : []),
      Math.round(Number(d.target) || 0),
      Math.round(Number(d.collected) || 0),
      Math.round(Number(d.donors) || 0),
    ],
  )
  return toApi(rows[0])
}

async function update(id, d) {
  const cur = await findById(id)
  if (!cur) return null
  const slug = d.slug && d.slug !== cur.slug ? await uniqueSlug(d.slug, id) : cur.slug
  const val = (v, fallback) => (v != null ? v : fallback)
  const { rows } = await query(
    `update programs set
       slug = $2, title = $3, badge = $4, icon = $5, image = $6, jenis_id = $7,
       theme = $8, "desc" = $9, harapan = $10, deskripsi = $11::jsonb,
       manfaat = $12::jsonb, target = $13, collected = $14, donors = $15,
       active = $16, updated_at = now()
     where id = $1
     returning *`,
    [
      id,
      slug,
      val(d.title != null ? String(d.title).trim() : null, cur.title),
      val(d.badge, cur.badge),
      val(d.icon, cur.icon),
      val(d.image, cur.image),
      val(d.jenisId, cur.jenisId),
      val(d.theme, cur.theme),
      val(d.desc, cur.desc),
      val(d.harapan, cur.harapan),
      JSON.stringify(Array.isArray(d.deskripsiLengkap) ? d.deskripsiLengkap : cur.deskripsiLengkap),
      JSON.stringify(Array.isArray(d.manfaat) ? d.manfaat : cur.manfaat),
      Math.round(Number(val(d.target, cur.target)) || 0),
      Math.round(Number(val(d.collected, cur.collected)) || 0),
      Math.round(Number(val(d.donors, cur.donors)) || 0),
      typeof d.active === 'boolean' ? d.active : cur.active,
    ],
  )
  return toApi(rows[0])
}

async function remove(id) {
  const { rowCount } = await query('delete from programs where id = $1', [id])
  return rowCount > 0
}

async function count() {
  const { rows } = await query('select count(*)::int as n from programs')
  return rows[0].n
}

module.exports = { toApi, slugify, list, findBySlug, findById, create, update, remove, count }
