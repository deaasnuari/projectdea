'use client'

import { useState } from 'react'
import Link from 'next/link'
import DonationModal from '@/components/donation/DonationModal'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import { formatRp } from '@/services/format'
import { usePrograms } from './usePrograms'

function ArrowIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className={className}>
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function ProgramListSection() {
  const { programs: allPrograms } = usePrograms()
  // "Sembunyikan" (active=false) → program tidak tampil sama sekali.
  // "Tutup donasi" (donationOpen=false) → tetap tampil, tombol donasi mati.
  const programs = allPrograms.filter((p) => p.active !== false)
  const [donationProgram, setDonationProgram] = useState(null)

  return (
    <>
      <PageHeroBackground className="pb-16 pt-24 sm:pb-24">
        <div className="container">
          <div className="mb-10 sm:mb-14">
            <p className="section-label !text-gold">Daftar Program</p>
            <h1 className="font-heading text-4xl font-semibold leading-[1.15] text-white max-[600px]:text-3xl">
              Saluran Kebaikan
              <br />
              <span className="italic text-gold">dari Karyawan untuk Umat</span>
            </h1>
            <p className="mt-4 max-w-[520px] text-sm leading-[1.7] text-white/70">
              Pilih program yang ingin kamu dukung. Setiap rupiah disalurkan langsung kepada
              penerima manfaat dengan laporan yang transparan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => {
              const percent = p.target > 0 ? Math.round((p.collected / p.target) * 100) : 0
              const reached = p.target > 0 && p.collected >= p.target
              const lebih = Math.max(0, p.collected - p.target)
              const closed = p.donationOpen === false
              return (
                <article
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(6,30,40,0.06)] ring-1 ring-black/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(6,30,40,0.35)]"
                >
                  {/* Media — kompak (16:10). Pakai gambar kalau ada, kalau
                      tidak: badge ikon di atas blok warna bertekstur. */}
                  <Link
                    href={`/donatur/program/${p.slug}`}
                    className={`relative flex aspect-[16/10] items-center justify-center overflow-hidden ${p.blockBg}`}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06] ${
                          closed ? 'grayscale' : ''
                        }`}
                      />
                    ) : (
                      <>
                        <svg className="absolute inset-0 h-full w-full opacity-[0.5]" aria-hidden="true">
                          <defs>
                            <pattern id={`prg-${p.id}`} width="26" height="26" patternUnits="userSpaceOnUse">
                              <circle cx="2" cy="2" r="1.5" fill="currentColor" className={p.percentText} />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#prg-${p.id})`} />
                        </svg>
                        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70 text-3xl shadow-sm backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
                          {p.icon}
                        </span>
                      </>
                    )}
                    <span
                      className={`absolute left-3 top-3 z-[1] rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${p.badgeBg} ${p.badgeText}`}
                    >
                      {p.badge}
                    </span>
                    {closed && (
                      <span className="absolute right-3 top-3 z-[1] rounded-full bg-navy/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                        Donasi Ditutup
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <Link href={`/donatur/program/${p.slug}`}>
                      <h3 className="mb-1.5 font-heading text-base font-bold leading-snug text-navy transition-colors group-hover:text-primary">
                        {p.title}
                      </h3>
                    </Link>
                    <p className="mb-4 line-clamp-2 text-[13px] leading-[1.6] text-gray-500">{p.desc}</p>

                    {/* Progress */}
                    <div className="mt-auto">
                      <div className="mb-1.5 flex items-end justify-between">
                        <span className="text-xs text-gray-400">
                          <strong className="text-[13px] font-bold text-navy">{formatRp(p.collected)}</strong>
                          <span className="text-gray-300"> / </span>
                          {formatRp(p.target)}
                        </span>
                        <strong className={`font-heading text-base font-extrabold ${p.percentText}`}>{percent}%</strong>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-[width] duration-700 ${p.barColor}`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>

                      {reached && (
                        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                          <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                            <path
                              fillRule="evenodd"
                              d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 10.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Target tercapai{lebih > 0 ? ` · lebih ${formatRp(lebih)}` : ''}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                          <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13" className="text-gray-400">
                            <path d="M13 8a3 3 0 100-6 3 3 0 000 6zM7 8a3 3 0 100-6 3 3 0 000 6zM7 10c-2.7 0-5 1.6-5 3.8V16h10v-2.2C12 11.6 9.7 10 7 10zM13.7 10.2c1.9.5 3.3 1.9 3.3 3.6V16h1v-2c0-2-1.9-3.4-4.3-3.8z" />
                          </svg>
                          {p.donors} donatur
                        </span>
                        {closed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3.5 py-2 text-xs font-bold text-gray-400">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                              <path
                                fillRule="evenodd"
                                d="M10 1a4.5 4.5 0 00-4.5 4.5V8H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm2.5 7V5.5a2.5 2.5 0 00-5 0V8h5z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Ditutup
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDonationProgram(p)}
                            className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold transition-colors ${p.buttonBg} ${p.buttonText} ${p.buttonHover}`}
                          >
                            Donasi
                            <ArrowIcon />
                          </button>
                        )}
                      </div>

                      {closed && (
                        <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-[11px] font-medium text-gray-500">
                          Donasi program ini sudah ditutup — tidak bisa berdonasi lagi.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
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
