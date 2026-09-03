'use client'

import { useState } from 'react'
import AdminModal from '@/components/admin/AdminModal'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import { formatRp } from '@/services/format'
import { uploadImage } from '@/services/imageFile'
import { usePrograms } from '@/services/programs'
import { PROGRAM_THEMES, themeKeyOf } from '@/app/donatur/program/programData'
import { useDonationMethods, DEFAULT_JENIS_DONASI } from '@/components/donation/donationMethodsData'
import DonationMethodsManager from '@/components/donation/DonationMethodsManager'

//ini halaman admin CRUD "Daftar Program" — tersimpan di tabel `programs` di
// backend. Jenis donasi & rekening dikelola di panel bawah halaman ini.
const EMPTY_FORM = {
  id: null,
  slug: '',
  title: '',
  icon: '💛', // dipakai sebagai cadangan kalau belum ada gambar
  image: '',
  jenisId: DEFAULT_JENIS_DONASI[0].key,
  theme: 'green',
  desc: '',
  harapan: '',
  deskripsiLengkap: '',
  manfaat: '',
  target: '',
  collected: '',
  donors: '',
}

export default function AdminProgramPage() {
  // Pilihan "Jenis Donasi" di form program diambil dari metode donasi
  // scope 'program' (dikelola di panel bawah halaman ini) — terpisah dari
  // metode donasi "Donasi via Transfer" di halaman Tentang Kami.
  const { jenisList } = useDonationMethods('program')
  const { programs, loading, error, saveProgram, removeProgram, setProgramActive } = usePrograms()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imgBusy, setImgBusy] = useState(false)
  const [imgError, setImgError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

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

  const openEdit = (program) => {
    setEditing(program)
    setImgError('')
    setSaveError('')
    setForm({
      id: program.id,
      slug: program.slug,
      title: program.title,
      icon: program.icon || '💛',
      image: program.image || '',
      jenisId: program.jenisId,
      theme: themeKeyOf(program),
      desc: program.desc,
      harapan: program.harapan,
      deskripsiLengkap: (program.deskripsiLengkap || []).join('\n\n'),
      manfaat: (program.manfaat || []).join('\n'),
      target: program.target,
      collected: program.collected,
      donors: program.donors,
    })
    setModalOpen(true)
  }

  const handleDelete = async (program) => {
    if (!window.confirm(`Hapus program "${program.title}"?`)) return
    try {
      await removeProgram(program)
    } catch (err) {
      window.alert(err.message || 'Gagal menghapus program')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || saving) return
    setSaving(true)
    setSaveError('')
    try {
      // Badge kartu = label jenis donasi yang dipilih (tidak ada field terpisah).
      const jenis = jenisList.find((j) => (j.key || String(j.id)) === form.jenisId)
      await saveProgram({
        id: editing?.id ?? null,
        slug: editing?.slug || undefined,
        title: form.title,
        badge: jenis?.label || '',
        icon: form.icon || '💛',
        image: form.image || '',
        jenisId: form.jenisId,
        theme: form.theme,
        desc: form.desc,
        harapan: form.harapan,
        deskripsiLengkap: form.deskripsiLengkap, // string — dipecah per paragraf di backend
        manfaat: form.manfaat, // string — dipecah per baris di backend
        target: Number(form.target) || 0,
        collected: Number(form.collected) || 0,
        donors: Number(form.donors) || 0,
      })
      setModalOpen(false)
    } catch (err) {
      setSaveError(err.message || 'Gagal menyimpan program')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
          <h1 className="font-heading text-xl font-bold text-navy">Daftar Program</h1>
          <p className="mt-1 text-[13px] text-gray-500">
            Program yang tampil di halaman Daftar Program situs donatur. Tombol <b>Tutup</b> menyembunyikan
            program dari halaman donatur — tetap terlihat di sini.
          </p>
        </div>
        <button type="button" onClick={openAdd} className="btn btn-primary shrink-0 self-start sm:self-auto">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Tambah Program
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
          Gagal memuat program: {error}. Pastikan backend jalan di :3001.
        </p>
      )}

      <div className="grid grid-cols-2 gap-6 max-[768px]:grid-cols-1">
        {programs.map((p) => {
          const percent = p.target > 0 ? Math.round((p.collected / p.target) * 100) : 0
          const reached = p.target > 0 && p.collected >= p.target
          const lebih = Math.max(0, p.collected - p.target)
          const closed = p.active === false
          return (
            <div key={p.id} className={`card ${closed ? 'opacity-60' : ''}`}>
              <div className={`relative flex h-28 items-center justify-center overflow-hidden ${p.blockBg}`}>
                {p.image ? (
                  <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl">{p.icon}</span>
                )}
                <span className={`absolute left-4 top-4 z-[1] rounded-full px-3 py-1 text-xs font-semibold ${p.badgeBg} ${p.badgeText}`}>
                  {p.badge}
                </span>
                {closed && (
                  <span className="absolute right-4 top-4 z-[1] rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold text-white">
                    Ditutup
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="mb-1 font-heading text-base font-bold text-navy">{p.title}</h3>
                <p className="mb-3 text-xs leading-relaxed text-gray-500">{p.desc}</p>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {formatRp(p.collected)} / {formatRp(p.target)}
                  </span>
                  <strong className={p.percentText}>{percent}%</strong>
                </div>
                <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${p.barColor}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
                {reached && (
                  <p className="mb-3 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                    Target tercapai{lebih > 0 ? ` · lebih ${formatRp(lebih)}` : ''}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-gray-400">{p.donors} donatur</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setProgramActive(p, closed)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        closed
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-navy/10 text-navy hover:bg-navy/20'
                      }`}
                    >
                      {closed ? 'Buka' : 'Tutup'}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-dark transition-colors hover:bg-primary/20"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="rounded-lg bg-coral/10 px-3 py-1.5 text-xs font-semibold text-coral transition-colors hover:bg-coral/20"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {loading && programs.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-gray-400">Memuat…</p>
        )}
        {!loading && programs.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-gray-400">Belum ada program.</p>
        )}
      </div>

      {/* Metode donasi khusus program (jenis donasi & rekening) — terpisah
          dari yang di halaman Tentang Kami, jadi rekeningnya bisa dibedakan. */}
      <div className="mt-10">
        <DonationMethodsManager
          scope="program"
          title="Metode Donasi Program"
          description='Jenis donasi & rekening bank yang dipakai saat pengunjung klik "Donasi" pada kartu program.'
        />
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Program' : 'Tambah Program'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Judul Program</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Jenis Donasi</label>
              <select
                value={form.jenisId}
                onChange={(e) => setForm((f) => ({ ...f, jenisId: e.target.value }))}
                className={inputClass}
              >
                {jenisList.map((j) => (
                  <option key={j.id} value={j.key || j.id}>
                    {j.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Dipakai sebagai badge di kartu program & jenis di form Donasi via Transfer.
              </p>
            </div>
            <div>
              <label className={labelClass}>Warna Kartu</label>
              <select
                value={form.theme}
                onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))}
                className={inputClass}
              >
                {Object.entries(PROGRAM_THEMES).map(([key, t]) => (
                  <option key={key} value={key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Gambar Program</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFile}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary-dark hover:file:cursor-pointer hover:file:bg-primary/20"
            />
            <p className="mt-1 text-xs text-gray-400">
              Pilih file gambar dari perangkat (JPG/PNG). Tampil sebagai gambar utama kartu program.
            </p>
            {imgBusy && <p className="mt-1 text-xs text-primary">Memproses gambar…</p>}
            {imgError && <p className="mt-1 text-xs font-semibold text-coral">{imgError}</p>}
            {form.image && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={form.image}
                  alt="Pratinjau gambar program"
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Target (Rp)</label>
              <input
                type="number"
                min="0"
                value={form.target}
                onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Terkumpul (Rp)</label>
              <input
                type="number"
                min="0"
                value={form.collected}
                onChange={(e) => setForm((f) => ({ ...f, collected: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Jumlah Donatur</label>
              <input
                type="number"
                min="0"
                value={form.donors}
                onChange={(e) => setForm((f) => ({ ...f, donors: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Ringkasan (untuk kartu)</label>
            <textarea
              rows={2}
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Menjadi Harapan Bersama</label>
            <textarea
              rows={2}
              value={form.harapan}
              onChange={(e) => setForm((f) => ({ ...f, harapan: e.target.value }))}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Deskripsi Program (pisahkan tiap paragraf dengan baris kosong)</label>
            <textarea
              rows={4}
              value={form.deskripsiLengkap}
              onChange={(e) => setForm((f) => ({ ...f, deskripsiLengkap: e.target.value }))}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Manfaat untuk Masyarakat (satu poin per baris)</label>
            <textarea
              rows={4}
              value={form.manfaat}
              onChange={(e) => setForm((f) => ({ ...f, manfaat: e.target.value }))}
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
