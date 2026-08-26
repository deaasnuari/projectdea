'use client'

import { useState } from 'react'
import AdminModal from '@/components/admin/AdminModal'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import { TEAM } from '@/app/donatur/tentang-kami/timData'

const EMPTY_FORM = { name: '', role: '' }

function AvatarPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.76-3.58-5-8-5z" />
    </svg>
  )
}

// Catatan: data awal diambil dari timData.js, tapi perubahan di sini cuma
// disimpan di state komponen (belum ada backend) — jadi kembali ke data
// awal begitu halaman di-refresh.
export default function AdminTimPage() {
  const [members, setMembers] = useState(TEAM)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (member) => {
    setEditingId(member.id)
    setForm({ name: member.name, role: member.role })
    setModalOpen(true)
  }

  const handleDelete = (member) => {
    if (!window.confirm(`Hapus anggota tim "${member.name}"?`)) return
    setMembers((prev) => prev.filter((m) => m.id !== member.id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.role.trim()) return

    if (editingId) {
      setMembers((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...form } : m)))
    } else {
      const id = `${form.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
      setMembers((prev) => [...prev, { id, ...form }])
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
          <h1 className="font-heading text-2xl font-bold text-navy">Tim</h1>
          <p className="mt-1 text-sm text-gray-500">Nama dan jabatan anggota tim yang tampil di halaman Tentang Kami.</p>
        </div>
        <button type="button" onClick={openAdd} className="btn btn-primary shrink-0">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Tambah Anggota
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
        {members.map((member) => (
          <div key={member.id} className="card p-5 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <AvatarPlaceholder />
            </div>
            <h3 className="mb-0.5 font-heading text-sm font-bold text-navy">{member.name}</h3>
            <p className="mb-4 text-xs text-gray-400">{member.role}</p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => openEdit(member)}
                className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-dark transition-colors hover:bg-primary/20"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(member)}
                className="rounded-lg bg-coral/10 px-3 py-1.5 text-xs font-semibold text-coral transition-colors hover:bg-coral/20"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-gray-400">Belum ada anggota tim.</p>
        )}
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Nama Lengkap</label>
            <input
              type="text"
              required
              placeholder="Nama lengkap"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Jabatan</label>
            <input
              type="text"
              required
              placeholder="Contoh: Ketua LAZIS PLN Batam"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className={inputClass}
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
              {editingId ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  )
}
