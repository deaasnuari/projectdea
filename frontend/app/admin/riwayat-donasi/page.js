'use client'

import { useEffect, useState } from 'react'
import { formatRp } from '@/services/format'
import { useDonations, proofUrl } from '@/services/donations'

const TABS = [
  { key: 'semua', label: 'Semua' },
  { key: 'menunggu', label: 'Menunggu' },
  { key: 'terverifikasi', label: 'Terverifikasi' },
  { key: 'ditolak', label: 'Ditolak' },
]

const SOURCE_TABS = [
  { key: 'semua', label: 'Semua Sumber' },
  { key: 'program', label: 'Dari Program' },
  { key: 'tentang', label: 'Dari Tentang Kami' },
]

const STATUS_STYLE = {
  menunggu: 'bg-amber-100 text-amber-700',
  terverifikasi: 'bg-green-100 text-green-700',
  ditolak: 'bg-coral/15 text-coral',
}

const SOURCE_META = {
  program: { label: 'Program', cls: 'bg-primary/10 text-primary-dark' },
  tentang: { label: 'Tentang Kami', cls: 'bg-navy/10 text-navy' },
  umum: { label: 'Umum', cls: 'bg-gray-100 text-gray-500' },
}

function fmtDate(iso) {
  try {
    const d = new Date(iso)
    return {
      date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }
  } catch {
    return { date: iso, time: '' }
  }
}

