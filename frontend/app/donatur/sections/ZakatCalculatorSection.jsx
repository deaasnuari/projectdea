'use client'

import { useState } from 'react'
import { formatRp, formatRupiahInput, parseRupiah } from '@/services/format'
import { NISAB_MAAL, NISAB_PROFESI, hitungZakatProfesi, hitungZakatMaal } from '@/services/zakat'

// Zakat Profesi & Zakat Maal dihitung TERPISAH (tab sendiri-sendiri), supaya
// pengunjung tahu kolom mana yang diisi untuk zakat yang mana — penghasilan
// bulanan untuk profesi, harta simpanan setahun untuk maal.
const JENIS = {
  profesi: {
    label: 'Zakat Profesi',
    periode: 'Bulanan',
    nisabLabel: 'Nisab Zakat Profesi / Bulan',
    nisab: NISAB_PROFESI,
    keterangan:
      'Zakat dari penghasilan bulanan (gaji pokok + tunjangan tetap). Wajib dikeluarkan kalau penghasilan sebulan mencapai nisab.',
    catatan: 'Dibayar setiap bulan saat menerima gaji.',
  },
  maal: {
    label: 'Zakat Maal',
    periode: 'Tahunan',
    nisabLabel: 'Nisab Zakat Maal (85 gr emas)',
    nisab: NISAB_MAAL,
    keterangan:
      'Zakat dari harta simpanan (tabungan, deposito, emas & perhiasan). Wajib dikeluarkan kalau totalnya mencapai nisab.',
    catatan: 'Berlaku untuk harta yang telah dimiliki genap satu tahun (haul).',
  },
}

function RupiahField({ label, hint, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-semibold text-gray-800">{label}</label>
      <span className="mb-1 block text-[11px] text-gray-500">{hint}</span>
      <label className="flex cursor-text items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3.5 transition-colors focus-within:border-primary">
        <span className="text-sm font-semibold text-gray-500">Rp</span>
        <input
          type="text"
          inputMode="numeric"
          aria-label={`${label} (Rp)`}
          placeholder="0"
          value={formatRupiahInput(value)}
          onChange={(e) => onChange(parseRupiah(e.target.value))}
          className="min-w-0 flex-1 py-2 text-sm font-semibold text-gray-800"
        />
      </label>
    </div>
  )
}

