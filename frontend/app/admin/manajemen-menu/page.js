'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import AdminModal from '@/components/admin/AdminModal'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import { useAdminMenus } from '@/services/menus'
import { toast, confirmDialog } from '@/components/ui/feedback'

const TEMPLATES = [
  { value: 'text', label: 'Teks Biasa', badge: 'bg-primary/10 text-primary-dark', hint: 'Halaman informasi umum (rich text).' },
  { value: 'blog', label: 'Blog', badge: 'bg-blue-100 text-blue-700', hint: 'Halaman artikel tunggal (kategori, penulis, tanggal, SEO).' },
  { value: 'program', label: 'Program', badge: 'bg-amber-100 text-amber-700', hint: 'Halaman program/kegiatan (tujuan, detail, galeri).' },
]
const badgeFor = (t) =>
  t === 'system'
    ? 'bg-gray-100 text-gray-600'
    : (TEMPLATES.find((x) => x.value === t) || {}).badge || 'bg-gray-100 text-gray-600'
const labelFor = (t) =>
  t === 'system' ? 'System' : (TEMPLATES.find((x) => x.value === t) || {}).label || t

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const EMPTY = { id: null, name: '', slug: '', templateType: 'text', parentId: '', isVisible: true, openNewTab: false }

export default function ManajemenMenuPage() {
  const { flat, tree, loading, error, saveMenu, removeMenu, reorderMenus } = useAdminMenus()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState('')

  // urutan lokal untuk drag (dipakai saat menyeret, di-commit saat lepas)
  const [order, setOrder] = useState(null)
  const rows = useMemo(() => order || flatten(tree), [order, tree])

  const parents = flat.filter((m) => m.parentId == null)

  const openAdd = () => {
    setForm(EMPTY)
    setSlugTouched(false)
    setFormErr('')
    setModalOpen(true)
  }
  const openEdit = (m) => {
    setForm({
      id: m.id,
      name: m.name,
      slug: m.slug,
      templateType: m.templateType,
      parentId: m.parentId ? String(m.parentId) : '',
      isVisible: m.isVisible,
      openNewTab: m.openNewTab,
      isSystem: m.templateType === 'system',
    })
    setSlugTouched(true)
    setFormErr('')
    setModalOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return
    const name = form.name.trim()
    if (!name) return setFormErr('Nama menu wajib diisi.')
    const slug = form.isSystem ? form.slug : slugify(form.slug || form.name)
    if (!form.isSystem && !slug) return setFormErr('Slug wajib diisi.')
    if (!form.isSystem && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      return setFormErr('Slug hanya huruf kecil, angka, dan "-".')
    setSaving(true)
    setFormErr('')
    try {
      await saveMenu({
        id: form.id,
        name,
        slug,
        templateType: form.templateType,
        parentId: form.parentId || null,
        isVisible: form.isVisible,
        openNewTab: form.openNewTab,
      })
      setModalOpen(false)
      toast(form.id ? 'Menu diperbarui.' : 'Menu ditambahkan.', { tone: 'success' })
    } catch (err) {
      setFormErr(err.body?.error || err.message || 'Gagal menyimpan menu.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (m) => {
    const kids = flat.filter((x) => x.parentId === m.id)
    const ok = await confirmDialog({
      title: 'Hapus menu?',
      message: kids.length
        ? `Menu "${m.name}" punya ${kids.length} submenu. Menghapusnya akan ikut menghapus semua submenu tersebut.`
        : `Menu "${m.name}" dan halamannya akan dihapus permanen.`,
      confirmLabel: kids.length ? 'Hapus beserta submenu' : 'Hapus',
    })
    if (!ok) return
    try {
      await removeMenu(m.id, { cascade: kids.length > 0 })
      toast('Menu dihapus.', { tone: 'success' })
    } catch (err) {
      toast(err.body?.error || err.message || 'Gagal menghapus menu.', { tone: 'error' })
    }
  }

  const toggleVisible = async (m) => {
    try {
      await saveMenu({ id: m.id, name: m.name, isVisible: !m.isVisible })
      toast(m.isVisible ? `"${m.name}" disembunyikan.` : `"${m.name}" ditampilkan.`, { tone: 'success' })
    } catch (err) {
      toast(err.message || 'Gagal mengubah status.', { tone: 'error' })
    }
  }

  // ---- drag reorder (pointer, dalam scope parent yang sama) ----
  const dragRef = useRef(null)
  const onRowPointerDown = (e, idx) => {
    if (!e.target.closest?.('[data-drag-handle]')) return
    e.preventDefault()
    dragRef.current = { from: idx, list: rows.slice() }
    setOrder(rows.slice())
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onRowPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-row-idx]')
    if (!el) return
    const to = Number(el.getAttribute('data-row-idx'))
    if (Number.isNaN(to) || to === d.from) return
    // hanya boleh tukar dalam parent yang sama
    if (d.list[d.from].parentId !== d.list[to].parentId) return
    const next = d.list.slice()
    const [moved] = next.splice(d.from, 1)
    next.splice(to, 0, moved)
    d.from = to
    d.list = next
    setOrder(next)
  }
  const onRowPointerUp = async () => {
    const d = dragRef.current
    dragRef.current = null
    if (!d) return
    // hitung sort_order baru per grup parent
    const perParent = new Map()
    const payload = []
    for (const r of d.list) {
      const key = r.parentId ?? 0
      const n = (perParent.get(key) || 0) + 1
      perParent.set(key, n)
      payload.push({ id: r.id, sortOrder: n, parentId: r.parentId })
    }
    setOrder(null)
    try {
      await reorderMenus(payload)
    } catch (err) {
      toast(err.message || 'Gagal menyimpan urutan.', { tone: 'error' })
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
          <h1 className="font-heading text-xl font-bold text-navy">Manajemen Menu</h1>
          <p className="mt-1 max-w-2xl text-[13px] text-gray-500">
            Menu di navbar situs diambil dari sini. Tambah menu baru, pilih template, isi kontennya,
            lalu Publish — otomatis muncul di navbar. Seret ikon ☰ untuk mengubah urutan.
          </p>
        </div>
        <button type="button" onClick={openAdd} className="btn btn-primary shrink-0 self-start sm:self-auto">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Tambah Menu
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
          Gagal memuat menu: {error}. Pastikan backend jalan di :3001.
        </p>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead className="bg-gray-50 text-[11px] font-semibold uppercase tracking-[0.04em] text-gray-400">
              <tr>
                <th className="px-3 py-2.5">#</th>
                <th className="px-3 py-2.5">Nama Menu</th>
                <th className="px-3 py-2.5">Template</th>
                <th className="px-3 py-2.5">Parent</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((m, idx) => {
                const parent = m.parentId ? flat.find((x) => x.id === m.parentId) : null
                return (
                  <tr
                    key={m.id}
                    data-row-idx={idx}
                    onPointerDown={(e) => onRowPointerDown(e, idx)}
                    onPointerMove={onRowPointerMove}
                    onPointerUp={onRowPointerUp}
                    className={order ? 'bg-primary/[0.03]' : ''}
                  >
                    <td className="px-3 py-3 text-gray-400">
                      <span className="flex items-center gap-2">
                        <span data-drag-handle className="cursor-grab select-none text-gray-300 hover:text-gray-500" title="Seret untuk urutkan">
                          ☰
                        </span>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`font-semibold text-navy ${parent ? 'pl-4' : ''}`}>
                        {parent && <span className="mr-1 text-gray-300">↳</span>}
                        {m.name}
                      </span>
                      {m.templateType !== 'system' && (
                        <span className="block text-[11px] text-gray-400">/donatur/{m.slug}</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeFor(m.templateType)}`}>
                        {labelFor(m.templateType)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-500">{parent ? parent.name : '—'}</td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => toggleVisible(m)}
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          m.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {m.isVisible ? 'Aktif' : 'Disembunyikan'}
                      </button>
                      {m.templateType !== 'system' && (
                        <span
                          className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            m.pageStatus === 'published' ? 'bg-primary/10 text-primary-dark' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {m.pageStatus === 'published' ? 'Published' : 'Draft'}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(m)}
                          className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-200"
                        >
                          Edit
                        </button>
                        {m.templateType !== 'system' && (
                          <>
                            <Link
                              href={`/admin/manajemen-menu/${m.id}/edit`}
                              className="rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary-dark transition-colors hover:bg-primary/20"
                            >
                              Edit Konten
                            </Link>
                            <a
                              href={`/donatur/${m.slug}?preview=1`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-500 transition-colors hover:bg-gray-50"
                            >
                              Preview
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDelete(m)}
                              className="rounded-lg bg-coral/10 px-2.5 py-1 text-[11px] font-semibold text-coral transition-colors hover:bg-coral/20"
                            >
                              Hapus
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {loading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">Memuat…</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? 'Edit Menu' : 'Tambah Menu'}>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Nama Menu</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => {
                const name = e.target.value
                setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }))
              }}
              className={inputClass}
              placeholder="mis. Kegiatan"
            />
          </div>

          {!form.isSystem && (
            <div>
              <label className={labelClass}>Slug / URL</label>
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3">
                <span className="text-xs text-gray-400">/donatur/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }}
                  className="flex-1 bg-transparent py-2.5 text-sm text-gray-800 outline-none"
                  placeholder="kegiatan"
                />
              </div>
            </div>
          )}

          {!form.isSystem && (
            <div>
              <label className={labelClass}>Pilih Template</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, templateType: t.value }))}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      form.templateType === t.value
                        ? 'border-primary bg-primary/[0.07] ring-1 ring-primary'
                        : 'border-gray-200 hover:border-primary/40'
                    }`}
                  >
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${t.badge}`}>
                      {t.label}
                    </span>
                    <span className="mt-1 block text-[11px] leading-snug text-gray-500">{t.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Parent Menu (opsional)</label>
              <select
                value={form.parentId}
                onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
                className={inputClass}
              >
                <option value="">— Tanpa parent (menu utama) —</option>
                {parents
                  .filter((p) => p.id !== form.id)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex flex-col justify-center gap-2 pt-4">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={form.isVisible}
                  onChange={(e) => setForm((f) => ({ ...f, isVisible: e.target.checked }))}
                  className="h-4 w-4 accent-primary"
                />
                Tampilkan di navbar
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={form.openNewTab}
                  onChange={(e) => setForm((f) => ({ ...f, openNewTab: e.target.checked }))}
                  className="h-4 w-4 accent-primary"
                />
                Buka di tab baru
              </label>
            </div>
          </div>

          {formErr && <p className="text-xs font-semibold text-coral">{formErr}</p>}

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-500 transition-all hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-[1.4] items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? 'Menyimpan…' : form.id ? 'Simpan' : 'Tambah Menu'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  )
}

// pohon → daftar datar berurut [root, anak-anak root, root berikutnya, ...]
function flatten(tree) {
  const out = []
  for (const r of tree) {
    out.push(r)
    for (const c of r.children || []) out.push(c)
  }
  return out
}
