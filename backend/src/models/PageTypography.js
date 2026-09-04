const { query } = require('../config/db')

// id baris untuk tiap halaman. Sekarang baru "Kami Peduli".
const PAGE_IDS = {
  'kami-peduli': 12345,
}

// Pilihan yang boleh dipakai (validasi + acuan default). Nilai stack font
// ada di frontend (services/pageTypography.js) — di sini cukup kuncinya.
const BODY_FONTS = ['default', 'serif', 'system', 'mono', 'rounded']
const HEADING_FONTS = ['default', 'match-body', 'serif', 'sans', 'slab']
const MIN_SCALE = 0.8
const MAX_SCALE = 1.4

const DEFAULTS = { bodyFont: 'default', headingFont: 'default', fontScale: 1 }

function toApi(row) {
  if (!row) return { ...DEFAULTS }
  return {
    id: Number(row.id),
    label: row.label || '',
    bodyFont: BODY_FONTS.includes(row.body_font) ? row.body_font : 'default',
    headingFont: HEADING_FONTS.includes(row.heading_font) ? row.heading_font : 'default',
    fontScale: clampScale(Number(row.font_scale)),
    updated_at: row.updated_at,
  }
}

function clampScale(n) {
  const v = Number(n)
  if (!Number.isFinite(v)) return 1
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(v * 100) / 100))
}

function resolveId(page) {
  return PAGE_IDS[page] || PAGE_IDS['kami-peduli']
}

async function get(page = 'kami-peduli') {
  const { rows } = await query('select * from page_typography where id = $1', [resolveId(page)])
  return toApi(rows[0])
}

async function save(page, d = {}) {
  const id = resolveId(page)
  const bodyFont = BODY_FONTS.includes(d.bodyFont) ? d.bodyFont : 'default'
  const headingFont = HEADING_FONTS.includes(d.headingFont) ? d.headingFont : 'default'
  const fontScale = clampScale(d.fontScale)
  const { rows } = await query(
    `insert into page_typography (id, label, body_font, heading_font, font_scale, updated_at)
     values ($1, $2, $3, $4, $5, now())
     on conflict (id) do update
       set body_font = excluded.body_font,
           heading_font = excluded.heading_font,
           font_scale = excluded.font_scale,
           updated_at = now()
     returning *`,
    [id, d.label || 'Kami Peduli', bodyFont, headingFont, fontScale],
  )
  return toApi(rows[0])
}

// Kembalikan ke tampilan bawaan (default) — baris tetap ada.
async function reset(page = 'kami-peduli') {
  return save(page, DEFAULTS)
}

module.exports = { get, save, reset, toApi, DEFAULTS, BODY_FONTS, HEADING_FONTS, PAGE_IDS }
