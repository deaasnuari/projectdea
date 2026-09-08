'use client'

import { useState } from 'react'
import AdminModal from '@/components/admin/AdminModal'
import VisibilityStatus from '@/components/admin/VisibilityStatus'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import { uploadImage } from '@/services/imageFile'
import { useBlogPosts, formatBlogDate, toDateInputValue } from '@/services/blog'
import { toast, confirmDialog } from '@/components/ui/feedback'

const EMPTY_FORM = { id: null, slug: '', title: '', badge: '', date: '', image: '', desc: '', content: '' }

//ini fungsi untuk menampilkan halaman admin untuk mengelola konten "Blog
export default function AdminBlogPage() {
  const { posts, loading, error, savePost, removePost } = useBlogPosts()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null) // objek artikel yang diedit, atau null
  const [form, setForm] = useState(EMPTY_FORM)
  const [imgBusy, setImgBusy] = useState(false)
  const [imgError, setImgError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Sampai 3 artikel: grid biasa (3 kolom). Lebih dari itu: baris yang digeser
  // ke samping (scroll-snap) — pola yang sama seperti Program & Dokumentasi.
  const slideMode = posts.length > 3

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setImgError('')
    setSaveError('')
    setModalOpen(true)
  }

  // Pilih file gambar → diperkecil jadi data URL, disimpan di form.
  const handleImageFile = async (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    setImgBusy(true)
    setImgError('')
    try {
      const url = await uploadImage(file)
      setForm((f) => ({ ...f, image: url }))
    } catch (err) {
      setImgError(err.message || 'Gagal mengunggah gambar')
    } finally {
      setImgBusy(false)
    }
  }

  const openEdit = (post) => {
    setEditing(post)
    setImgError('')
    setSaveError('')
    setForm({
      id: post.id,
      slug: post.slug,
      title: post.title,
      badge: post.badge,
      date: toDateInputValue(post.date),
      image: post.image,
      desc: post.desc,
      content: (post.content || []).join('\n\n'),
    })
    setModalOpen(true)
  }

  // Ubah status tampil/sembunyi artikel di halaman donatur tanpa membuka
  // modal. Kirim ulang field yang ada + flag `active` yang baru.
  const changeActive = async (post, active) => {
    try {
      await savePost({
        id: post.id,
        slug: post.slug,
        title: post.title,
        badge: post.badge,
        date: post.date,
        image: post.image,
        desc: post.desc,
        content: (post.content || []).join('\n\n'),
        active,
      })
      toast(
        active
          ? `Artikel "${post.title}" tampil di halaman donatur.`
          : `Artikel "${post.title}" disembunyikan dari halaman donatur.`,
        { tone: 'success' },
      )
    } catch (err) {
      toast(err.message || 'Gagal mengubah status artikel', { tone: 'error' })
    }
  }

  const handleDelete = async (post) => {
    const ok = await confirmDialog({
      title: 'Hapus artikel?',
      message: `Artikel "${post.title}" akan dihapus permanen.`,
      confirmLabel: 'Hapus',
    })
    if (!ok) return
    try {
      await removePost(post)
      toast('Artikel dihapus.', { tone: 'success' })
    } catch (err) {
      toast(err.message || 'Gagal menghapus artikel', { tone: 'error' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || saving) return
    setSaving(true)
    setSaveError('')
    try {
      await savePost({
        id: editing?.id ?? null,
        slug: editing?.slug || undefined,
        title: form.title,
        badge: form.badge,
        date: form.date,
        image: form.image || editing?.image || '/images/program-1.png',
        desc: form.desc,
        content: form.content, // string paragraf — dipecah di backend
      })
      setModalOpen(false)
      toast(editing ? 'Perubahan artikel disimpan.' : 'Artikel baru ditambahkan.', { tone: 'success' })
    } catch (err) {
      setSaveError(err.message || 'Gagal menyimpan artikel')
      toast(err.message || 'Gagal menyimpan artikel', { tone: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
          <h1 className="font-heading text-xl font-bold text-navy">Blog &amp; Kursus</h1>
          <p className="mt-1 text-[13px] text-gray-500">Artikel yang tampil di halaman Blog situs donatur.</p>
        </div>
        <button type="button" onClick={openAdd} className="btn btn-primary shrink-0 self-start sm:self-auto">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Tambah Artikel
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
          Gagal memuat artikel: {error}. Pastikan backend jalan di :3001.
        </p>
      )}

      <div
        className={
          slideMode
            ? 'no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2'
            : 'grid grid-cols-3 gap-6 max-[1000px]:grid-cols-2 max-[768px]:grid-cols-1'
        }
      >
        {posts.map((post) => {
          const hidden = post.active === false
          return (
            <div
              key={post.id ?? post.slug}
              className={`card ${
                slideMode
                  ? 'w-[280px] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]'
                  : ''
              } ${hidden ? 'opacity-70' : ''}`}
            >
              <div className="relative flex h-32 items-center justify-center overflow-hidden bg-gray-100">
                {post.image && (
                  <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
                )}
                {post.badge && (
                  <span className="absolute left-4 top-4 z-[1] rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark backdrop-blur-sm">
                    {post.badge}
                  </span>
                )}
                {hidden && (
                  <span className="absolute right-4 top-4 z-[1] rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold text-white">
                    Disembunyikan
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="mb-1 text-xs text-gray-400">{formatBlogDate(post.date)}</p>
                <h3 className="mb-1 font-heading text-base font-bold leading-snug text-navy">{post.title}</h3>
                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-500">{post.desc}</p>
                <VisibilityStatus
                  active={post.active !== false}
                  onChange={(active) => changeActive(post, active)}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(post)}
                    className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-dark transition-colors hover:bg-primary/20"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post)}
                    className="rounded-lg bg-coral/10 px-3 py-1.5 text-xs font-semibold text-coral transition-colors hover:bg-coral/20"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {loading && posts.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-gray-400">Memuat…</p>
        )}
        {!loading && posts.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-gray-400">Belum ada artikel.</p>
        )}
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Artikel' : 'Tambah Artikel'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Judul</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge / Kategori</label>
              <input
                type="text"
                placeholder="Contoh: Kursus Zakat"
                value={form.badge}
                onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tanggal Terbit</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-400">Klik untuk pilih tanggal dari kalender.</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Gambar Artikel</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFile}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary-dark hover:file:cursor-pointer hover:file:bg-primary/20"
            />
            <p className="mt-1 text-xs text-gray-400">
              Pilih file gambar dari perangkat (JPG/PNG). Tampil sebagai gambar utama artikel.
            </p>
            {imgBusy && <p className="mt-1 text-xs text-primary">Memproses gambar…</p>}
            {imgError && <p className="mt-1 text-xs font-semibold text-coral">{imgError}</p>}
            {form.image && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={form.image}
                  alt="Pratinjau gambar artikel"
                  className="h-20 w-32 rounded-lg border border-gray-100 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, image: '' }))}
                  className="text-xs font-semibold text-coral hover:text-coral-dark"
                >
                  Hapus gambar
                </button>
              </div>
            )}
          </div>
          <div>
            <label className={labelClass}>Ringkasan</label>
            <textarea
              rows={2}
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Isi Artikel (pisahkan tiap paragraf dengan baris kosong)</label>
            <textarea
              rows={6}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className={`${inputClass} resize-none`}
            />
          </div>
          {saveError && <p className="text-xs font-semibold text-coral">{saveError}</p>}
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={imgBusy || saving}
              className="flex flex-[1.4] items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Menyimpan…' : imgBusy ? 'Memproses…' : editing ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  )
}
