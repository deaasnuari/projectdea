'use client'

import { useState } from 'react'
import DonationModal from '@/components/donation/DonationModal'
import PageHeroBackground from '@/components/layout/PageHeroBackground'

const KEUNGGULAN = [
  'Terdaftar & terverifikasi BAZNAS Kota Batam',
  'Pengawasan Dewan Syariah bersertifikat',
  'Laporan keuangan diaudit setiap tahun',
  'Penyaluran langsung tanpa potongan biaya operasional',
]

const MISI = [
  'Menghimpun zakat, infaq, dan shadaqah dari karyawan PLN Batam secara optimal dan berkelanjutan.',
  'Menyalurkan dana secara tepat sasaran, transparan, dan tepat waktu kepada mustahik.',
  'Mengelola dana sesuai syariat Islam di bawah pengawasan Dewan Syariah.',
  'Membangun program pemberdayaan yang memberi dampak jangka panjang bagi masyarakat.',
]

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
      <path d="M4 10.5l3.5 3.5L16 5.5" />
    </svg>
  )
}

export default function AboutSection() {
  const [donationOpen, setDonationOpen] = useState(false)

  return (
    <>
      <PageHeroBackground className="pb-24 pt-32">
        <div className="container grid grid-cols-[1.1fr_0.9fr] items-start gap-12 max-[900px]:grid-cols-1">
          {/* Left: intro */}
          <div>
            <p className="section-label !text-gold">Tentang Kami</p>
            <h1 className="mb-6 font-heading text-4xl font-semibold leading-[1.15] text-white max-[600px]:text-3xl">
              LAZIS PT PLN Batam
              <br />
              <span className="italic text-gold">Amanah Sejak Berdiri</span>
            </h1>
            <p className="mb-8 max-w-[520px] leading-[1.7] text-white/80">
              Lembaga Zakat dan Shadaqah PT PLN Batam (LAZIS PLN Batam) adalah unit pengelola zakat internal yang
              bertugas mengumpulkan dan menyalurkan zakat, infaq, shadaqah dari karyawan PLN Batam kepada mustahik di
              wilayah Kepulauan Riau.
            </p>

            <div className="grid max-w-[520px] grid-cols-2 gap-4 max-[480px]:grid-cols-1">
              {KEUNGGULAN.map((item) => (
                <div
                  key={item}
                  className="group flex items-start gap-3 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md border border-white/[0.12] bg-white/[0.08] p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.14]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.15] text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-white">
                    <CheckIcon />
                  </span>
                  <span className="text-sm leading-snug text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: donation card */}
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <h3 className="mb-3 font-heading text-xl font-bold text-navy">Donasi via Transfer</h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-500">
              Pilih jenis donasi dan bank tujuan langsung lewat tombol di bawah — nomor rekening ditampilkan otomatis
              di langkah terakhir.
            </p>

            <div className="flex flex-col items-center gap-4 rounded-xl bg-gradient-to-br from-navy to-primary-dark px-6 py-6">
              <span className="text-xs font-semibold uppercase tracking-[0.5px] text-white/70">Bayar zakat sekarang</span>
              <button type="button" onClick={() => setDonationOpen(true)} className="btn btn-gold w-full justify-center">
                Donasi via Transfer
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
        </div>
      </PageHeroBackground>

      {/* Visi & Misi */}
      <section className="bg-gray-50 py-24">
        <div className="container">
          <div className="mb-12">
            <p className="section-label">Arah Kami</p>
            <h2 className="section-title">
              Visi &amp; <span>Misi</span>
            </h2>
          </div>

          <div className="grid grid-cols-[0.8fr_1.2fr] gap-8 max-[900px]:grid-cols-1">
            <div className="card flex flex-col justify-center bg-gradient-to-br from-navy to-primary-dark p-8">
              <h3 className="mb-3 font-heading text-lg font-bold uppercase tracking-[0.5px] text-gold">Visi</h3>
              <p className="leading-[1.7] text-white/85">
                Menjadi lembaga amil zakat internal yang amanah, profesional, dan berdampak nyata bagi kesejahteraan
                mustahik di wilayah Kepulauan Riau.
              </p>
            </div>

            <div className="card p-8">
              <h3 className="mb-5 font-heading text-lg font-bold uppercase tracking-[0.5px] text-primary">Misi</h3>
              <ul className="flex flex-col gap-4">
                {MISI.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-gray-600">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <DonationModal open={donationOpen} onClose={() => setDonationOpen(false)} />
    </>
  )
}