export default function ZakatCalculatorSection() {
  const [jenis, setJenis] = useState('profesi')
  const [gajiPokok, setGajiPokok] = useState(0)
  const [tunjangan, setTunjangan] = useState(0)
  const [tabungan, setTabungan] = useState(0)
  const [emas, setEmas] = useState(0)

  const penghasilanBulanan = (gajiPokok || 0) + (tunjangan || 0)
  const hartaMaal = (tabungan || 0) + (emas || 0)
  const total = jenis === 'profesi' ? penghasilanBulanan : hartaMaal
  const zakat = jenis === 'profesi' ? hitungZakatProfesi(penghasilanBulanan) : hitungZakatMaal(hartaMaal)
  const info = JENIS[jenis]
  const kurang = Math.max(0, info.nisab - total)

  return (
    <section id="zakat-calculator" className="bg-gradient-to-br from-navy to-primary-dark py-10 text-white">
      <div className="container mx-auto grid max-w-[880px] grid-cols-[0.9fr_1.1fr] items-start gap-8 max-[900px]:grid-cols-1">
        {/* Kiri: teks pengantar + nilai nisab (klik untuk pilih jenis zakat) */}
        <div>
          <p className="section-label !text-xs !text-gold">Kalkulator Zakat</p>
          <h2 className="my-2 mb-3 font-heading text-xl font-extrabold leading-[1.25] text-white">
            Hitung Zakat Anda
            <br />
            sebagai Karyawan PLN
          </h2>
          <p className="mb-4 max-w-[340px] text-sm leading-[1.6] text-white/75">
            Pilih jenis zakat yang ingin dihitung, lalu isi datanya. Zakat profesi dan zakat maal
            dihitung terpisah.
          </p>

          {Object.entries(JENIS).map(([key, j]) => {
            const on = jenis === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setJenis(key)}
                aria-pressed={on}
                className={`mb-2 flex w-full max-w-[340px] flex-col gap-0.5 rounded-lg border px-4 py-2.5 text-left transition-colors ${
                  on
                    ? 'border-gold/60 bg-white/[0.14]'
                    : 'border-white/[0.12] bg-white/[0.07] hover:bg-white/[0.1]'
                }`}
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-white/55">
                  {j.nisabLabel}
                </span>
                <span className="font-heading text-base font-extrabold text-gold">{formatRp(j.nisab)}</span>
              </button>
            )
          })}
        </div>

        {/* Kanan: card kalkulator — tab Zakat Profesi / Zakat Maal */}
        <div className="rounded-tr-[2rem] rounded-bl-[2rem] rounded-tl-lg rounded-br-lg bg-white px-5 py-5 text-gray-800 shadow-xl sm:px-6">
          <div role="tablist" aria-label="Jenis zakat" className="mb-3 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
            {Object.entries(JENIS).map(([key, j]) => {
              const on = jenis === key
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setJenis(key)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${
                    on ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'
                  }`}
                >
                  {j.label}
                  <span className={`block text-[10px] font-semibold ${on ? 'text-primary' : 'text-gray-400'}`}>
                    {j.periode}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="mb-3 rounded-lg bg-primary/[0.06] px-3 py-2 text-xs leading-relaxed text-gray-600">
            {info.keterangan}
          </p>

          {jenis === 'profesi' ? (
            <>
              <RupiahField
                label="Gaji Pokok / Bulan"
                hint="Gaji pokok karyawan PLN Batam"
                value={gajiPokok}
                onChange={setGajiPokok}
              />
              <RupiahField
                label="Tunjangan Tetap / Bulan"
                hint="Tunjangan jabatan, keluarga, dll."
                value={tunjangan}
                onChange={setTunjangan}
              />
            </>
          ) : (
            <>
              <RupiahField
                label="Tabungan & Deposito"
                hint="Total saldo rekening yang sudah tersimpan 1 tahun"
                value={tabungan}
                onChange={setTabungan}
              />
              <RupiahField
                label="Nilai Emas & Perhiasan"
                hint="Nilai emas/perhiasan yang disimpan (dalam rupiah)"
                value={emas}
                onChange={setEmas}
              />
            </>
          )}

          {/* Hasil — hanya untuk jenis zakat yang sedang dipilih */}
          <div className={`rounded-lg px-3 py-2.5 ${zakat ? 'bg-primary/[0.08]' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between gap-4 text-[12px] text-gray-500">
              <span>{jenis === 'profesi' ? 'Total penghasilan / bulan' : 'Total harta'}</span>
              <span className="font-semibold text-gray-700">{formatRp(total)}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-4 border-t border-gray-200/70 pt-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-gray-500">
                {info.label} ({info.periode})
              </span>
              <strong className={zakat ? 'text-base text-primary-dark' : 'text-xs text-gray-400'}>
                {zakat ? formatRp(zakat) : 'Belum mencapai nisab'}
              </strong>
            </div>
            {!zakat && total > 0 && (
              <p className="mt-1.5 text-[11px] text-gray-400">
                Kurang {formatRp(kurang)} lagi untuk mencapai nisab.
              </p>
            )}
          </div>
          <p className="mt-1.5 text-[11px] italic leading-relaxed text-gray-400">
            {info.catatan} Besar zakat 2,5% dari total.
          </p>

          <a href="#konsultasi" className="btn btn-primary mt-3 w-full justify-center !py-2 text-sm">
            Konsultasikan Perhitungan Ini
          </a>
        </div>
      </div>
    </section>
  )
}
