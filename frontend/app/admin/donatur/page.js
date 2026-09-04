'use client'

import { useEffect, useState } from 'react'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import { DEFAULT_DONOR_CONTENT, useDonorContent, DONOR_STAT_METRICS } from '@/app/donatur/sections/donorData'
import { fetchStats } from '@/services/donations'
import { toast } from '@/components/ui/feedback'

// Angka live dari Riwayat Donasi untuk tiap metric (dipakai sebagai pratinjau
// di form + info ke admin). Nama field mengikuti Donation.stats() di backend.
const METRIC_FROM_LIVE = {
  donatur: (s) => s?.donatur,
  dana: (s) => s?.total_terverifikasi,
  donasi_terverifikasi: (s) => s?.terverifikasi,
  total_donasi: (s) => s?.total,
  donasi_program: (s) => s?.dari_program,
  donasi_tentang: (s) => s?.dari_tentang,
}

function toForm(content) {
  return {
    title: content.title,
    description: content.description,
    stats: content.stats.map((stat) => ({
      value: String(stat.value ?? ''),
      label: stat.label,
      source: stat.source === 'auto' ? 'auto' : 'manual',
      metric: stat.metric || 'donatur',
    })),
  }
}

export default function AdminDonaturPage() {
  const { content, save } = useDonorContent()
  const [form, setForm] = useState(() => toForm(DEFAULT_DONOR_CONTENT))
  const [savedMessage, setSavedMessage] = useState('')
  const [liveStats, setLiveStats] = useState(null)

  useEffect(() => {
    setForm(toForm(content))
  }, [content])

  useEffect(() => {
    fetchStats()
      .then(setLiveStats)
      .catch(() => setLiveStats(null))
  }, [])

  const livePreview = (metric) => {
    const getter = METRIC_FROM_LIVE[metric]
    const v = getter ? getter(liveStats) : null
    return v == null ? '—' : Number(v).toLocaleString('id-ID')
  }

  const updateStat = (index, field, value) => {
    setForm((current) => ({
      ...current,
      stats: current.stats.map((stat, statIndex) => (
        statIndex === index ? { ...stat, [field]: value } : stat
      )),
    }))
    setSavedMessage('')
  }

  const addStat = () => {
    setForm((current) => ({
      ...current,
      stats: [...current.stats, { value: '', label: '', source: 'manual', metric: 'donatur' }],
    }))
    setSavedMessage('')
  }

  const removeStat = (index) => {
    setForm((current) => ({
      ...current,
      stats: current.stats.filter((_, statIndex) => statIndex !== index),
    }))
    setSavedMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // Baris yang benar-benar kosong (tanpa label) diabaikan saat menyimpan.
    const stats = form.stats
      .map((stat) => ({
        label: stat.label.trim(),
        source: stat.source === 'auto' ? 'auto' : 'manual',
        metric: stat.metric || 'donatur',
        value: Number(stat.value) || 0,
      }))
      .filter((stat) => stat.label)

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      stats,
    }

    if (!payload.title || !payload.description || stats.length === 0) {
      toast('Judul, isi informasi, dan minimal satu ringkasan wajib diisi.', { tone: 'error' })
      return
    }

    save(payload)
    setSavedMessage('Perubahan berhasil disimpan dan langsung ditampilkan di halaman Donatur.')
    toast('Informasi donatur disimpan.', { tone: 'success' })
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
          <h1 className="font-heading text-xl font-bold text-navy">Informasi Donatur</h1>
          <p className="mt-1 max-w-2xl text-[13px] text-gray-500">
            Perbarui judul, pengantar, dan ringkasan angka yang tampil di halaman publik. Tiap angka bisa
            diisi <b>manual</b> atau <b>otomatis</b> mengikuti data Riwayat Donasi.
          </p>
        </div>
        <button type="submit" form="donor-info-form" className="btn btn-primary shrink-0 self-start sm:self-auto">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
            <path d="M3 3h11l3 3v11H3V3zm2 2v4h8V5H5zm0 8v2h10v-2H5z" />
          </svg>
          Simpan / Perbarui
        </button>
      </div>

      <form id="donor-info-form" onSubmit={handleSubmit} className="card max-w-4xl p-4 sm:p-6">
        <div className="mb-5 border-b border-gray-100 pb-5">
          <h2 className="font-heading text-sm font-bold text-navy">Informasi utama</h2>
          <p className="mt-0.5 text-[13px] text-gray-500">Teks ini menjadi pengantar singkat pada bagian Donatur.</p>
          <div className="mt-3 flex flex-col gap-3">
            <div>
              <label htmlFor="donor-title" className={labelClass}>Nama / Judul Informasi</label>
              <input
                id="donor-title"
                type="text"
                required
                value={form.title}
                onChange={(event) => {
                  setForm((current) => ({ ...current, title: event.target.value }))
                  setSavedMessage('')
                }}
                className={inputClass}
                placeholder="Contoh: Jumlah Donatur Saat Ini"
              />
            </div>
            <div>
              <label htmlFor="donor-description" className={labelClass}>Isi Informasi</label>
              <textarea
                id="donor-description"
                required
                rows={3}
                value={form.description}
                onChange={(event) => {
                  setForm((current) => ({ ...current, description: event.target.value }))
                  setSavedMessage('')
                }}
                className={`${inputClass} resize-y`}
                placeholder="Tulis informasi singkat untuk donatur..."
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-sm font-bold text-navy">Ringkasan jumlah donatur</h2>
          <p className="mt-0.5 text-[13px] text-gray-500">
            Pilih <b>Manual</b> untuk mengetik angka sendiri, atau <b>Dari Riwayat Donasi</b> agar angka
            ikut otomatis dari transaksi yang sudah diterima.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {form.stats.map((stat, index) => (
              <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-3.5">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-primary">Informasi {index + 1}</p>
                  {form.stats.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-coral transition-colors hover:bg-coral/10"
                    >
                      Hapus
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {/* Pemilih sumber angka */}
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-white p-1 ring-1 ring-gray-200">
                    {[
                      { key: 'manual', label: 'Manual' },
                      { key: 'auto', label: 'Dari Riwayat Donasi' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => updateStat(index, 'source', opt.key)}
                        className={`rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                          stat.source === opt.key
                            ? 'bg-primary text-white'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {stat.source === 'auto' ? (
                    <div>
                      <label htmlFor={`donor-metric-${index}`} className={labelClass}>Ambil angka dari</label>
                      <select
                        id={`donor-metric-${index}`}
                        value={stat.metric}
                        onChange={(event) => updateStat(index, 'metric', event.target.value)}
                        className={inputClass}
                      >
                        {DONOR_STAT_METRICS.map((m) => (
                          <option key={m.key} value={m.key}>{m.label}</option>
                        ))}
                      </select>
                      <p className="mt-1 rounded-md bg-primary/5 px-2 py-1 text-[11px] text-primary-dark">
                        Nilai sekarang: <b>{livePreview(stat.metric)}</b> · otomatis diperbarui.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor={`donor-value-${index}`} className={labelClass}>Jumlah</label>
                      <input
                        id={`donor-value-${index}`}
                        type="number"
                        min="0"
                        required
                        value={stat.value}
                        onChange={(event) => updateStat(index, 'value', event.target.value)}
                        className={inputClass}
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor={`donor-label-${index}`} className={labelClass}>Nama / Label</label>
                    <input
                      id={`donor-label-${index}`}
                      type="text"
                      required
                      value={stat.label}
                      onChange={(event) => updateStat(index, 'label', event.target.value)}
                      className={inputClass}
                      placeholder="Contoh: Donatur Zakat"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addStat}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-primary/40 px-3 py-2 text-xs font-bold text-primary-dark transition-colors hover:bg-primary/5"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            Tambah Informasi
          </button>
        </div>

        {savedMessage && (
          <p role="status" className="mt-5 border-t border-gray-100 pt-4 text-[13px] text-primary">
            {savedMessage}
          </p>
        )}
      </form>
    </div>
  )
}
