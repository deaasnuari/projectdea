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
  offsetX: 'offset_x',
  offsetY: 'offset_y',
  boxWidth: 'box_width',
}

const clean = (v) => {
  if (v == null) return null
  const s = String(v).trim()
  return s === '' ? null : s
}

// `includeDraft: true` (admin login valid) → nilai draft (belum
// dipublikasikan) menimpa kolom live di respons, supaya editor menampilkan
// perubahan admin sendiri yang belum "Selesai Edit". Publik (includeDraft
// false/kosong) selalu melihat kolom live apa adanya.
function toApi(row, { includeDraft = false } = {}) {
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

  const draft = row.draft && typeof row.draft === 'object' ? row.draft : null
  out.hasDraft = Boolean(draft) || row.draft_reset === true

  if (includeDraft) {
    if (row.draft_reset) {
      out.content = null
      for (const camel of Object.keys(STYLE_COLUMNS)) out[camel] = null
    } else if (draft) {
      if ('content' in draft) out.content = clean(draft.content)
      for (const camel of Object.keys(STYLE_COLUMNS)) {
        if (camel in draft) out[camel] = clean(draft[camel])
      }
    }
  }
  return out
}

async function list({ includeDraft = false } = {}) {
  const { rows } = await query('select * from text_elements order by element_key asc')
  return rows.map((r) => toApi(r, { includeDraft }))
}

async function byPage(page, { includeDraft = false } = {}) {
  const { rows } = await query('select * from text_elements where page = $1 order by element_key asc', [
    String(page || ''),
  ])
  return rows.map((r) => toApi(r, { includeDraft }))
}

async function get(elementKey, { includeDraft = false } = {}) {
  const row = await getRaw(elementKey)
  return toApi(row, { includeDraft })
}

async function getRaw(elementKey) {
  const { rows } = await query('select * from text_elements where element_key = $1', [
    String(elementKey || ''),
  ])
  return rows[0] || null
}

// Tahan perubahan sebagai DRAFT (belum tampil di halaman publik). Field
// style yang tidak dikirim TIDAK diubah di draft; kirim string kosong /
// null untuk menahan "kosongkan field ini" (dipakai saat publish nanti).
async function upsertDraft(elementKey, d = {}) {
  const key = String(elementKey || '').trim()
  if (!key) throw new Error('element_key wajib diisi')

  const existing = await getRaw(key)

  const page = d.page !== undefined ? clean(d.page) ?? '' : existing?.page ?? ''
  const section = d.section !== undefined ? clean(d.section) ?? '' : existing?.section ?? ''

  const allowedKeys = ['content', ...Object.keys(STYLE_COLUMNS)]
  const patch = {}
  for (const k of allowedKeys) {
    if (d[k] !== undefined) patch[k] = d[k] == null ? '' : String(d[k])
  }

  const { rows } = await query(
    `insert into text_elements (element_key, page, section, draft, draft_reset)
     values ($1, $2, $3, $4::jsonb, false)
     on conflict (element_key) do update set
       page = $2,
       section = $3,
       draft = coalesce(text_elements.draft, '{}'::jsonb) || $4::jsonb,
       draft_reset = false,
       updated_at = now()
     returning *`,
    [key, page, section, JSON.stringify(patch)],
  )
  return toApi(rows[0], { includeDraft: true })
}

// Tahan permintaan "kembalikan ke bawaan" sebagai draft — baris live-nya
// baru benar-benar dihapus saat publish. Elemen yang belum pernah ada baris
// live-nya (tidak pernah disimpan) tidak perlu ditahan apa pun.
async function stageReset(elementKey) {
  const key = String(elementKey || '').trim()
  if (!key) throw new Error('element_key wajib diisi')
  const { rowCount } = await query(
    `update text_elements set draft = null, draft_reset = true, updated_at = now() where element_key = $1`,
    [key],
  )
  return rowCount > 0
}

// Publikasikan SELURUH draft sebuah halaman: salin isi draft ke kolom live,
// dan hapus baris yang draft-nya "reset ke bawaan". Dipanggil saat admin
// klik "Selesai Edit".
async function publishPage(page) {
  const p = String(page || '')
  let publishedCount = 0

  const del = await query('delete from text_elements where page = $1 and draft_reset = true', [p])
  publishedCount += del.rowCount

  const { rows } = await query('select * from text_elements where page = $1 and draft is not null', [p])
  for (const row of rows) {
    const draft = row.draft || {}
    const sets = []
    const vals = [row.element_key]
    let i = 2
    if ('content' in draft) {
      sets.push(`content = $${i}`)
      vals.push(clean(draft.content))
      i += 1
    }
    for (const [camel, snake] of Object.entries(STYLE_COLUMNS)) {
      if (camel in draft) {
        sets.push(`${snake} = $${i}`)
        vals.push(clean(draft[camel]))
        i += 1
      }
    }
    if (sets.length) {
      await query(
        `update text_elements set ${sets.join(', ')}, draft = null, draft_reset = false, updated_at = now()
         where element_key = $1`,
        vals,
      )
    } else {
      await query('update text_elements set draft = null, draft_reset = false where element_key = $1', [
        row.element_key,
      ])
    }
    publishedCount += 1
  }

  return { publishedCount }
}

async function remove(elementKey) {
  const { rowCount } = await query('delete from text_elements where element_key = $1', [
    String(elementKey || ''),
  ])
  return rowCount > 0
}

module.exports = {
  toApi,
  list,
  byPage,
  get,
  getRaw,
  upsertDraft,
  stageReset,
  publishPage,
  remove,
  STYLE_COLUMNS,
}
