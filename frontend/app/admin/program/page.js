'use client'

import { useState } from 'react'
import AdminModal from '@/components/admin/AdminModal'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import { formatJt } from '@/services/format'
import { PROGRAMS } from '@/app/donatur/program/programData'

// Preset warna kartu program — dipilih dari dropdown di form, bukan warna
// bebas, supaya tetap konsisten dengan palet kartu program yang sudah ada
// di situs donatur (lihat programData.js).
const COLOR_THEMES = {
  green: {
    label: 'Hijau',
    blockBg: 'bg-green-50', badgeBg: 'bg-green-100', badgeText: 'text-green-700',
    barColor: 'bg-green-700', percentText: 'text-green-700',
    buttonBg: 'bg-green-100', buttonText: 'text-green-700', buttonHover: 'hover:bg-green-200',
  },
  amber: {
    label: 'Kuning',
    blockBg: 'bg-amber-50', badgeBg: 'bg-amber-100', badgeText: 'text-amber-700',
    barColor: 'bg-amber-600', percentText: 'text-amber-700',
    buttonBg: 'bg-amber-100', buttonText: 'text-amber-700', buttonHover: 'hover:bg-amber-200',
  },
  indigo: {
    label: 'Ungu',
    blockBg: 'bg-indigo-50', badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-700',
    barColor: 'bg-indigo-700', percentText: 'text-indigo-700',
    buttonBg: 'bg-indigo-100', buttonText: 'text-indigo-700', buttonHover: 'hover:bg-indigo-200',
  },
  emerald: {
    label: 'Hijau Toska',
    blockBg: 'bg-emerald-50', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700',
    barColor: 'bg-emerald-700', percentText: 'text-emerald-700',
    buttonBg: 'bg-emerald-100', buttonText: 'text-emerald-700', buttonHover: 'hover:bg-emerald-200',
  },
}

const JENIS_OPTIONS = [
  { id: 'zakat-profesi', label: 'Zakat Profesi' },
  { id: 'zakat-maal', label: 'Zakat Maal' },
  { id: 'infaq', label: 'Infaq' },
  { id: 'shadaqah', label: 'Shadaqah' },
  { id: 'fidyah', label: 'Fidyah' },
  { id: 'wakaf', label: 'Wakaf' },
]

const EMPTY_FORM = {
  title: '',
  badge: '',
  icon: '💛',
  jenisId: JENIS_OPTIONS[0].id,
  theme: 'green',
  desc: '',
  harapan: '',
  deskripsiLengkap: '',
  manfaat: '',
  target: '',
  collected: '',
  donors: '',
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

// Catatan: data awal diambil dari programData.js, tapi perubahan di sini
// cuma disimpan di state komponen (belum ada backend) — jadi kembali ke
// data awal begitu halaman di-refresh.
export default function AdminProgramPage() {
  const [programs, setPrograms] = useState(PROGRAMS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (program) => {
    const theme = Object.keys(COLOR_THEMES).find((key) => COLOR_THEMES[key].badgeBg === program.badgeBg) || 'green'
    setEditingId(program.id)
    setForm({
      title: program.title,
      badge: program.badge,
      icon: program.icon,
      jenisId: program.jenisId,
      theme,
      desc: program.desc,
      harapan: program.harapan,
      deskripsiLengkap: program.deskripsiLengkap.join('\n\n'),
      manfaat: program.manfaat.join('\n'),
      target: program.target,
      collected: program.collected,
      donors: program.donors,
    })
    setModalOpen(true)
  }

  const handleDelete = (program) => {
    if (!window.confirm(`Hapus program "${program.title}"?`)) return
    setPrograms((prev) => prev.filter((p) => p.id !== program.id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    const themeColors = COLOR_THEMES[form.theme] || COLOR_THEMES.green
    const payload = {
      title: form.title,
      badge: form.badge,
      icon: form.icon || '💛',
      jenisId: form.jenisId,
      desc: form.desc,
      harapan: form.harapan,
      deskripsiLengkap: form.deskripsiLengkap
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      manfaat: form.manfaat
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean),
      target: Number(form.target) || 0,
      collected: Number(form.collected) || 0,
      donors: Number(form.donors) || 0,
      blockBg: themeColors.blockBg,
      badgeBg: themeColors.badgeBg,
      badgeText: themeColors.badgeText,
      barColor: themeColors.barColor,
      percentText: themeColors.percentText,
      buttonBg: themeColors.buttonBg,
      buttonText: themeColors.buttonText,
      buttonHover: themeColors.buttonHover,
    }

    if (editingId) {
      setPrograms((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p)))
    } else {
      const id = slugify(form.title) || `program-${Date.now()}`
      setPrograms((prev) => [{ id, ...payload }, ...prev])
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
          <h1 className="font-heading text-2xl font-bold text-navy">Program Donasi</h1>
          <p className="mt-1 text-sm text-gray-500">Program yang tampil di halaman Daftar Program situs donatur.</p>
        </div>
        <button type="button" onClick={openAdd} className="btn btn-primary shrink-0">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Tambah Program
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 max-[768px]:grid-cols-1">
        {programs.map((p) => {
          const percent = p.target > 0 ? Math.round((p.collected / p.target) * 100) : 0
          return (
            <div key={p.id} className="card">
              <div className={`relative flex h-28 items-center justify-center ${p.blockBg}`}>
                <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${p.badgeBg} ${p.badgeText}`}>
                  {p.badge}
                </span>
                <span className="text-4xl">{p.icon}</span>
              </div>
              <div className="p-5">
                <h3 className="mb-1 font-heading text-base font-bold text-navy">{p.title}</h3>
                <p className="mb-3 text-xs leading-relaxed text-gray-500">{p.desc}</p>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {formatJt(p.collected)} / {formatJt(p.target)}
                  </span>
                  <strong className={p.percentText}>{percent}%</strong>
                </div>
                <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${p.barColor}`} style={{ width: `${percent}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{p.donors} donatur</span>
                  <div className="flex items-center gap-2">
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
        {programs.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-gray-400">Belum ada program.</p>
        )}
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Program' : 'Tambah Program'}>
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Badge</label>
              <input
                type="text"
                placeholder="Contoh: Infaq"
                value={form.badge}
                onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Ikon (emoji)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Warna Kartu</label>
              <select
                value={form.theme}
                onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))}
                className={inputClass}
              >
                {Object.entries(COLOR_THEMES).map(([key, t]) => (
                  <option key={key} value={key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Jenis Donasi (untuk form Donasi via Transfer)</label>
            <select
              value={form.jenisId}
              onChange={(e) => setForm((f) => ({ ...f, jenisId: e.target.value }))}
              className={inputClass}
            >
              {JENIS_OPTIONS.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
