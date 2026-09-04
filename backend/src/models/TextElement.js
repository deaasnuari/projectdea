const { query } = require('../config/db')

// Kolom style yang boleh disimpan (selain content). Dipakai untuk membatasi
// input & memetakan snake_case <-> camelCase.
const STYLE_COLUMNS = {
  fontFamily: 'font_family',
  fontSize: 'font_size',
  fontWeight: 'font_weight',
  fontStyle: 'font_style',
  textDecoration: 'text_decoration',
  textColor: 'text_color',
  textAlign: 'text_align',
  lineHeight: 'line_height',
  letterSpacing: 'letter_spacing',
}

function toApi(row) {
  if (!row) return null
  const out = {
    id: Number(row.id),
    elementKey: row.element_key,
    page: row.page || '',
    section: row.section || '',
    content: row.content == null ? null : String(row.content),
    updated_at: row.updated_at,
  }
  for (const [camel, snake] of Object.entries(STYLE_COLUMNS)) {
    out[camel] = row[snake] == null ? null : String(row[snake])
  }
  return out
}

async function list() {
  const { rows } = await query('select * from text_elements order by element_key asc')
  return rows.map(toApi)
}

async function byPage(page) {
  const { rows } = await query('select * from text_elements where page = $1 order by element_key asc', [
    String(page || ''),
  ])
  return rows.map(toApi)
}

async function get(elementKey) {
  const { rows } = await query('select * from text_elements where element_key = $1', [
    String(elementKey || ''),
  ])
  return toApi(rows[0])
}

// Simpan/perbarui satu elemen. Field style yang tidak dikirim TIDAK diubah;
// kirim string kosong / null untuk mengosongkan (kembali ke bawaan).
async function upsert(elementKey, d = {}) {
  const key = String(elementKey || '').trim()
  if (!key) throw new Error('element_key wajib diisi')

  const clean = (v) => {
    if (v == null) return null
    const s = String(v).trim()
    return s === '' ? null : s
  }

  const existing = await get(key)

  // content kosong/blank disimpan sebagai null → frontend pakai teks bawaan.
  let content
  if (d.content === undefined) content = existing?.content ?? null
  else if (d.content == null || String(d.content).trim() === '') content = null
  else content = String(d.content)

  const cols = ['element_key', 'page', 'section', 'content']
  const vals = [
    key,
    clean(d.page) ?? existing?.page ?? '',
    clean(d.section) ?? existing?.section ?? '',
    content,
  ]

  for (const [camel, snake] of Object.entries(STYLE_COLUMNS)) {
    cols.push(snake)
    if (d[camel] === undefined) {
      vals.push(existing ? existing[camel] : null)
    } else {
      vals.push(clean(d[camel]))
    }
  }

  const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ')
  const updates = cols
    .filter((c) => c !== 'element_key')
    .map((c) => `${c} = excluded.${c}`)
    .concat('updated_at = now()')
    .join(', ')

  const { rows } = await query(
    `insert into text_elements (${cols.join(', ')})
     values (${placeholders})
     on conflict (element_key) do update set ${updates}
     returning *`,
    vals,
  )
  return toApi(rows[0])
}

async function remove(elementKey) {
  const { rowCount } = await query('delete from text_elements where element_key = $1', [
    String(elementKey || ''),
  ])
  return rowCount > 0
}

module.exports = { toApi, list, byPage, get, upsert, remove, STYLE_COLUMNS }
