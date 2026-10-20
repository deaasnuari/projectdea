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
      <label className="block text-sm font-semibold text-navy">{label}</label>
      <span className="mb-1 block text-[11px] text-gray-500">{hint}</span>
      <label className="flex cursor-text items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3.5 transition-all focus-within:border-primary focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(10,126,126,0.12)]">
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary-dark">Rp</span>
        <input
          type="text"
          inputMode="numeric"
          aria-label={`${label} (Rp)`}
          placeholder="0"
          value={formatRupiahInput(value)}
          onChange={(e) => onChange(parseRupiah(e.target.value))}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold text-navy outline-none placeholder:text-gray-300"
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
    <section id="zakat-calculator" className="relative overflow-hidden bg-gradient-to-br from-navy to-primary-dark py-10 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
      <div className="container relative mx-auto grid max-w-[880px] grid-cols-[0.9fr_1.1fr] items-center gap-8 max-[900px]:grid-cols-1">
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
                className={`group mb-2 flex w-full max-w-[340px] items-center gap-3 rounded-xl border px-4 py-2.5 text-left backdrop-blur-sm transition-all ${
                  on
                    ? 'border-gold/70 bg-white/[0.14] shadow-[0_8px_24px_rgba(0,0,0,0.2)]'
                    : 'border-white/[0.12] bg-white/[0.06] hover:-translate-y-0.5 hover:bg-white/[0.1]'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    on ? 'border-gold bg-gold text-navy' : 'border-gold/30 bg-gold/[0.12] text-gold'
                  }`}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {key === 'profesi' ? (
                      <path d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1zM10 5h4v2h-4z" />
                    ) : (
                      <path d="M12 2l3 6 6 .9-4.5 4.4 1 6.2L12 16.5 6.5 19.5l1-6.2L3 8.9 9 8z" />
                    )}
                  </svg>
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-white/60">
                    {j.nisabLabel}
                  </span>
                  <span className="font-heading text-base font-extrabold text-gold">{formatRp(j.nisab)}</span>
                </span>
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
                  className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-all ${
                    on ? 'bg-white text-navy shadow-md' : 'text-gray-500 hover:text-navy'
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

          <p className="mb-3 rounded-lg border-l-4 border-primary bg-primary/[0.06] px-3 py-2 text-xs leading-relaxed text-gray-600">
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
          <div className={`rounded-lg px-3 py-2.5 ${zakat ? 'bg-primary/[0.09]' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between gap-4 text-[12px] text-gray-500">
              <span>{jenis === 'profesi' ? 'Total penghasilan / bulan' : 'Total harta'}</span>
              <span className="font-semibold text-navy">{formatRp(total)}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200" aria-hidden="true">
              <div
                className={`h-full rounded-full transition-all duration-500 ${zakat ? 'bg-primary' : 'bg-gold'}`}
                style={{ width: `${Math.min(100, (total / info.nisab) * 100)}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-4 border-t border-gray-200/80 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-gray-500">
                {info.label} ({info.periode})
              </span>
              <strong className={zakat ? 'font-heading text-base text-primary-dark' : 'text-sm text-gray-400'}>
                {zakat ? formatRp(zakat) : 'Belum mencapai nisab'}
              </strong>
            </div>
            {!zakat && total > 0 && (
              <p className="mt-1.5 text-[11px] text-gray-500">
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