export default function AdminRiwayatDonasiPage() {
  const [tab, setTab] = useState('semua')
  const [sourceTab, setSourceTab] = useState('semua')
  const [proof, setProof] = useState(null) // { id, name } bukti yang sedang dilihat
  const { rows, stats, loading, error, changeStatus, removeDonation } = useDonations(tab, sourceTab)

  const handleDelete = async (d) => {
    const nama = d.anonymous ? 'Anonim' : d.donor_name
    if (!window.confirm(`Hapus donasi dari "${nama}" (${formatRp(Number(d.amount))})? Tindakan ini permanen.`)) return
    try {
      await removeDonation(d.id)
    } catch (err) {
      window.alert(err.message || 'Gagal menghapus donasi')
    }
  }

  useEffect(() => {
    if (!proof) return
    const onKey = (e) => e.key === 'Escape' && setProof(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [proof])

  const CARDS = [
    { label: 'Total Donasi', value: stats?.total ?? 0 },
    { label: 'Menunggu', value: stats?.menunggu ?? 0, accent: 'text-amber-600' },
    { label: 'Terverifikasi', value: stats?.terverifikasi ?? 0, accent: 'text-green-600' },
    { label: 'Dana Terkumpul', value: formatRp(Number(stats?.total_terverifikasi ?? 0)), accent: 'text-navy' },
  ]

  // Tombol aksi dipakai di tabel (laptop) & di kartu (HP/iPad).
  const renderActions = (d) => (
    <>
      {d.has_proof ? (
        <button
          type="button"
          onClick={() => setProof({ id: d.id, name: d.anonymous ? 'Anonim' : d.donor_name })}
          className="rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-50"
        >
          Bukti
        </button>
      ) : (
        <span className="px-1 text-[11px] text-gray-300">—</span>
      )}
      {d.status !== 'terverifikasi' && (
        <button
          type="button"
          onClick={() => changeStatus(d.id, 'terverifikasi')}
          className="rounded-lg bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700 transition-colors hover:bg-green-200"
        >
          Verifikasi
        </button>
      )}
      {d.status !== 'ditolak' && (
        <button
          type="button"
          onClick={() => changeStatus(d.id, 'ditolak')}
          className="rounded-lg bg-coral/10 px-2.5 py-1 text-[11px] font-semibold text-coral transition-colors hover:bg-coral/20"
        >
          Tolak
        </button>
      )}
      {d.status !== 'menunggu' && (
        <button
          type="button"
          onClick={() => changeStatus(d.id, 'menunggu')}
          className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500 transition-colors hover:bg-gray-200"
        >
          Batalkan
        </button>
      )}
      <button
        type="button"
        onClick={() => handleDelete(d)}
        className="rounded-lg bg-coral/10 px-2.5 py-1 text-[11px] font-semibold text-coral transition-colors hover:bg-coral/20"
      >
        Hapus
      </button>
    </>
  )

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Donasi</p>
        <h1 className="font-heading text-xl font-bold text-navy">Riwayat Donasi</h1>
        <p className="mt-1 text-[13px] text-gray-500">
          Donasi via transfer yang dikirim donatur — verifikasi atau tolak setelah bukti dicek.
        </p>
      </div>

      {/* Ringkasan */}
      <div className="mb-5 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
        {CARDS.map((s) => (
          <div key={s.label} className="card p-3.5">
            <p className={`font-heading text-lg font-extrabold leading-tight ${s.accent || 'text-navy'}`}>{s.value}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="mb-4 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-gray-400">Status</span>
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
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-gray-400">Sumber</span>
          {SOURCE_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setSourceTab(t.key)}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                sourceTab === t.key
                  ? 'border-primary bg-primary/10 text-primary-dark'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
          Gagal memuat data: {error}. Pastikan backend jalan di :3001.
        </p>
      )}

      {/* Tabel — laptop & iPad landscape */}
      <div className="card hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-semibold uppercase tracking-[0.04em] text-gray-400">
                <th className="px-4 py-2.5 font-semibold">Donatur</th>
                <th className="px-4 py-2.5 font-semibold">Sumber</th>
                <th className="px-4 py-2.5 font-semibold">Jenis</th>
                <th className="px-4 py-2.5 text-right font-semibold">Nominal</th>
                <th className="px-4 py-2.5 font-semibold">Tanggal</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((d) => {
                const src = SOURCE_META[d.source] || SOURCE_META.umum
                const t = fmtDate(d.created_at)
                return (
                  <tr key={d.id} className="align-top transition-colors hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-navy">{d.anonymous ? 'Anonim' : d.donor_name}</div>
                      {d.nik && <div className="text-[11px] text-gray-400">NIK {d.nik}</div>}
                      {d.note && (
                        <div className="max-w-[200px] truncate text-[11px] italic text-gray-400">“{d.note}”</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${src.cls}`}>
                        {src.label}
                      </span>
                      {d.source === 'program' && d.program && (
                        <div className="mt-1 max-w-[180px] truncate text-[11px] text-gray-400">{d.program}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{d.jenis_label || d.jenis_id || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-semibold text-navy">{formatRp(Number(d.amount))}</div>
                      <div className="text-[11px] text-gray-400">{d.bank_name || 'tanpa bank'}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      <div>{t.date}</div>
                      <div className="text-[11px] text-gray-400">{t.time}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[d.status]}`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">{renderActions(d)}</div>
                    </td>
                  </tr>
                )
              })}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                    Belum ada donasi{tab !== 'semua' ? ` berstatus "${tab}"` : ''}.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
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
        {loading && (
          <div className="card p-6 text-center text-sm text-gray-400">Memuat…</div>
        )}
        {!loading && rows.length === 0 && (
          <div className="card p-8 text-center text-sm text-gray-400">
            Belum ada donasi{tab !== 'semua' ? ` berstatus "${tab}"` : ''}.
          </div>
        )}
        {rows.map((d) => {
          const src = SOURCE_META[d.source] || SOURCE_META.umum
          const t = fmtDate(d.created_at)
          return (
            <div key={d.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-navy">{d.anonymous ? 'Anonim' : d.donor_name}</p>
                  {d.nik && <p className="text-[11px] text-gray-400">NIK {d.nik}</p>}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[d.status]}`}
                >
                  {d.status}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                <span className={`rounded-full px-2 py-0.5 font-semibold ${src.cls}`}>{src.label}</span>
                {d.source === 'program' && d.program && <span className="text-gray-400">· {d.program}</span>}
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[12px]">
                <div>
                  <dt className="text-gray-400">Nominal</dt>
                  <dd className="font-semibold text-navy">{formatRp(Number(d.amount))}</dd>
                </div>
                <div>
                  <dt className="text-gray-400">Jenis</dt>
                  <dd className="text-gray-600">{d.jenis_label || d.jenis_id || '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-400">Bank</dt>
                  <dd className="text-gray-600">{d.bank_name || 'tanpa bank'}</dd>
                </div>
                <div>
                  <dt className="text-gray-400">Tanggal</dt>
                  <dd className="text-gray-600">
                    {t.date} · {t.time}
                  </dd>
                </div>
              </dl>

              {d.note && <p className="mt-2 text-[11px] italic text-gray-400">“{d.note}”</p>}

              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">{renderActions(d)}</div>
            </div>
          )
        })}
      </div>

      {/* Pratinjau bukti transfer — popup kecil di dalam halaman admin */}
      {proof && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm"
          onClick={() => setProof(null)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-gray-400">Bukti Transfer</p>
                <p className="truncate text-sm font-bold text-navy">{proof.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setProof(null)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-navy"
                aria-label="Tutup"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto bg-gray-50 p-3">
              <img
                src={proofUrl(proof.id)}
                alt={`Bukti transfer ${proof.name}`}
                className="mx-auto max-h-[62vh] w-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
