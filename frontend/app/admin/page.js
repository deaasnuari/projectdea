import Link from 'next/link'
import { PROGRAMS } from '@/app/donatur/program/programData'
import { formatJt, formatRb } from '@/services/format'
import { RECENT_DONATIONS } from './dashboardData'

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
  const totalTarget = PROGRAMS.reduce((sum, p) => sum + p.target, 0)
  const totalCollected = PROGRAMS.reduce((sum, p) => sum + p.collected, 0)
  const totalDonors = PROGRAMS.reduce((sum, p) => sum + p.donors, 0)
  const totalTransaksi = RECENT_DONATIONS.reduce((sum, d) => sum + d.amount, 0)

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
      href: '/admin/program',
      icon: ICON_DONATUR,
      iconBg: 'bg-navy/10',
      iconText: 'text-navy',
      value: totalDonors.toLocaleString('id-ID'),
      sublabel: 'donatur aktif',
      title: 'Total Donatur',
    },
    {
      href: '/admin/program',
      icon: ICON_DANA,
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-700',
      value: formatJt(totalCollected),
      valueClass: 'text-amber-700',
      sublabel: 'total semua program',
      title: 'Dana Terkumpul',
    },
    {
      href: '/admin/program',
      icon: ICON_TRANSAKSI,
      iconBg: 'bg-coral/10',
      iconText: 'text-coral',
      value: formatRb(totalTransaksi),
      valueClass: 'text-coral',
      sublabel: `${RECENT_DONATIONS.length} transaksi`,
      title: 'Total Transaksi',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">Dashboard</p>
        <h1 className="font-heading text-2xl font-bold text-navy">Ringkasan Admin</h1>

      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 max-[480px]:grid-cols-1">
        {STATS.map((s) => (
          <Link key={s.title} href={s.href} className="card flex flex-col p-5 transition-transform hover:-translate-y-0.5">
            <div className="mb-4 flex items-start justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg} ${s.iconText}`}>
                {s.icon}
              </span>
              <span className="text-gray-300">{CHEVRON}</span>
            </div>
            <p className={`font-heading text-2xl font-extrabold ${s.valueClass || 'text-navy'}`}>{s.value}</p>
            <p className="mt-0.5 text-xs text-gray-400">{s.sublabel}</p>
            <p className="mt-2 text-xs font-semibold text-navy">{s.title}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-navy">Progress Program</h2>
            <Link href="/admin/program" className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:text-primary-dark">
              Kelola {CHEVRON}
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {PROGRAMS.map((p) => {
              const percent = Math.round((p.collected / p.target) * 100)
              return (
                <div key={p.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold text-navy">
                      <span aria-hidden="true">{p.icon}</span>
                      {p.title}
                    </span>
                    <span className={`text-xs font-bold ${p.percentText}`}>{percent}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${p.barColor}`} style={{ width: `${percent}%` }} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                    <span>{formatJt(p.collected)}</span>
                    <span>Target: {formatJt(p.target)}</span>
                  </div>
                </div>
              )
            })}
            <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
              <span>Total terkumpul</span>
              <strong className="text-navy">
                {Math.round((totalCollected / totalTarget) * 100)}% dari target keseluruhan
              </strong>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-heading text-base font-bold text-navy">Donasi Terbaru</h2>
          <div className="flex flex-col gap-3">
            {RECENT_DONATIONS.map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${d.avatarBg} ${d.avatarText}`}>
                  {d.name === 'Anonim' ? '?' : d.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{d.name}</p>
                  <p className="text-xs text-gray-400">
                    {d.program} · {d.date}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-primary">+{formatRb(d.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
