'use client'

import { useEffect, useMemo, useState } from 'react'
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

const IconText = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M4 7V5h16v2M9 20h6M12 5v15" />
  </svg>
)
const IconChart = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M3 3v18h18M8 17V9M13 17V5M18 17v-6" />
  </svg>
)

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

  const liveNumber = (metric) => {
    const getter = METRIC_FROM_LIVE[metric]
    const v = getter ? getter(liveStats) : null
    return v == null ? null : Number(v)
  }
  const livePreview = (metric) => {
    const n = liveNumber(metric)
    return n == null ? '—' : n.toLocaleString('id-ID')
  }

  // Angka final tiap stat (manual = yang diketik, auto = angka live), untuk
  // pratinjau tampilan publik di atas form.
  const previewStats = useMemo(
    () =>
      form.stats
        .filter((s) => s.label.trim())
        .map((s) => {
          const n = s.source === 'auto' ? liveNumber(s.metric) : Number(s.value)
          return { label: s.label.trim(), text: (n || 0).toLocaleString('id-ID') }
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.stats, liveStats],
  )

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
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
          <h1 className="font-heading text-xl font-bold text-navy">Informasi Donatur</h1>
          <p className="mt-1 text-[13px] text-gray-500">
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

      {/* Pratinjau tampilan publik */}
      <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-dark p-5 text-white shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white/70">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />
          </svg>
          Pratinjau di halaman publik
        </span>
        <h3 className="mt-3 font-heading text-base font-bold">{form.title || 'Judul informasi'}</h3>
        <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-white/65">
          {form.description || 'Teks pengantar akan tampil di sini.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          {previewStats.length === 0 ? (
            <span className="text-[13px] text-white/40">Belum ada ringkasan angka.</span>
          ) : (
            previewStats.map((s, i) => (
              <div key={i}>
                <span className="block font-heading text-xl font-extrabold text-gold">{s.text}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60">
                  {s.label}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <form id="donor-info-form" onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Bagian 1: Informasi utama */}
        <section className="border-b border-gray-100 p-5 sm:p-6">
          <div className="mb-3 flex items-start gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {IconText}
            </span>
            <div>
              <h2 className="font-heading text-sm font-bold text-navy">Informasi utama</h2>
              <p className="text-[12px] text-gray-400">Judul &amp; teks pengantar pada bagian Donatur.</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
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
        </section>

        {/* Bagian 2: Ringkasan jumlah donatur */}
        <section className="p-5 sm:p-6">
          <div className="mb-4 flex items-start gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {IconChart}
            </span>
            <div>
              <h2 className="font-heading text-sm font-bold text-navy">Ringkasan jumlah donatur</h2>
              <p className="text-[12px] text-gray-400">
                <b>Manual</b> = ketik angka sendiri. <b>Dari Riwayat Donasi</b> = ikut otomatis dari
                transaksi yang sudah diterima.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {form.stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
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
                      className={`rounded-md px-2 py-1.5 text-[11px] font-semibold leading-tight transition-colors ${
                        stat.source === opt.key
                          ? 'bg-primary text-white shadow-sm'
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
                    <p className="mt-1.5 flex items-center gap-1.5 rounded-md bg-primary/5 px-2 py-1.5 text-[11px] text-primary-dark">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                        <path d="M21 12a9 9 0 11-6.2-8.5" /><path d="M21 3v6h-6" />
                      </svg>
                      Nilai sekarang: <b>{livePreview(stat.metric)}</b>
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
            ))}

            {/* Kartu "Tambah" */}
            <button
              type="button"
              onClick={addStat}
              className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 p-3.5 text-xs font-bold text-primary-dark transition-colors hover:border-primary/60 hover:bg-primary/5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
              </span>
              Tambah Informasi
            </button>
          </div>

          {savedMessage && (
            <p role="status" className="mt-4 flex items-center gap-1.5 rounded-lg bg-primary/[0.07] px-3 py-2 text-[13px] font-medium text-primary-dark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {savedMessage}
            </p>
          )}
        </section>
      </form>
    </div>
  )
}
