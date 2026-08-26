'use client'

import { useState } from 'react'
import Link from 'next/link'
import DonationModal from '@/components/donation/DonationModal'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import { formatJt } from '@/services/format'
import { PROGRAMS } from './programData'

export default function ProgramListSection() {
  const [donationJenis, setDonationJenis] = useState(null)

  return (
    <>
      <PageHeroBackground className="pb-24 pt-32">
        <div className="container">
          <div className="mb-16">
            <p className="section-label !text-gold">Daftar Program</p>
            <h1 className="font-heading text-4xl font-semibold leading-[1.15] text-white max-[600px]:text-3xl">
              Saluran Kebaikan
              <br />
              <span className="italic text-gold">dari Karyawan untuk Umat</span>
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-8 max-[768px]:grid-cols-1">
            {PROGRAMS.map((p) => {
              const percent = Math.round((p.collected / p.target) * 100)
              return (
                <div key={p.id} className="card">
                  <Link href={`/donatur/program/${p.id}`} className={`relative flex h-40 items-center justify-center ${p.blockBg}`}>
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${p.badgeBg} ${p.badgeText}`}
                    >
                      {p.badge}
                    </span>
                    <span className="text-5xl">{p.icon}</span>
                  </Link>

                  <div className="p-6">
                    <Link href={`/donatur/program/${p.id}`}>
                      <h3 className="mb-2 font-heading text-lg font-bold text-navy hover:text-primary">{p.title}</h3>
                    </Link>
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
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{p.donors} donatur</span>
                        <Link href={`/donatur/program/${p.id}`} className="text-xs font-semibold text-primary hover:text-primary-dark">
                          Selengkapnya
                        </Link>
                      </div>
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
      </PageHeroBackground>

      <DonationModal
        open={donationJenis !== null}
        onClose={() => setDonationJenis(null)}
        initialJenisId={donationJenis}
      />
    </>
  )
}
