'use client'

import { useState } from 'react'
import AdminModal from '@/components/admin/AdminModal'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import { uploadImage } from '@/services/imageFile'
import { useTeam } from '@/services/team'

const EMPTY_FORM = { id: null, name: '', role: '', photo: '' }

function AvatarPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.76-3.58-5-8-5z" />
    </svg>
  )
}

export default function AdminTimPage() {
  const { team: members, loading, error, saveMember, removeMember } = useTeam()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [imgBusy, setImgBusy] = useState(false)
  const [imgError, setImgError] = useState('')

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setSaveError('')
    setImgError('')
    setModalOpen(true)
  }

  const openEdit = (member) => {
    setEditing(member)
    setSaveError('')
    setImgError('')
    setForm({ id: member.id, name: member.name, role: member.role, photo: member.photo || '' })
    setModalOpen(true)
  }

  // Pilih file foto → diperkecil jadi data URL, disimpan di form.
  const handlePhotoFile = async (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    setImgBusy(true)
    setImgError('')
    try {
      const url = await uploadImage(file, { maxDim: 600, quality: 0.82 })
      setForm((f) => ({ ...f, photo: url }))
    } catch (err) {
      setImgError(err.message || 'Gagal mengunggah gambar')
    } finally {
      setImgBusy(false)
    }
  }

  const handleDelete = async (member) => {
    if (!window.confirm(`Hapus anggota tim "${member.name}"?`)) return
    try {
      await removeMember(member)
    } catch (err) {
      window.alert(err.message || 'Gagal menghapus anggota tim')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.role.trim() || saving) return
    setSaving(true)
    setSaveError('')
    try {
      await saveMember({
        id: editing?.id ?? null,
        name: form.name.trim(),
        role: form.role.trim(),
        photo: form.photo || '',
      })
      setModalOpen(false)
    } catch (err) {
      setSaveError(err.message || 'Gagal menyimpan anggota tim')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
          <h1 className="font-heading text-xl font-bold text-navy">Tim</h1>
          <p className="mt-1 text-[13px] text-gray-500">
            Nama, jabatan & foto anggota tim yang tampil di halaman Tentang Kami.
          </p>
        </div>
        <button type="button" onClick={openAdd} className="btn btn-primary shrink-0 self-start sm:self-auto">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Tambah Anggota
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
          Gagal memuat tim: {error}. Pastikan backend jalan di :3001.
        </p>
      )}

      <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
        {members.map((member) => (
          <div key={member.id} className="card p-5 text-center">
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="mx-auto mb-3 h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:h-7 [&_svg]:w-7">
                <AvatarPlaceholder />
              </div>
            )}
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
        {loading && members.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-gray-400">Memuat…</p>
        )}
        {!loading && members.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-gray-400">Belum ada anggota tim.</p>
        )}
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}>
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

          <div>
            <label className={labelClass}>Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoFile}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary-dark hover:file:cursor-pointer hover:file:bg-primary/20"
            />
            <p className="mt-1 text-xs text-gray-400">JPG/PNG — ditampilkan sebagai foto bulat di kartu tim.</p>
            {imgBusy && <p className="mt-1 text-xs text-primary">Memproses gambar…</p>}
            {imgError && <p className="mt-1 text-xs font-semibold text-coral">{imgError}</p>}
            {form.photo && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={form.photo}
                  alt="Pratinjau foto"
                  className="h-16 w-16 rounded-full border border-gray-100 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, photo: '' }))}
                  className="text-xs font-semibold text-coral hover:text-coral-dark"
                >
                  Hapus foto
                </button>
              </div>
            )}
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
              disabled={saving || imgBusy}
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
