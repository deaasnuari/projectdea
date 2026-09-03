'use client'

import { useState } from 'react'
import { useContactMessages } from '@/services/contactMessages'

const TABS = [
  { key: 'semua', label: 'Semua' },
  { key: 'baru', label: 'Baru' },
  { key: 'dibaca', label: 'Dibaca' },
  { key: 'selesai', label: 'Selesai' },
]

const STATUS_STYLE = {
  baru: 'bg-amber-100 text-amber-700',
  dibaca: 'bg-primary/10 text-primary-dark',
  selesai: 'bg-green-100 text-green-700',
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function AdminPesanMasukPage() {
  const [tab, setTab] = useState('semua')
  const { messages, stats, loading, error, changeStatus, removeMessage } = useContactMessages(tab)

  const handleDelete = async (m) => {
    if (!window.confirm(`Hapus pesan dari "${m.name}"?`)) return
    try {
      await removeMessage(m.id)
    } catch (err) {
      window.alert(err.message || 'Gagal menghapus pesan')
    }
  }

  const CARDS = [
    { label: 'Total Pesan', value: stats?.total ?? 0 },
    { label: 'Baru', value: stats?.baru ?? 0, accent: 'text-amber-600' },
    { label: 'Dibaca', value: stats?.dibaca ?? 0, accent: 'text-primary-dark' },
    { label: 'Selesai', value: stats?.selesai ?? 0, accent: 'text-green-600' },
  ]

  const actions = (m) => (
    <div className="flex flex-wrap items-center gap-1.5">
      {m.status !== 'dibaca' && (
        <button
          type="button"
          onClick={() => changeStatus(m.id, 'dibaca')}
          className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-200"
        >
          Tandai Dibaca
        </button>
      )}
      {m.status !== 'selesai' && (
        <button
          type="button"
          onClick={() => changeStatus(m.id, 'selesai')}
          className="rounded-lg bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700 transition-colors hover:bg-green-200"
        >
          Selesai
        </button>
      )}
      <button
        type="button"
        onClick={() => handleDelete(m)}
        className="rounded-lg bg-coral/10 px-2.5 py-1 text-[11px] font-semibold text-coral transition-colors hover:bg-coral/20"
      >
        Hapus
      </button>
    </div>
  )

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
        <h1 className="font-heading text-xl font-bold text-navy">Pesan Masuk</h1>
        <p className="mt-1 text-[13px] text-gray-500">
          Pesan dari formulir "Kirim Pesan" di halaman Kontak Kami. 
        </p>
      </div>

      <div className="mb-5 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
        {CARDS.map((c) => (
          <div key={c.label} className="card p-3.5">
            <p className={`font-heading text-lg font-extrabold leading-tight ${c.accent || 'text-navy'}`}>{c.value}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              tab === t.key ? 'bg-navy text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
          Gagal memuat pesan: {error}. Pastikan backend jalan di :3001.
        </p>
      )}

      {/* Tabel — laptop & iPad landscape */}
      <div className="card hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-semibold uppercase tracking-[0.04em] text-gray-400">
                <th className="px-4 py-2.5 font-semibold">Pengirim</th>
                <th className="px-4 py-2.5 font-semibold">Pesan</th>
                <th className="px-4 py-2.5 font-semibold">Tanggal</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {messages.map((m) => (
                <tr key={m.id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-navy">{m.name}</div>
                    <a href={`mailto:${m.email}`} className="text-[11px] text-primary hover:text-primary-dark">
                      {m.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <p className="max-w-[420px] whitespace-pre-wrap">{m.message}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{fmtDate(m.created_at)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[m.status]}`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">{actions(m)}</div>
                  </td>
                </tr>
              ))}
              {!loading && messages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">
                    Belum ada pesan{tab !== 'semua' ? ` berstatus "${tab}"` : ''}.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">
                    Memuat…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kartu — HP & iPad portrait */}
      <div className="flex flex-col gap-3 md:hidden">
        {loading && <div className="card p-6 text-center text-sm text-gray-400">Memuat…</div>}
        {!loading && messages.length === 0 && (
          <div className="card p-8 text-center text-sm text-gray-400">
            Belum ada pesan{tab !== 'semua' ? ` berstatus "${tab}"` : ''}.
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-navy">{m.name}</p>
                <a href={`mailto:${m.email}`} className="text-[11px] text-primary">
                  {m.email}
                </a>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[m.status]}`}
              >
                {m.status}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-[13px] text-gray-600">{m.message}</p>
            <p className="mt-2 text-[11px] text-gray-400">{fmtDate(m.created_at)}</p>
            <div className="mt-3 border-t border-gray-100 pt-3">{actions(m)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
