'use client'

import { useState } from 'react'
import DonationModal from '@/components/donation/DonationModal'

const PROGRAMS = [
  {
    id: 'zakat-profesi-karyawan',
    jenisId: 'zakat-profesi',
    badge: 'Zakat Profesi',
    icon: '⚡',
    title: 'Zakat Profesi Karyawan',
    desc: 'Pemotongan zakat penghasilan 2,5% dari gaji karyawan PLN Batam yang telah mencapai nisab.',
    collected: 2100000,
    target: 3000000,
    donors: 874,
    blockBg: 'bg-green-50',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    barColor: 'bg-green-700',
    percentText: 'text-green-700',
    buttonBg: 'bg-green-100',
    buttonText: 'text-green-700',
    buttonHover: 'hover:bg-green-200',
  },
  {
    id: 'bedah-rumah-dhuafa',
    jenisId: 'shadaqah',
    badge: 'Shadaqah',
    icon: '🏠',
    title: 'Bedah Rumah Dhuafa',
    desc: 'Renovasi hunian tidak layak bagi keluarga prasejahtera di sekitar wilayah operasional PLN Batam.',
    collected: 1300000,
    target: 2000000,
    donors: 312,
    blockBg: 'bg-amber-50',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    barColor: 'bg-amber-600',
    percentText: 'text-amber-700',
    buttonBg: 'bg-amber-100',
    buttonText: 'text-amber-700',
    buttonHover: 'hover:bg-amber-200',
  },
  {
    id: 'beasiswa-anak-yatim',
    jenisId: 'infaq',
    badge: 'Infaq',
    icon: '📚',
    title: 'Beasiswa Anak Yatim',
    desc: 'Dukungan pendidikan bagi anak-anak yatim dan kurang mampu di Batam, Belakang Padang, dan sekitarnya.',
    collected: 640000,
    target: 1000000,
    donors: 528,
    blockBg: 'bg-indigo-50',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-700',
    barColor: 'bg-indigo-700',
    percentText: 'text-indigo-700',
    buttonBg: 'bg-indigo-100',
    buttonText: 'text-indigo-700',
    buttonHover: 'hover:bg-indigo-200',
  },
  {
    id: 'air-bersih-pulau-terpencil',
    jenisId: 'wakaf',
    badge: 'Shadaqah Jariyah',
    icon: '💧',
    title: 'Air Bersih Pulau Terpencil',
    desc: 'Penyediaan akses air bersih bagi masyarakat pulau-pulau kecil di Kepulauan Riau yang belum terjangkau.',
    collected: 540000,
    target: 1000000,
    donors: 196,
    blockBg: 'bg-emerald-50',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    barColor: 'bg-emerald-700',
    percentText: 'text-emerald-700',
    buttonBg: 'bg-emerald-100',
    buttonText: 'text-emerald-700',
    buttonHover: 'hover:bg-emerald-200',
  },
]

function formatJt(n) {
  const v = n / 1000000
  const text = Number.isInteger(v) ? String(v) : v.toFixed(1)
  return `Rp ${text}jt`
}

export default function ProgramListSection() {
  const [donationJenis, setDonationJenis] = useState(null)

  return (
    <section className="bg-gray-50 py-24 pt-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-[640px] text-center">
          <p className="section-label">Daftar Program</p>
          <h1 className="font-heading text-4xl font-extrabold leading-[1.25] text-navy max-[600px]:text-3xl">
            Saluran Kebaikan
            <br />
            <span className="text-primary">dari Karyawan untuk Umat</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-8 max-[768px]:grid-cols-1">
          {PROGRAMS.map((p) => {
            const percent = Math.round((p.collected / p.target) * 100)
            return (
              <div
                key={p.id}
                className="card"
              >
                <div className={`relative flex h-40 items-center justify-center ${p.blockBg}`}>
                  <span
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${p.badgeBg} ${p.badgeText}`}
                  >
                    {p.badge}
                  </span>
                  <span className="text-5xl">{p.icon}</span>
                </div>

                <div className="p-6">
                  <h3 className="mb-2 font-heading text-lg font-bold text-navy">{p.title}</h3>
                  <p className="mb-5 text-sm leading-[1.6] text-gray-500">{p.desc}</p>

                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {formatJt(p.collected)} / {formatJt(p.target)}
                    </span>
                    <strong className={`font-bold ${p.percentText}`}>{percent}%</strong>
                  </div>
                  <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${p.barColor}`} style={{ width: `${percent}%` }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{p.donors} donatur</span>
                    <button
                      type="button"
                      onClick={() => setDonationJenis(p.jenisId)}
                      className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold transition-colors ${p.buttonBg} ${p.buttonText} ${p.buttonHover}`}
                    >
                      Donasi
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <DonationModal
        open={donationJenis !== null}
        onClose={() => setDonationJenis(null)}
        initialJenisId={donationJenis}
      />
    </section>
  )
}
