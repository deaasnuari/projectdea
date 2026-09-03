'use client'

import { useState } from 'react'
import AdminModal from '@/components/admin/AdminModal'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import { useDonationMethods } from './donationMethodsData'

const BADGE_COLORS = [
  { value: 'bg-[#00754A]', label: 'Hijau' },
  { value: 'bg-[#003D79]', label: 'Biru Tua' },
  { value: 'bg-[#00529C]', label: 'Biru' },
  { value: 'bg-navy', label: 'Navy' },
  { value: 'bg-primary', label: 'Teal' },
  { value: 'bg-coral', label: 'Coral' },
]

const EMPTY_JENIS = { label: '', programLabel: '' }
const EMPTY_BANK = { name: '', short: '', noRek: '', owner: '', badgeClass: BADGE_COLORS[0].value }

const IconPlus = (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
  </svg>
)

// CRUD jenis donasi & rekening bank untuk satu `scope` ('tentang' | 'program').
// Ditaruh langsung di halaman admin masing-masing (bukan menu sidebar sendiri).
export default function DonationMethodsManager({
  scope = 'tentang',
  title = 'Metode Donasi',
  description = 'Jenis donasi & rekening bank yang tampil di modal "Donasi via Transfer".',
}) {
  const { jenisList, banks, saveJenis, removeJenis, saveBank, removeBank } = useDonationMethods(scope)

  const [jenisModal, setJenisModal] = useState(false)
  const [jenisEditId, setJenisEditId] = useState(null)
  const [jenisForm, setJenisForm] = useState(EMPTY_JENIS)

  const [bankModal, setBankModal] = useState(false)
  const [bankEditId, setBankEditId] = useState(null)
  const [bankForm, setBankForm] = useState(EMPTY_BANK)

  const openAddJenis = () => {
    setJenisEditId(null)
    setJenisForm(EMPTY_JENIS)
    setJenisModal(true)
  }
  const openEditJenis = (j) => {
    setJenisEditId(j.id)
    setJenisForm({ label: j.label || '', programLabel: j.programLabel || '' })
    setJenisModal(true)
  }
  const submitJenis = async (e) => {
    e.preventDefault()
    const label = jenisForm.label.trim()
    if (!label) return
    try {
      await saveJenis({
        id: jenisEditId || undefined,
        label,
        programLabel: jenisForm.programLabel.trim() || label,
      })
      setJenisModal(false)
    } catch (err) {
      window.alert(err.message || 'Gagal menyimpan jenis donasi')
    }
  }
  const deleteJenis = async (j) => {
    if (!window.confirm(`Hapus jenis donasi "${j.label}"?`)) return
    try {
      await removeJenis(j.id)
    } catch (err) {
      window.alert(err.message || 'Gagal menghapus jenis donasi')
    }
  }

  const openAddBank = () => {
    setBankEditId(null)
    setBankForm(EMPTY_BANK)
    setBankModal(true)
  }
  const openEditBank = (b) => {
    setBankEditId(b.id)
    setBankForm({
      name: b.name || '',
      short: b.short || '',
      noRek: b.noRek || '',
      owner: b.owner || '',
      badgeClass: b.badgeClass || BADGE_COLORS[0].value,
    })
    setBankModal(true)
  }
  const submitBank = async (e) => {
    e.preventDefault()
    const name = bankForm.name.trim()
    const noRek = bankForm.noRek.trim()
    if (!name || !noRek) return
    try {
      await saveBank({
        id: bankEditId || undefined,
        name,
        noRek,
        owner: bankForm.owner.trim(),
        short: (bankForm.short.trim() || name.slice(0, 3)).toUpperCase(),
        badgeClass: bankForm.badgeClass,
      })
      setBankModal(false)
    } catch (err) {
      window.alert(err.message || 'Gagal menyimpan rekening')
    }
  }
  const deleteBank = async (b) => {
    if (!window.confirm(`Hapus rekening "${b.name}"?`)) return
    try {
      await removeBank(b.id)
    } catch (err) {
      window.alert(err.message || 'Gagal menghapus rekening')
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <h2 className="font-heading text-lg font-bold text-navy">{title}</h2>
      <p className="mt-0.5 text-sm text-gray-500">{description}</p>

      {/* Jenis Donasi */}
      <div className="mb-3 mt-5 flex items-center justify-between gap-4">
        <h3 className="font-heading text-sm font-bold uppercase tracking-[0.5px] text-primary">
          Jenis Donasi <span className="text-xs font-medium normal-case text-gray-400">({jenisList.length})</span>
        </h3>
        <button type="button" onClick={openAddJenis} className="btn btn-primary shrink-0 !px-4 !py-2 text-xs">
          {IconPlus}
          Tambah Jenis
        </button>
      </div>
      <div className="mb-8 grid grid-cols-3 gap-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {jenisList.map((j) => (
          <div key={j.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-sm font-bold text-navy">{j.label}</p>
            <p className="mb-2 text-xs text-gray-400">{j.programLabel || j.label}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openEditJenis(j)}
                className="flex-1 rounded-lg bg-primary/10 px-2 py-1.5 text-xs font-semibold text-primary-dark transition-colors hover:bg-primary/20"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteJenis(j)}
                className="flex-1 rounded-lg bg-coral/10 px-2 py-1.5 text-xs font-semibold text-coral transition-colors hover:bg-coral/20"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {jenisList.length === 0 && (
          <p className="col-span-full rounded-lg border border-dashed border-gray-300 py-8 text-center text-sm text-gray-400">
            Belum ada jenis donasi.
          </p>
        )}
      </div>

      {/* Rekening Bank */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="font-heading text-sm font-bold uppercase tracking-[0.5px] text-primary">
          Rekening Bank <span className="text-xs font-medium normal-case text-gray-400">({banks.length})</span>
        </h3>
        <button type="button" onClick={openAddBank} className="btn btn-primary shrink-0 !px-4 !py-2 text-xs">
          {IconPlus}
          Tambah Rekening
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 max-[768px]:grid-cols-1">
        {banks.map((b) => (
          <div key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <div className="mb-2 flex items-center gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold text-white ${b.badgeClass || 'bg-navy'}`}
              >
                {b.short || (b.name || '?').slice(0, 3).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-navy">{b.name}</p>
                <p className="font-heading text-sm font-bold tracking-wide text-navy-dark">{b.noRek}</p>
                {b.owner && <p className="truncate text-[11px] text-gray-400">a.n. {b.owner}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openEditBank(b)}
                className="flex-1 rounded-lg bg-primary/10 px-2 py-1.5 text-xs font-semibold text-primary-dark transition-colors hover:bg-primary/20"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteBank(b)}
                className="flex-1 rounded-lg bg-coral/10 px-2 py-1.5 text-xs font-semibold text-coral transition-colors hover:bg-coral/20"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {banks.length === 0 && (
          <p className="col-span-full rounded-lg border border-dashed border-gray-300 py-8 text-center text-sm text-gray-400">
            Belum ada rekening bank.
          </p>
        )}
      </div>

      {/* Modal jenis */}
      <AdminModal
        open={jenisModal}
        onClose={() => setJenisModal(false)}
        title={jenisEditId ? 'Edit Jenis Donasi' : 'Tambah Jenis Donasi'}
      >
        <form onSubmit={submitJenis} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Nama Jenis *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Zakat Profesi"
              value={jenisForm.label}
              onChange={(e) => setJenisForm((f) => ({ ...f, label: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Label Program (opsional)</label>
            <input
              type="text"
              placeholder="Dipakai di ringkasan konfirmasi — kosong = sama dengan nama jenis"
              value={jenisForm.programLabel}
              onChange={(e) => setJenisForm((f) => ({ ...f, programLabel: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setJenisModal(false)}
              className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex flex-[1.4] items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark"
            >
              {jenisEditId ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Modal bank */}
      <AdminModal
        open={bankModal}
        onClose={() => setBankModal(false)}
        title={bankEditId ? 'Edit Rekening Bank' : 'Tambah Rekening Bank'}
      >
        <form onSubmit={submitBank} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Nama Bank *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Bank Mandiri"
              value={bankForm.name}
              onChange={(e) => setBankForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kode (badge)</label>
              <input
                type="text"
                maxLength={4}
                placeholder="Contoh: MDR"
                value={bankForm.short}
                onChange={(e) => setBankForm((f) => ({ ...f, short: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Warna Badge</label>
              <select
                value={bankForm.badgeClass}
                onChange={(e) => setBankForm((f) => ({ ...f, badgeClass: e.target.value }))}
                className={inputClass}
              >
                {BADGE_COLORS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Nomor Rekening *</label>
            <input
              type="text"
              required
              placeholder="Contoh: 109 0001 23456"
              value={bankForm.noRek}
              onChange={(e) => setBankForm((f) => ({ ...f, noRek: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Nama Pemilik Rekening</label>
            <input
              type="text"
              placeholder="Contoh: LAZIS PT PLN Batam"
              value={bankForm.owner}
              onChange={(e) => setBankForm((f) => ({ ...f, owner: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setBankModal(false)}
              className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex flex-[1.4] items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark"
            >
              {bankEditId ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  )
}
