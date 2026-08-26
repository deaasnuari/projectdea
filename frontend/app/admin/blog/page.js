'use client'

import { useState } from 'react'
import AdminModal from '@/components/admin/AdminModal'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import { POSTS } from '@/app/donatur/blog/blogData'

const EMPTY_FORM = { title: '', badge: '', date: '', readTime: '', image: '', desc: '', content: '' }

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

// Catatan: data awal diambil dari blogData.js, tapi perubahan di sini cuma
// disimpan di state komponen (belum ada backend) — jadi kembali ke data
// awal begitu halaman di-refresh.
export default function AdminBlogPage() {
  const [posts, setPosts] = useState(POSTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const openAdd = () => {
    setEditingSlug(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (post) => {
    setEditingSlug(post.slug)
    setForm({
      title: post.title,
      badge: post.badge,
      date: post.date,
      readTime: post.readTime,
      image: post.image,
      desc: post.desc,
      content: post.content.join('\n\n'),
    })
    setModalOpen(true)
  }

  const handleDelete = (post) => {
    if (!window.confirm(`Hapus artikel "${post.title}"?`)) return
    setPosts((prev) => prev.filter((p) => p.slug !== post.slug))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    const contentParagraphs = form.content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)

    if (editingSlug) {
      setPosts((prev) =>
        prev.map((p) =>
          p.slug === editingSlug
            ? { ...p, ...form, image: form.image || p.image, content: contentParagraphs }
            : p
        )
      )
    } else {
      const slug = slugify(form.title) || `artikel-${Date.now()}`
      setPosts((prev) => [
        { slug, ...form, image: form.image || '/images/program-1.png', content: contentParagraphs },
        ...prev,
      ])
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
          <h1 className="font-heading text-2xl font-bold text-navy">Artikel Blog</h1>
          <p className="mt-1 text-sm text-gray-500">Artikel yang tampil di halaman Blog situs donatur.</p>
        </div>
        <button type="button" onClick={openAdd} className="btn btn-primary shrink-0">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Tambah Artikel
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-[0.05em] text-gray-400">
              <tr>
                <th className="px-5 py-3">Artikel</th>
                <th className="px-5 py-3">Badge</th>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.slug}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={post.image} alt={post.title} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                      <span className="font-semibold text-navy">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary-dark">
                      {post.badge}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{post.date}</td>
                  <td className="px-5 py-3">
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
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-400">
                    Belum ada artikel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingSlug ? 'Edit Artikel' : 'Tambah Artikel'}>
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
              <label className={labelClass}>Waktu Baca</label>
              <input
                type="text"
                placeholder="Contoh: 5 menit baca"
                value={form.readTime}
                onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tanggal</label>
              <input
                type="text"
                placeholder="Contoh: 12 Jan 2025"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>URL Gambar</label>
              <input
                type="text"
                placeholder="/images/..."
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                className={inputClass}
              />
            </div>
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
              className="flex flex-[1.4] items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark"
            >
              {editingSlug ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  )
}
