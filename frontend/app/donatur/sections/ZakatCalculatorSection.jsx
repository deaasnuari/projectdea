'use client'

import { useMemo, useState } from 'react'

const NISAB_MAAL = 80750000
const NISAB_PROFESI = Math.round(NISAB_MAAL / 12)
const ZAKAT_RATE = 0.025

function formatRp(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID')
}

export default function ZakatCalculatorSection() {
  const [gajiPokok, setGajiPokok] = useState(0)
  const [tunjangan, setTunjangan] = useState(0)
  const [tabungan, setTabungan] = useState(0)
  const [emas, setEmas] = useState(0)

  const penghasilanBulanan = useMemo(() => (gajiPokok || 0) + (tunjangan || 0), [gajiPokok, tunjangan])
  const hartaMaal = useMemo(() => (tabungan || 0) + (emas || 0), [tabungan, emas])

  const zakatProfesi = penghasilanBulanan >= NISAB_PROFESI ? penghasilanBulanan * ZAKAT_RATE : 0
  const zakatMaal = hartaMaal >= NISAB_MAAL ? hartaMaal * ZAKAT_RATE : 0

  return (
    <section id="zakat-calculator" className="bg-gradient-to-br from-navy to-primary-dark py-24 text-white">
      <div className="container grid grid-cols-[0.9fr_1.1fr] items-start gap-12 max-[900px]:grid-cols-1">
        {/* Left: intro + nisab */}
        <div>
          <p className="section-label !text-gold">Kalkulator Zakat</p>
          <h2 className="my-2 mb-4 font-heading text-3xl font-extrabold leading-[1.25] text-white">
            Hitung Zakat Anda
            <br />
            sebagai Karyawan PLN
          </h2>
          <p className="mb-8 max-w-[380px] leading-[1.7] text-white/75">
            Masukkan data penghasilan dan harta untuk mengetahui kewajiban zakat Anda.
          </p>

          <div className="mb-4 flex max-w-[380px] flex-col gap-1 rounded-xl border border-white/[0.12] bg-white/[0.07] px-6 py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.5px] text-white/55">
              Nisab Zakat Maal (85 gr emas)
            </span>
            <span className="font-heading text-xl font-extrabold text-gold">{formatRp(NISAB_MAAL)}</span>
          </div>
          <div className="mb-4 flex max-w-[380px] flex-col gap-1 rounded-xl border border-white/[0.12] bg-white/[0.07] px-6 py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.5px] text-white/55">
              Nisab Zakat Profesi / Bulan
            </span>
            <span className="font-heading text-xl font-extrabold text-gold">{formatRp(NISAB_PROFESI)}</span>
          </div>
        </div>

        {/* Right: form card */}
        <div className="rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-lg rounded-br-lg bg-white px-6 py-8 text-gray-800 shadow-xl max-[900px]:px-6 sm:px-10">
          <h3 className="mb-6 font-heading text-xl font-bold text-navy">Data Penghasilan &amp; Harta</h3>

          <div className="mb-6">
            <label className="mb-0.5 block text-sm font-semibold text-gray-800">Gaji Pokok / Bulan</label>
            <span className="mb-2 block text-xs text-gray-500">Gaji pokok karyawan PLN Batam</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-[0.7rem] transition-colors focus-within:border-primary">
              <span className="text-sm font-semibold text-gray-500">Rp</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={gajiPokok || ''}
                onChange={(e) => setGajiPokok(Number(e.target.value))}
                className="flex-1 text-base font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-0.5 block text-sm font-semibold text-gray-800">Tunjangan Tetap / Bulan</label>
            <span className="mb-2 block text-xs text-gray-500">Tunjangan jabatan, keluarga, dll.</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-[0.7rem] transition-colors focus-within:border-primary">
              <span className="text-sm font-semibold text-gray-500">Rp</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={tunjangan || ''}
                onChange={(e) => setTunjangan(Number(e.target.value))}
                className="flex-1 text-base font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-0.5 block text-sm font-semibold text-gray-800">Tabungan &amp; Deposito</label>
            <span className="mb-2 block text-xs text-gray-500">Total saldo rekening</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-[0.7rem] transition-colors focus-within:border-primary">
              <span className="text-sm font-semibold text-gray-500">Rp</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={tabungan || ''}
                onChange={(e) => setTabungan(Number(e.target.value))}
                className="flex-1 text-base font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-0.5 block text-sm font-semibold text-gray-800">Nilai Emas &amp; Perhiasan</label>
            <span className="mb-2 block text-xs text-gray-500">Emas &gt; 85gr wajib dizakati</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-[0.7rem] transition-colors focus-within:border-primary">
              <span className="text-sm font-semibold text-gray-500">Rp</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={emas || ''}
                onChange={(e) => setEmas(Number(e.target.value))}
                className="flex-1 text-base font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className={`mb-2 flex items-center justify-between gap-4 rounded-lg p-4 ${zakatProfesi ? 'bg-primary/[0.08]' : 'bg-gray-50'}`}>
            <span className="text-xs font-bold uppercase tracking-[0.4px] text-gray-500">Zakat Profesi (Bulanan)</span>
            <strong className={zakatProfesi ? 'text-base text-primary-dark' : 'text-sm text-gray-400'}>
              {zakatProfesi ? formatRp(zakatProfesi) : 'Belum mencapai nisab'}
            </strong>
          </div>
          <div className={`mb-2 flex items-center justify-between gap-4 rounded-lg p-4 ${zakatMaal ? 'bg-primary/[0.08]' : 'bg-gray-50'}`}>
            <span className="text-xs font-bold uppercase tracking-[0.4px] text-gray-500">Zakat Maal (Tahunan)</span>
            <strong className={zakatMaal ? 'text-base text-primary-dark' : 'text-sm text-gray-400'}>
              {zakatMaal ? formatRp(zakatMaal) : 'Belum mencapai nisab'}
            </strong>
          </div>

          <a href="#konsultasi" className="btn btn-primary mt-6 w-full justify-center">
            Konsultasikan Perhitungan Ini
          </a>
        </div>
      </div>
    </section>
  )
}
