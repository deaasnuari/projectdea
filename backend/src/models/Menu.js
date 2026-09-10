const { query, pool } = require('../config/db')

const TEMPLATES = ['system', 'text', 'blog', 'program']
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function toApi(row) {
  if (!row) return null
  return {
    id: Number(row.id),
    name: row.name || '',
    slug: row.slug || '',
    templateType: row.template_type || 'text',
    systemPath: row.system_path || null,
    parentId: row.parent_id == null ? null : Number(row.parent_id),
    sortOrder: Number(row.sort_order) || 0,
    isVisible: row.is_visible !== false,
    openNewTab: row.open_new_tab === true,
    // href final yang dipakai frontend
    href:
      row.template_type === 'system'
        ? row.system_path || '/donatur'
        : `/donatur/${row.slug}`,
    // status halaman (di-join dari menu_pages saat perlu)
    pageStatus: row.page_status || (row.template_type === 'system' ? 'published' : null),
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
    .replace(/^-|-$/g, '')
    .slice(0, 100)
}

async function findById(id) {
  const { rows } = await query('select * from menus where id = $1', [id])
  return toApi(rows[0])
}

async function bySlug(slug) {
  const { rows } = await query(
    `select m.*, p.status as page_status from menus m
       left join menu_pages p on p.menu_id = m.id
     where m.slug = $1`,
    [String(slug || '')],
  )
  return toApi(rows[0])
}

async function slugTaken(slug, exceptId = null) {
  const { rows } = await query(
    'select 1 from menus where slug = $1 and ($2::bigint is null or id <> $2)',
    [slug, exceptId],
  )
  return rows.length > 0
}

// Daftar datar semua menu + status halamannya.
async function list() {
  const { rows } = await query(
    `select m.*, p.status as page_status from menus m
       left join menu_pages p on p.menu_id = m.id
     order by m.sort_order asc, m.id asc`,
  )
  return rows.map(toApi)
}

// Susun jadi pohon (parent + children[]). `publicOnly` → hanya yang is_visible
// dan (system atau halaman published).
function buildTree(flat, { publicOnly = false } = {}) {
  const visible = publicOnly
    ? flat.filter(
        (m) => m.isVisible && (m.templateType === 'system' || m.pageStatus === 'published'),
      )
    : flat
  const byId = new Map(visible.map((m) => [m.id, { ...m, children: [] }]))
  const roots = []
  for (const m of byId.values()) {
    if (m.parentId != null && byId.has(m.parentId)) {
      byId.get(m.parentId).children.push(m)
    } else {
      roots.push(m)
    }
  }
  const sortRec = (arr) => {
    arr.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
    arr.forEach((n) => sortRec(n.children))
  }
  sortRec(roots)
  return roots
}

async function tree(opts) {
  return buildTree(await list(), opts)
}

async function nextSortOrder(parentId = null) {
  const { rows } = await query(
    `select coalesce(max(sort_order), 0) + 1 as n from menus
       where parent_id is not distinct from $1`,
    [parentId],
  )
  return Number(rows[0].n) || 1
}

async function create(d) {
  const name = String(d.name || '').trim()
  const slug = slugify(d.slug || d.name)
  const templateType = TEMPLATES.includes(d.templateType) ? d.templateType : 'text'
  const parentId = d.parentId ? Number(d.parentId) : null
  const sortOrder = d.sortOrder != null ? Number(d.sortOrder) : await nextSortOrder(parentId)
  const { rows } = await query(
    `insert into menus (name, slug, template_type, parent_id, sort_order, is_visible, open_new_tab)
     values ($1,$2,$3,$4,$5,$6,$7) returning *`,
    [
      name,
      slug,
      templateType,
      parentId,
      sortOrder,
      d.isVisible !== false,
      d.openNewTab === true,
    ],
  )
  return toApi(rows[0])
}

async function update(id, d) {
  const cur = await findById(id)
  if (!cur) return null
  const isSystem = cur.templateType === 'system'
  const v = (val, fallback) => (val === undefined ? fallback : val)

  // Menu system: slug & template_type & system_path terkunci.
  const slug = isSystem
    ? cur.slug
    : d.slug !== undefined
    ? slugify(d.slug)
    : cur.slug
  const templateType = isSystem
    ? 'system'
    : TEMPLATES.includes(d.templateType)
    ? d.templateType
    : cur.templateType

  const { rows } = await query(
    `update menus set
       name = $2, slug = $3, template_type = $4, parent_id = $5,
       sort_order = $6, is_visible = $7, open_new_tab = $8, updated_at = now()
     where id = $1 returning *`,
    [
      id,
      v(d.name != null ? String(d.name).trim() : undefined, cur.name),
      slug,
      templateType,
      d.parentId !== undefined ? (d.parentId ? Number(d.parentId) : null) : cur.parentId,
      v(d.sortOrder != null ? Number(d.sortOrder) : undefined, cur.sortOrder),
      typeof d.isVisible === 'boolean' ? d.isVisible : cur.isVisible,
      typeof d.openNewTab === 'boolean' ? d.openNewTab : cur.openNewTab,
    ],
  )
  return toApi(rows[0])
}

// Urutan & parent baru untuk banyak menu sekaligus (drag-drop), satu transaksi.
async function reorder(items = []) {
  const client = await pool.connect()
  try {
    await client.query('begin')
    for (const it of items) {
      await client.query(
        `update menus set sort_order = $2, parent_id = $3, updated_at = now() where id = $1`,
        [Number(it.id), Number(it.sortOrder) || 0, it.parentId ? Number(it.parentId) : null],
      )
    }
    await client.query('commit')
  } catch (err) {
    await client.query('rollback')
    throw err
  } finally {
    client.release()
  }
  return list()
}

async function childrenOf(id) {
  const { rows } = await query('select * from menus where parent_id = $1 order by sort_order', [id])
  return rows.map(toApi)
}

async function remove(id, { cascade = false } = {}) {
  const kids = await childrenOf(id)
  if (kids.length && !cascade) {
    const e = new Error('Menu ini masih punya submenu')
    e.code = 'HAS_CHILDREN'
    e.childCount = kids.length
    throw e
  }
  if (kids.length && cascade) {
    for (const k of kids) await query('delete from menus where id = $1', [k.id])
  }
  const { rowCount } = await query("delete from menus where id = $1 and template_type <> 'system'", [
    id,
  ])
  return rowCount > 0
}

module.exports = {
  TEMPLATES,
  SLUG_RE,
  toApi,
  slugify,
  findById,
  bySlug,
  slugTaken,
  list,
  tree,
  buildTree,
  create,
  update,
  reorder,
  childrenOf,
  remove,
}
