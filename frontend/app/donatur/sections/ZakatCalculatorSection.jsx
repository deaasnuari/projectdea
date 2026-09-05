'use client'

import { useMemo, useState } from 'react'
import { formatRp, formatRupiahInput, parseRupiah } from '@/services/format'
import { NISAB_MAAL, NISAB_PROFESI, hitungZakatProfesi, hitungZakatMaal } from '@/services/zakat'

export default function ZakatCalculatorSection() {
  const [gajiPokok, setGajiPokok] = useState(0)
  const [tunjangan, setTunjangan] = useState(0)
  const [tabungan, setTabungan] = useState(0)
  const [emas, setEmas] = useState(0)

  const penghasilanBulanan = useMemo(() => (gajiPokok || 0) + (tunjangan || 0), [gajiPokok, tunjangan])
  const hartaMaal = useMemo(() => (tabungan || 0) + (emas || 0), [tabungan, emas])

  const zakatProfesi = hitungZakatProfesi(penghasilanBulanan)
  const zakatMaal = hitungZakatMaal(hartaMaal)

  return (
    <section id="zakat-calculator" className="bg-gradient-to-br from-navy to-primary-dark py-16 text-white">
      <div className="container mx-auto grid max-w-[880px] grid-cols-[0.9fr_1.1fr] items-start gap-10 max-[900px]:grid-cols-1">
        {/* Kiri: teks pengantar + nilai nisab */}
        <div>
          <p className="section-label !text-xs !text-gold">Kalkulator Zakat</p>
          <h2 className="my-2 mb-3 font-heading text-xl font-extrabold leading-[1.25] text-white">
            Hitung Zakat Anda
            <br />
            sebagai Karyawan PLN
          </h2>
          <p className="mb-6 max-w-[340px] text-sm leading-[1.6] text-white/75">
            Masukkan data penghasilan dan harta untuk mengetahui kewajiban zakat Anda.
          </p>

          <div className="mb-3 flex max-w-[340px] flex-col gap-0.5 rounded-lg border border-white/[0.12] bg-white/[0.07] px-4 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-white/55">
              Nisab Zakat Maal (85 gr emas)
            </span>
            <span className="font-heading text-base font-extrabold text-gold">{formatRp(NISAB_MAAL)}</span>
          </div>
          <div className="mb-3 flex max-w-[340px] flex-col gap-0.5 rounded-lg border border-white/[0.12] bg-white/[0.07] px-4 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-white/55">
              Nisab Zakat Profesi / Bulan
            </span>
            <span className="font-heading text-base font-extrabold text-gold">{formatRp(NISAB_PROFESI)}</span>
          </div>
        </div>

        {/* Kanan: card form kalkulator */}
        <div className="rounded-tr-[2rem] rounded-bl-[2rem] rounded-tl-lg rounded-br-lg bg-white px-5 py-6 text-gray-800 shadow-xl sm:px-7">
          <h3 className="mb-5 font-heading text-base font-bold text-navy">Data Penghasilan &amp; Harta</h3>

          <div className="mb-4">
            <label className="mb-0.5 block text-sm font-semibold text-gray-800">Gaji Pokok / Bulan</label>
            <span className="mb-1.5 block text-xs text-gray-500">Gaji pokok karyawan PLN Batam</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 transition-colors focus-within:border-primary">
              <span className="text-sm font-semibold text-gray-500">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={formatRupiahInput(gajiPokok)}
                onChange={(e) => setGajiPokok(parseRupiah(e.target.value))}
                className="flex-1 text-sm font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-0.5 block text-sm font-semibold text-gray-800">Tunjangan Tetap / Bulan</label>
            <span className="mb-1.5 block text-xs text-gray-500">Tunjangan jabatan, keluarga, dll.</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 transition-colors focus-within:border-primary">
              <span className="text-sm font-semibold text-gray-500">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={formatRupiahInput(tunjangan)}
                onChange={(e) => setTunjangan(parseRupiah(e.target.value))}
                className="flex-1 text-sm font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-0.5 block text-sm font-semibold text-gray-800">Tabungan &amp; Deposito</label>
            <span className="mb-1.5 block text-xs text-gray-500">Total saldo rekening</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 transition-colors focus-within:border-primary">
              <span className="text-sm font-semibold text-gray-500">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={formatRupiahInput(tabungan)}
                onChange={(e) => setTabungan(parseRupiah(e.target.value))}
                className="flex-1 text-sm font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-0.5 block text-sm font-semibold text-gray-800">Nilai Emas &amp; Perhiasan</label>
            <span className="mb-1.5 block text-xs text-gray-500">Emas &gt; 85gr wajib dizakati</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 transition-colors focus-within:border-primary">
              <span className="text-sm font-semibold text-gray-500">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={formatRupiahInput(emas)}
                onChange={(e) => setEmas(parseRupiah(e.target.value))}
                className="flex-1 text-sm font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className={`mb-2 flex items-center justify-between gap-4 rounded-lg p-3 ${zakatProfesi ? 'bg-primary/[0.08]' : 'bg-gray-50'}`}>
            <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-gray-500">Zakat Profesi (Bulanan)</span>
            <strong className={zakatProfesi ? 'text-sm text-primary-dark' : 'text-xs text-gray-400'}>
              {zakatProfesi ? formatRp(zakatProfesi) : 'Belum mencapai nisab'}
            </strong>
          </div>
          <div className={`mb-1 flex items-center justify-between gap-4 rounded-lg p-3 ${zakatMaal ? 'bg-primary/[0.08]' : 'bg-gray-50'}`}>
            <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-gray-500">Zakat Maal (Tahunan)</span>
            <strong className={zakatMaal ? 'text-sm text-primary-dark' : 'text-xs text-gray-400'}>
              {zakatMaal ? formatRp(zakatMaal) : 'Belum mencapai nisab'}
            </strong>
          </div>
          <p className="mb-2 text-[11px] italic leading-relaxed text-gray-400">
            Zakat Maal berlaku untuk harta (tabungan &amp; emas) yang telah mencapai syarat haul —
            dimiliki genap satu tahun.
          </p>

          <a href="#konsultasi" className="btn btn-primary mt-5 w-full justify-center !py-2.5 text-sm">
            Konsultasikan Perhitungan Ini
          </a>
        </div>
      </div>
    </section>
  )
}
