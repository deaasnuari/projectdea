'use client'

import { useState } from 'react'
import DonationModal from '@/components/donation/DonationModal'

const KEUNGGULAN = [
  'Terdaftar & terverifikasi BAZNAS Kota Batam',
  'Pengawasan Dewan Syariah bersertifikat',
  'Laporan keuangan diaudit setiap tahun',
  'Penyaluran langsung tanpa potongan biaya operasional',
]

const REKENING = [
  { bank: 'BSI (Bank Syariah Indonesia)', nomor: '7123 456 789' },
  { bank: 'Bank Mandiri', nomor: '109 0001 23456' },
  { bank: 'BRI', nomor: '0026 01 099999 50 9' },
]

export default function AboutSection() {
  const [donationOpen, setDonationOpen] = useState(false)

  return (
    <section className="bg-gray-50 py-24 pt-32">
      <div className="container grid grid-cols-[1.1fr_0.9fr] items-start gap-12 max-[900px]:grid-cols-1">
        {/* Left: intro */}
        <div>
          <p className="section-label">Tentang Kami</p>
          <h1 className="section-title mb-6">
            LAZIS PT PLN Batam
            <br />
            <span>Amanah Sejak Berdiri</span>
          </h1>
          <p className="mb-8 max-w-[520px] leading-[1.7] text-gray-500">
            Lembaga Zakat dan Shadaqah PT PLN Batam (LAZIS PLN Batam) adalah unit pengelola zakat internal yang
            bertugas mengumpulkan dan menyalurkan zakat, infaq, shadaqah dari karyawan PLN Batam kepada mustahik di
            wilayah Kepulauan Riau.
          </p>

          <ul className="flex max-w-[480px] flex-col gap-4">
            {KEUNGGULAN.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                    <path d="M4 10.5l3.5 3.5L16 5.5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: donation card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h3 className="mb-6 font-heading text-xl font-bold text-navy">Rekening Donasi</h3>

          <div className="mb-6 flex flex-col">
            {REKENING.map((r, i) => (
              <div
                key={r.bank}
                className={`flex items-center justify-between gap-4 py-4 text-sm ${i > 0 ? 'border-t border-gray-100' : ''}`}
              >
                <span className="text-gray-500">{r.bank}</span>
                <strong className="text-navy-dark">{r.nomor}</strong>
              </div>
            ))}
          </div>
          <p className="mb-6 text-xs text-gray-400">a.n. LAZIS PT PLN Batam</p>

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

      <DonationModal open={donationOpen} onClose={() => setDonationOpen(false)} />
    </section>
  )
}
