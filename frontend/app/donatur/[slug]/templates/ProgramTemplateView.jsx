'use client'

import { useState } from 'react'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import DonationModal from '@/components/donation/DonationModal'
import { normalizeHeroSize } from '@/services/heroSize'

// Template "Program" — halaman program/kegiatan. Mengikuti gaya kartu/detail
// program yang sudah dipakai di situs (ProgramDetailSection sebagai acuan).
export default function ProgramTemplateView({ menu, page, isPreview }) {
  const d = page?.data || {}
  const title = page?.title?.trim() || menu?.name || ''
  const heroSize = normalizeHeroSize(d.heroSize)
  const resized = heroSize < 100
  const gallery = Array.isArray(d.gallery) ? d.gallery : []
  const banks = (Array.isArray(d.banks) ? d.banks : []).filter(
    (b) => (b.name || '').trim() || (b.noRek || '').trim(),
  )
  const [donationOpen, setDonationOpen] = useState(false)

  // Jenis donasi khusus halaman ini — dipakai supaya alur DonationModal
  // langsung ke langkah "Nominal & Data" (persis seperti tombol Donasi di
  // kartu Daftar Program).
  const jenisOverride = [{ id: 'menu-program', key: 'menu-program', label: menu?.name || 'Program' }]

  return (
    <>
      <PageHeroBackground className="pb-16 pt-24 sm:pb-24">
        <div className="container">
          <div className="mx-auto max-w-[820px]">
            {isPreview && (
              <span className="mb-4 inline-block rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy">
                Pratinjau — belum dipublikasikan
              </span>
            )}
            <article className="overflow-hidden rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-lg rounded-br-lg bg-white shadow-[0_24px_60px_-24px_rgba(6,30,40,0.4)]">
              <div
                className={`relative flex items-center justify-center overflow-hidden bg-primary/5 ${
                  page?.heroImage ? (resized ? 'py-8' : '') : 'aspect-[16/9]'
                }`}
              >
                {page?.heroImage ? (
                  <img
                    src={page.heroImage}
                    alt={title}
                    style={{ width: `${heroSize}%` }}
                    className={`block h-auto ${resized ? 'rounded-lg' : ''}`}
                  />
                ) : (
                  <span className="text-6xl">🤝</span>
                )}
                <span className="absolute left-6 top-6 z-[1] rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  {menu?.name}
                </span>
              </div>

              <div className="px-6 py-10 sm:px-12 sm:py-14">
                <h1 className="mb-4 font-heading text-4xl font-semibold leading-[1.2] text-navy max-[600px]:text-3xl">
                  {title}
                </h1>
                {d.desc && <p className="mb-8 text-[1.05rem] leading-[1.8] text-gray-600">{d.desc}</p>}

                {/* Kotak donasi — alur sama seperti kartu Daftar Program:
                    tombol → modal Donasi via Transfer (pilih nominal → data →
                    pilih bank → instruksi transfer → konfirmasi). */}
                {banks.length > 0 && (
                  <div className="mb-10 rounded-xl bg-gray-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-heading text-base font-bold text-navy">Donasi via Transfer</p>
                        <p className="text-xs text-gray-500">
                          {banks.length} rekening tersedia · nomor rekening tampil di langkah terakhir.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDonationOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
                      >
                        Donasi Sekarang
                        <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {d.tujuan && (
                  <div className="mb-10 rounded-xl bg-gradient-to-br from-navy to-primary-dark p-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-gold">Tujuan Program</p>
                    <p className="text-[1.05rem] leading-[1.8] text-white/90">{d.tujuan}</p>
                  </div>
                )}

                {page?.bodyHtml && (
                  <div className="mb-10 border-t border-gray-100 pt-8">
                    <h2 className="mb-4 font-heading text-xl font-bold text-navy">Detail Program</h2>
                    <div className="rich-content" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
                  </div>
                )}

                {gallery.length > 0 && (
                  <div className="border-t border-gray-100 pt-8">
                    <h2 className="mb-4 font-heading text-xl font-bold text-navy">Dokumentasi</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {gallery.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="aspect-square w-full rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {!d.desc && !d.tujuan && !page?.bodyHtml && gallery.length === 0 && banks.length === 0 && (
                  <p className="text-sm text-gray-400">Konten program ini belum diisi.</p>
                )}
              </div>
            </article>
          </div>
        </div>
      </PageHeroBackground>

      <DonationModal
        open={donationOpen}
        onClose={() => setDonationOpen(false)}
        scope="program"
        sourceLabel={title}
        initialJenisId="menu-program"
        jenisOverride={jenisOverride}
        banksOverride={banks}
      />
    </>
  )
}
