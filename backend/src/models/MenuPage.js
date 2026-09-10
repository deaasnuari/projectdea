const { query } = require('../config/db')

function toApi(row) {
  if (!row) return null
  return {
    menuId: Number(row.menu_id),
    title: row.title || '',
    heroImage: row.hero_image || '',
    bodyHtml: row.body_html || '',
    data: row.data && typeof row.data === 'object' ? row.data : {},
    status: row.status === 'published' ? 'published' : 'draft',
    updated_at: row.updated_at,
  }
}

async function get(menuId) {
  const { rows } = await query('select * from menu_pages where menu_id = $1', [menuId])
  return toApi(rows[0])
}

// Simpan/perbarui konten halaman sebuah menu. Field yang tidak dikirim
// dipertahankan (kecuali saat baris belum ada → pakai default).
async function upsert(menuId, d = {}) {
  const cur = await get(menuId)
  const val = (v, fallback) => (v === undefined ? fallback : v)
  const title = val(d.title != null ? String(d.title) : undefined, cur?.title ?? '')
  const heroImage = val(d.heroImage != null ? String(d.heroImage) : undefined, cur?.heroImage ?? '')
  const bodyHtml = val(d.bodyHtml != null ? String(d.bodyHtml) : undefined, cur?.bodyHtml ?? '')
  const data = d.data && typeof d.data === 'object' ? d.data : cur?.data ?? {}
  const status =
    d.status === 'published' ? 'published' : d.status === 'draft' ? 'draft' : cur?.status ?? 'draft'

  const { rows } = await query(
    `insert into menu_pages (menu_id, title, hero_image, body_html, data, status, updated_at)
     values ($1,$2,$3,$4,$5::jsonb,$6, now())
     on conflict (menu_id) do update set
       title = excluded.title,
       hero_image = excluded.hero_image,
       body_html = excluded.body_html,
       data = excluded.data,
       status = excluded.status,
       updated_at = now()
     returning *`,
    [menuId, title, heroImage, bodyHtml, JSON.stringify(data), status],
  )
  return toApi(rows[0])
}

module.exports = { toApi, get, upsert }
