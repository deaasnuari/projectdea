const Menu = require('../models/Menu')
const MenuPage = require('../models/MenuPage')
const { COOKIE_NAME, verifyToken } = require('../lib/session')

const isAdminReq = (req) => verifyToken(req.cookies?.[COOKIE_NAME]) !== null

// GET /api/menus  (publik) — pohon menu yang tampil di navbar
async function publicTree(_req, res, next) {
  try {
    res.json({ data: await Menu.tree({ publicOnly: true }) })
  } catch (err) {
    next(err)
  }
}

// GET /api/menus/all  (admin) — semua menu (datar + pohon) untuk panel
async function adminList(_req, res, next) {
  try {
    const flat = await Menu.list()
    res.json({ data: flat, tree: Menu.buildTree(flat) })
  } catch (err) {
    next(err)
  }
}

// GET /api/menus/:idOrSlug  — menu + konten halamannya.
// Halaman draft hanya dikirim kalau ada ?preview=1 + sesi admin.
async function getOne(req, res, next) {
  try {
    const key = req.params.idOrSlug
    const menu = /^\d+$/.test(key) ? await Menu.findById(Number(key)) : await Menu.bySlug(key)
    if (!menu) return res.status(404).json({ error: 'Menu tidak ditemukan' })

    let page = null
    if (menu.templateType !== 'system') {
      page = await MenuPage.get(menu.id)
      const preview = String(req.query.preview || '') === '1' && isAdminReq(req)
      if (!preview && (!page || page.status !== 'published')) {
        // publik: halaman belum dipublikasikan → anggap tidak ada
        if (!isAdminReq(req)) return res.status(404).json({ error: 'Halaman belum dipublikasikan' })
      }
    }
    res.json({ menu, page })
  } catch (err) {
    next(err)
  }
}

async function validateMenuInput(b, { id = null } = {}) {
  const name = String(b.name || '').trim()
  if (!name) return 'Nama menu wajib diisi'

  if (b.templateType != null && !Menu.TEMPLATES.includes(b.templateType)) {
    return 'Template tidak valid'
  }

  // slug hanya divalidasi untuk menu non-system
  const rawSlug = b.slug != null ? Menu.slugify(b.slug) : Menu.slugify(b.name)
  if (b.templateType !== 'system') {
    if (!rawSlug) return 'Slug wajib diisi'
    if (!Menu.SLUG_RE.test(rawSlug)) return 'Slug hanya boleh huruf kecil, angka, dan tanda "-"'
    if (await Menu.slugTaken(rawSlug, id)) return `Slug "${rawSlug}" sudah dipakai`
  }

  if (b.parentId) {
    const pid = Number(b.parentId)
    if (id != null && pid === Number(id)) return 'Menu tidak bisa menjadi parent dirinya sendiri'
    const parent = await Menu.findById(pid)
    if (!parent) return 'Parent menu tidak ditemukan'
    if (parent.parentId != null) return 'Submenu hanya boleh satu tingkat'
  }
  return null
}

// POST /api/menus  (admin)
async function create(req, res, next) {
  try {
    const b = req.body || {}
    const err = await validateMenuInput(b)
    if (err) return res.status(400).json({ error: err })
    const menu = await Menu.create(b)
    // siapkan baris halaman kosong (draft) untuk template non-system
    if (menu.templateType !== 'system') {
      await MenuPage.upsert(menu.id, { title: menu.name, status: 'draft' })
    }
    res.status(201).json(menu)
  } catch (err) {
    next(err)
  }
}

// PUT /api/menus/:id  (admin)
async function update(req, res, next) {
  try {
    const id = Number(req.params.id)
    const cur = await Menu.findById(id)
    if (!cur) return res.status(404).json({ error: 'Menu tidak ditemukan' })

    const b = req.body || {}
    // Menu system: hanya nama / urutan / visibilitas / parent / tab yang bisa diubah.
    if (cur.templateType === 'system') {
      delete b.slug
      delete b.templateType
    }
    const err = await validateMenuInput({ ...b, templateType: b.templateType ?? cur.templateType }, { id })
    if (err) return res.status(400).json({ error: err })

    const menu = await Menu.update(id, b)
    res.json(menu)
  } catch (err) {
    next(err)
  }
}

// PUT /api/menus/reorder  (admin)  body: { items: [{id, sortOrder, parentId}] }
async function reorder(req, res, next) {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : []
    res.json({ data: await Menu.reorder(items) })
  } catch (err) {
    next(err)
  }
}

// PUT /api/menus/:id/page  (admin) — simpan konten halaman
async function savePage(req, res, next) {
  try {
    const id = Number(req.params.id)
    const menu = await Menu.findById(id)
    if (!menu) return res.status(404).json({ error: 'Menu tidak ditemukan' })
    if (menu.templateType === 'system') {
      return res.status(400).json({ error: 'Menu system tidak punya halaman yang bisa diedit' })
    }
    const b = req.body || {}
    const page = await MenuPage.upsert(id, {
      title: b.title,
      heroImage: b.heroImage,
      bodyHtml: b.bodyHtml,
      data: b.data,
      status: b.status,
    })
    res.json(page)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/menus/:id  (admin)  ?cascade=1 untuk hapus beserta submenu
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id)
    const menu = await Menu.findById(id)
    if (!menu) return res.status(404).json({ error: 'Menu tidak ditemukan' })
    if (menu.templateType === 'system') {
      return res.status(400).json({ error: 'Menu bawaan tidak bisa dihapus' })
    }
    const cascade = String(req.query.cascade || '') === '1'
    await Menu.remove(id, { cascade })
    res.json({ ok: true })
  } catch (err) {
    if (err.code === 'HAS_CHILDREN') {
      return res
        .status(409)
        .json({ error: 'Menu ini masih punya submenu', childCount: err.childCount })
    }
    next(err)
  }
}

module.exports = { publicTree, adminList, getOne, create, update, reorder, savePage, remove }
