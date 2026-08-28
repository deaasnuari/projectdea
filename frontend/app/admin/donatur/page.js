'use client'

import { useEffect, useState } from 'react'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import {
  DEFAULT_DONOR_CONTENT,
  getDonorContent,
  saveDonorContent,
} from '@/app/donatur/sections/donorData'

function toForm(content) {
  return {
    title: content.title,
    description: content.description,
    stats: content.stats.map((stat) => ({
      value: String(stat.value),
      label: stat.label,
    })),
  }
}

export default function AdminDonaturPage() {
  const [form, setForm] = useState(() => toForm(DEFAULT_DONOR_CONTENT))
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    setForm(toForm(getDonorContent()))
  }, [])

  const updateStat = (index, field, value) => {
    setForm((current) => ({
      ...current,
      stats: current.stats.map((stat, statIndex) => (
        statIndex === index ? { ...stat, [field]: value } : stat
      )),
    }))
    setSavedMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const content = {
      title: form.title.trim(),
      description: form.description.trim(),
      stats: form.stats.map((stat) => ({
        value: Number(stat.value) || 0,
        label: stat.label.trim(),
      })),
    }

    if (!content.title || !content.description || content.stats.some((stat) => !stat.label)) return

    saveDonorContent(content)
    setSavedMessage('Perubahan berhasil disimpan dan langsung ditampilkan di halaman Donatur.')
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
        <h1 className="font-heading text-2xl font-bold text-navy">Informasi Donatur</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Perbarui judul, pengantar, dan informasi jumlah donatur yang tampil di halaman publik.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-4xl p-6 sm:p-8">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h2 className="font-heading text-base font-bold text-navy">Informasi utama</h2>
          <p className="mt-1 text-sm text-gray-500">Teks ini menjadi pengantar singkat pada bagian Donatur.</p>
          <div className="mt-5 flex flex-col gap-4">
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
                rows={4}
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
          <h2 className="font-heading text-base font-bold text-navy">Ringkasan jumlah donatur</h2>
          <p className="mt-1 text-sm text-gray-500">Isi angka dan label yang ingin ditampilkan pada tiga ringkasan.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {form.stats.map((stat, index) => (
              <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-primary">Informasi {index + 1}</p>
                <div className="flex flex-col gap-4">
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
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
          <p role="status" className="text-sm text-primary">{savedMessage}</p>
          <button type="submit" className="btn btn-primary ml-auto">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
              <path d="M3 3h11l3 3v11H3V3zm2 2v4h8V5H5zm0 8v2h10v-2H5z" />
            </svg>
            Simpan / Perbarui
          </button>
        </div>
      </form>
    </div>
  )
}
