'use client'

import Link from 'next/link'
import { usePrograms } from '@/app/donatur/program/usePrograms'
import { formatRp } from '@/services/format'
import { useDonations } from '@/services/donations'

// Warna avatar untuk daftar "Donasi Terbaru" — dipilih berputar sesuai urutan.
const AVATAR_PALETTE = [
  'bg-primary/10 text-primary',
  'bg-amber-100 text-amber-700',
  'bg-navy/10 text-navy',
  'bg-coral/10 text-coral',
  'bg-gray-200 text-gray-500',
]

function fmtTanggal(iso) {
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

// Ikon-ikon kecil untuk kartu ringkasan. Ditulis manual (bukan dari library
// ikon) supaya gaya garisnya sama persis dengan ikon di AdminSidebar.
const ICON_PROGRAM = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
)

const ICON_DONATUR = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
)

const ICON_DANA = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M15 9.5c0-1.38-1.34-2.5-3-2.5s-3 1.12-3 2.5 1.34 2 3 2 3 .62 3 2-1.34 2.5-3 2.5-3-1.12-3-2.5" />
  </svg>
)

const ICON_TRANSAKSI = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
    <path d="M9 8h6M9 12h6" />
  </svg>
)

const CHEVRON = (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
)

export default function AdminDashboardPage() {
  const { programs: allPrograms } = usePrograms()
  const PROGRAMS = allPrograms.filter((p) => p.active !== false) // program yang ditutup tidak dihitung
  const { rows: donations, stats, loading: donLoading } = useDonations()
  const totalTarget = PROGRAMS.reduce((sum, p) => sum + p.target, 0)
  const totalCollected = PROGRAMS.reduce((sum, p) => sum + p.collected, 0)

  const totalTransaksi = stats?.total ?? 0
  const danaTerverifikasi = Number(stats?.total_terverifikasi ?? 0)
  const menungguVerif = stats?.menunggu ?? 0
  const recent = donations.slice(0, 6)

  const STATS = [
    {
      href: '/admin/program',
      icon: ICON_PROGRAM,
      iconBg: 'bg-primary/10',
      iconText: 'text-primary',
      value: PROGRAMS.length,
      sublabel: 'program aktif',
      title: 'Total Program',
    },
    {
      href: '/admin/riwayat-donasi',
      icon: ICON_DONATUR,
      iconBg: 'bg-navy/10',
      iconText: 'text-navy',
      value: donLoading ? '…' : (stats?.donatur ?? 0).toLocaleString('id-ID'),
      sublabel: 'donasi terverifikasi',
      title: 'Total Donatur',
    },
    {
      href: '/admin/riwayat-donasi',
      icon: ICON_DANA,
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-700',
      value: donLoading ? '…' : formatRp(danaTerverifikasi),
      valueClass: 'text-amber-700',
      sublabel: 'donasi terverifikasi',
      title: 'Dana Terkumpul',
    },
    {
      href: '/admin/riwayat-donasi',
      icon: ICON_TRANSAKSI,
      iconBg: 'bg-coral/10',
      iconText: 'text-coral',
      value: donLoading ? '…' : totalTransaksi.toLocaleString('id-ID'),
      valueClass: 'text-coral',
      sublabel: `${menungguVerif} menunggu verifikasi`,
      title: 'Total Transaksi',
    },
  ]

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Dashboard</p>
        <h1 className="font-heading text-xl font-bold text-navy">Ringkasan Admin</h1>
      </div>

      <div className="mb-5 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
        {STATS.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="card flex items-center gap-3 p-3.5 transition-transform hover:-translate-y-0.5"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.iconBg} ${s.iconText}`}>
              {s.icon}
            </span>
            <div className="min-w-0">
              <p className={`font-heading text-lg font-extrabold leading-tight ${s.valueClass || 'text-navy'}`}>
                {s.value}
              </p>
              <p className="truncate text-[11px] font-semibold text-navy">{s.title}</p>
              <p className="truncate text-[11px] text-gray-400">{s.sublabel}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold text-navy">Progress Program</h2>
            <Link href="/admin/program" className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:text-primary-dark">
              Kelola {CHEVRON}
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {PROGRAMS.map((p) => {
              const percent = p.target > 0 ? Math.round((p.collected / p.target) * 100) : 0
              const reached = p.target > 0 && p.collected >= p.target
              return (
                <div key={p.id}>
                  <div className="mb-1 flex items-center justify-between text-[13px]">
                    <span className="flex items-center gap-1.5 font-semibold text-navy">
                      <span aria-hidden="true">{p.icon}</span>
                      {p.title}
                    </span>
                    <span className={`text-xs font-bold ${reached ? 'text-green-600' : p.percentText}`}>
                      {reached ? 'Target tercapai' : `${percent}%`}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${p.barColor}`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-gray-400">
                    <span>{formatRp(p.collected)}</span>
                    <span>Target: {formatRp(p.target)}</span>
                  </div>
                </div>
              )
            })}
            <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-2.5 text-[11px] text-gray-500">
              <span>Total terkumpul</span>
              <strong className="text-navy">
                {Math.round((totalCollected / totalTarget) * 100)}% dari target keseluruhan
              </strong>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold text-navy">Donasi Terbaru</h2>
            <Link href="/admin/riwayat-donasi" className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:text-primary-dark">
              Lihat semua {CHEVRON}
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {recent.map((d, i) => {
              const nama = d.anonymous ? 'Anonim' : d.donor_name
              const label = d.jenis_label || d.program || 'Donasi'
              return (
                <div key={d.id} className="flex items-center gap-2.5">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${AVATAR_PALETTE[i % AVATAR_PALETTE.length]}`}>
                    {nama === 'Anonim' ? '?' : nama.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-navy">{nama}</p>
                    <p className="truncate text-[11px] text-gray-400">
                      {label} · {fmtTanggal(d.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 text-[13px] font-bold text-primary">+{formatRp(d.amount)}</span>
                </div>
              )
            })}
            {!donLoading && recent.length === 0 && (
              <p className="py-5 text-center text-sm text-gray-400">Belum ada donasi masuk.</p>
            )}
            {donLoading && <p className="py-5 text-center text-sm text-gray-400">Memuat…</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
