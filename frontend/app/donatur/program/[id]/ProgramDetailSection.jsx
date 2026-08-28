'use client'

import { useState } from 'react'
import Link from 'next/link'
import DonationModal from '@/components/donation/DonationModal'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import { formatJt } from '@/services/format'

export default function ProgramDetailSection({ program, otherPrograms }) {
  const [donationOpen, setDonationOpen] = useState(false)
  const percent = Math.round((program.collected / program.target) * 100)

  return (
    <>
      <PageHeroBackground className="pb-24 pt-32">
        <div className="container">
          <div className="mx-auto max-w-[820px]">
            <Link
              href="/donatur/program"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-gold"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Kembali ke Daftar Program
            </Link>

            {/* Konten detail program, dalam card besar — mengikuti bentuk
                sudut tajam / lengkung dalam yang sama seperti kartu konten
                di tempat lain di situs ini. */}
            <article className="overflow-hidden rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-lg rounded-br-lg bg-white shadow-[0_24px_60px_-24px_rgba(6,30,40,0.4)]">
              <div className={`relative flex h-52 items-center justify-center overflow-hidden ${program.blockBg}`}>
                {program.image ? (
                  <img src={program.image} alt={program.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="text-7xl">{program.icon}</span>
                )}
                <span
                  className={`absolute left-6 top-6 z-[1] rounded-full px-3 py-1 text-xs font-semibold ${program.badgeBg} ${program.badgeText}`}
                >
                  {program.badge}
                </span>
              </div>

              <div className="px-6 py-10 sm:px-12 sm:py-14">
                <h1 className="mb-6 font-heading text-4xl font-semibold leading-[1.2] text-navy max-[600px]:text-3xl">
                  {program.title}
                </h1>

                <div className="mb-8 rounded-xl bg-gray-50 p-5">
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {formatJt(program.collected)} / {formatJt(program.target)}
                    </span>
                    <strong className={`font-bold ${program.percentText}`}>{percent}%</strong>
                  </div>
                  <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className={`h-full rounded-full ${program.barColor}`} style={{ width: `${percent}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{program.donors} donatur telah berdonasi</span>
                    <button
                      type="button"
                      onClick={() => setDonationOpen(true)}
                      className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold transition-colors ${program.buttonBg} ${program.buttonText} ${program.buttonHover}`}
                    >
                      Donasi Sekarang
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

                {/* Menjadi Harapan Bersama */}
                <div className="mb-10 rounded-xl bg-gradient-to-br from-navy to-primary-dark p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-gold">
                    Menjadi Harapan Bersama
                  </p>
                  <p className="text-[1.05rem] italic leading-[1.8] text-white/90">"{program.harapan}"</p>
                </div>

                {/* Deskripsi Program Kami */}
                <div className="mb-10 border-t border-gray-100 pt-8">
                  <h2 className="mb-4 font-heading text-xl font-bold text-navy">Deskripsi Program Kami</h2>
                  <div className="space-y-4">
                    {program.deskripsiLengkap.map((paragraph, i) => (
                      <p key={i} className="text-[1.05rem] leading-[1.9] text-gray-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Manfaat untuk Masyarakat */}
                <div className="border-t border-gray-100 pt-8">
                  <h2 className="mb-4 font-heading text-xl font-bold text-navy">Manfaat untuk Masyarakat</h2>
                  <ul className="flex flex-col gap-3">
                    {program.manfaat.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-gray-600">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                            <path d="M4 10.5l3.5 3.5L16 5.5" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            {otherPrograms.length > 0 && (
              <div className="mt-16">
                <p className="section-label !text-gold">Program Lainnya</p>
                <h2 className="mb-6 font-heading text-xl font-semibold text-white">Ikut Salurkan Kebaikan</h2>
                <div className="grid grid-cols-2 gap-6 max-[600px]:grid-cols-1">
                  {otherPrograms.map((p) => (
                    <Link key={p.id} href={`/donatur/program/${p.id}`} className="card group block">
                      <div className={`relative flex h-28 items-center justify-center overflow-hidden ${p.blockBg}`}>
                        {p.image ? (
                          <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
                        ) : (
                          <span className="text-4xl">{p.icon}</span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading text-base font-bold leading-snug text-navy group-hover:text-primary">
                          {p.title}
                        </h3>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">{p.donors} donatur</span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:text-primary-dark">
                            Lihat
                            <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PageHeroBackground>

      <DonationModal open={donationOpen} onClose={() => setDonationOpen(false)} initialJenisId={program.jenisId} scope="program" />
    </>
  )
}
