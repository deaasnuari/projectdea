'use client'

import CardCarousel, { CAROUSEL_ITEM } from '@/components/ui/CardCarousel'
import { useState } from 'react'
import Link from 'next/link'
import DonationModal from '@/components/donation/DonationModal'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import { formatRp } from '@/services/format'
import { usePrograms } from './usePrograms'
import { useProgramSummary } from '@/services/programs'
import ProgramHeroText from './ProgramHeroText'

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
  const [cat, setCat] = useState('Semua')

  // Filter kategori (badge program) + ringkasan angka dari program yang tampil.
  const cats = ['Semua', ...Array.from(new Set(programs.map((p) => p.badge).filter(Boolean)))]
  const shown = cat === 'Semua' ? programs : programs.filter((p) => p.badge === cat)
  // Angka asli dari database (donasi terverifikasi) + pilihan admin mau
  // menampilkan ringkasan / tiap kotaknya atau tidak.
  const { summary: sum } = useProgramSummary()
  const st = sum?.settings || {}
  const summary = sum
    ? [
        st.programs !== false && { label: 'Program', value: Number(sum.programs).toLocaleString('id-ID') },
        st.dana !== false && { label: 'Dana terkumpul', value: formatRp(Number(sum.dana)) },
        st.donatur !== false && { label: 'Donatur', value: Number(sum.donatur).toLocaleString('id-ID') },
      ].filter(Boolean)
    : []
  const showSummary = st.show !== false && summary.length > 0

  return (
    <>
      <PageHeroBackground className="pb-16 pt-24 sm:pb-24">
        <div className="container">
          {/* Teks header — dikelola admin di /admin/program */}
          <ProgramHeroText />

          {programs.length > 0 && (showSummary || cats.length > 2) && (
            <div className="mb-8 flex flex-col gap-4">
              {/* Ringkasan: memberi gambaran skala program sebelum memilih */}
              {showSummary && (
              <div
                className={`grid gap-2 sm:gap-3 ${
                  summary.length >= 3 ? 'grid-cols-3' : summary.length === 2 ? 'grid-cols-2' : 'grid-cols-1 max-w-sm'
                }`}
              >
                {summary.map((s) => (
                  <div
                    key={s.label}
                    className="min-w-0 rounded-xl border border-white/15 bg-white/10 px-2.5 py-2 backdrop-blur-md sm:px-4 sm:py-3"
                  >
                    <p className="whitespace-nowrap font-heading text-[13px] font-extrabold leading-tight text-gold min-[400px]:text-[15px] sm:text-2xl">{s.value}</p>
                    <p className="text-[9px] font-semibold uppercase leading-tight tracking-[0.04em] text-white/70 sm:text-[11px] sm:tracking-[0.08em]">{s.label}</p>
                  </div>
                ))}
              </div>
              )}

              {/* Filter kategori — hanya tampil kalau ada lebih dari satu kategori */}
              {cats.length > 2 && (
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter kategori program">
                  {cats.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="tab"
                      aria-selected={cat === c}
                      onClick={() => setCat(c)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                        cat === c
                          ? 'bg-gold text-navy shadow'
                          : 'bg-white/10 text-white/80 ring-1 ring-white/20 hover:bg-white/20'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <CardCarousel>
            {shown.map((p) => {
              const percent = p.target > 0 ? Math.round((p.collected / p.target) * 100) : 0
              const reached = p.target > 0 && p.collected >= p.target
              const lebih = Math.max(0, p.collected - p.target)
              const closed = p.donationOpen === false
              return (
                <article
                  key={p.id}
                  className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(6,30,40,0.06)] ring-1 ring-black/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(6,30,40,0.35)] ${CAROUSEL_ITEM}`}
                >
                  {/* Media — kompak (16:10). Pakai gambar kalau ada, kalau
                      tidak: badge ikon di atas blok warna bertekstur. */}
                  <Link
                    href={`/donatur/program/${p.slug}`}
                    className={`relative flex items-center justify-center overflow-hidden ${p.image ? 'aspect-[16/10]' : 'aspect-[16/7]'} ${p.blockBg}`}
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
                        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-4xl shadow-md backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
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
          </CardCarousel>
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
