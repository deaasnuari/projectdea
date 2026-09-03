'use client'

import { useState } from 'react'
import Link from 'next/link'
import DonationModal from '@/components/donation/DonationModal'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import { formatRp } from '@/services/format'
import { usePrograms } from './usePrograms'

export default function ProgramListSection() {
  const { programs: allPrograms } = usePrograms()
  const programs = allPrograms.filter((p) => p.active !== false) // sembunyikan yang ditutup admin
  const [donationProgram, setDonationProgram] = useState(null)

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
            {programs.map((p) => {
              const percent = p.target > 0 ? Math.round((p.collected / p.target) * 100) : 0
              const reached = p.target > 0 && p.collected >= p.target
              const lebih = Math.max(0, p.collected - p.target)
              return (
                <div key={p.id} className="card">
                  <Link
                    href={`/donatur/program/${p.slug}`}
                    className={`relative flex aspect-[16/9] items-center justify-center overflow-hidden ${p.blockBg}`}
                  >
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-400 hover:scale-[1.05]" />
                    ) : (
                      <span className="text-6xl">{p.icon}</span>
                    )}
                    <span
                      className={`absolute left-4 top-4 z-[1] rounded-full px-3 py-1 text-xs font-semibold ${p.badgeBg} ${p.badgeText}`}
                    >
                      {p.badge}
                    </span>
                  </Link>

                  <div className="p-6">
                    <Link href={`/donatur/program/${p.slug}`}>
                      <h3 className="mb-2 font-heading text-lg font-bold text-navy hover:text-primary">{p.title}</h3>
                    </Link>
                    <p className="mb-5 text-sm leading-[1.6] text-gray-500">{p.desc}</p>

                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {formatRp(p.collected)} / {formatRp(p.target)}
                      </span>
                      <strong className={`font-bold ${p.percentText}`}>{percent}%</strong>
                    </div>
                    <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${p.barColor}`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                    {reached && (
                      <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                        <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                          <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 10.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                        </svg>
                        Target tercapai{lebih > 0 ? ` · lebih ${formatRp(lebih)}` : ''}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{p.donors} donatur</span>
                        <Link href={`/donatur/program/${p.slug}`} className="text-xs font-semibold text-primary hover:text-primary-dark">
                          Selengkapnya
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDonationProgram(p)}
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
        open={donationProgram !== null}
        onClose={() => setDonationProgram(null)}
        initialJenisId={donationProgram?.jenisId}
        scope="program"
        sourceLabel={donationProgram?.title}
      />
    </>
  )
}
