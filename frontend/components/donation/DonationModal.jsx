'use client'

import { useEffect, useState } from 'react'
import { formatRp, formatCountdown } from '@/services/format'

const JENIS_DONASI = [
  { id: 'zakat-profesi', label: 'Zakat Profesi', programLabel: 'Zakat Profesi Karyawan' },
  { id: 'zakat-maal', label: 'Zakat Maal', programLabel: 'Zakat Maal' },
  { id: 'infaq', label: 'Infaq', programLabel: 'Infaq' },
  { id: 'shadaqah', label: 'Shadaqah', programLabel: 'Shadaqah' },
  { id: 'fidyah', label: 'Fidyah', programLabel: 'Fidyah' },
  { id: 'wakaf', label: 'Wakaf', programLabel: 'Wakaf' },
]

const NOMINAL_PRESETS = [50000, 100000, 250000, 500000, 'lainnya', 1000000]

const BANKS = [
  { id: 'bsi', name: 'BSI (Bank Syariah Indonesia)', short: 'BSI', noRek: '7123 456 789', badgeClass: 'bg-[#00754A]' },
  { id: 'mandiri', name: 'Bank Mandiri', short: 'MDR', noRek: '109 0001 23456', badgeClass: 'bg-[#003D79]' },
  { id: 'bri', name: 'BRI', short: 'BRI', noRek: '0026 01 099999 50 9', badgeClass: 'bg-[#00529C]' },
]

const STEPS = [
  { n: 1, label: 'Jenis Donasi' },
  { n: 2, label: 'Nominal & Data' },
  { n: 3, label: 'Pilih Bank' },
]

const BATAS_BAYAR_START = 23 * 3600 + 59 * 60 + 57 // 23:59:57

// Kumpulan ikon garis untuk grid jenis donasi, digambar dengan ketebalan
// garis yang sama seperti ikon-ikon lain di situs ini, bukan pakai emoji —
// supaya modal ini terasa jadi bagian dari brand, bukan seperti widget
// tempelan.
function JenisIcon({ id, className }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    width: 22,
    height: 22,
    className,
  }
  switch (id) {
    case 'zakat-profesi':
      return (
        <svg {...common}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </svg>
      )
    case 'zakat-maal':
      return (
        <svg {...common}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      )
    case 'infaq':
      return (
        <svg {...common}>
          <polyline points="20 12 20 22 4 22 4 12" />
          <rect x="2" y="7" width="20" height="5" />
          <line x1="12" y1="22" x2="12" y2="7" />
          <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
        </svg>
      )
    case 'shadaqah':
      return (
        <svg {...common}>
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      )
    case 'fidyah':
      return (
        <svg {...common}>
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )
    case 'wakaf':
      return (
        <svg {...common}>
          <path d="M3 9l9-7 9 7" />
          <path d="M9 22V12h6v10" />
          <path d="M21 22V9" />
        </svg>
      )
    default:
      return null
  }
}

function UploadIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" className={className}>
      <path d="M21 15v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </svg>
  )
}

function ClockIcon({ className, width = 30, height = 30 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={width} height={height} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

function CheckIcon({ className, width = 12, height = 12 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={width}
      height={height}
      className={className}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

// Ikon panah yang sama dengan yang dipakai di link "Baca" pada blog — dipakai
// lagi di sini supaya semua tombol "lanjut" di situs ini terasa konsisten.
function ArrowIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className={className}>
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function StepIndicator({ step }) {
  return (
    <div className="mb-6 flex items-start">
      {STEPS.map((s, i) => (
        <div key={s.n} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
          <div className="flex flex-col items-center gap-1.5">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step > s.n ? 'bg-navy text-white' : step === s.n ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step > s.n ? <CheckIcon /> : s.n}
            </span>
            <span
              className={`whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.5px] ${
                step >= s.n ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`mx-2 mb-4 h-px flex-1 transition-colors ${step > s.n ? 'bg-navy' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function BankBadge({ bank, size = 'md' }) {
  const dims = size === 'sm' ? 'h-9 w-9 text-[10px]' : 'h-11 w-11 text-xs'
  return (
    <span className={`flex ${dims} shrink-0 items-center justify-center rounded-lg font-extrabold text-white ${bank.badgeClass}`}>
      {bank.short}
    </span>
  )
}

export default function DonationModal({ open, onClose, initialJenisId = null }) {
  const [step, setStep] = useState(1)
  const [jenisId, setJenisId] = useState(initialJenisId)

  const [nominal, setNominal] = useState(100000)
  const [customNominal, setCustomNominal] = useState('')
  const [anonim, setAnonim] = useState(false)
  const [nama, setNama] = useState('')
  const [nik, setNik] = useState('')
  const [niat, setNiat] = useState('')

  const [bankId, setBankId] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(BATAS_BAYAR_START)
  const [copied, setCopied] = useState(false)

  const [buktiFile, setBuktiFile] = useState(null)
  const [buktiPreview, setBuktiPreview] = useState('')
  const [buktiError, setBuktiError] = useState('')

  const jenis = JENIS_DONASI.find((j) => j.id === jenisId) || null
  const bank = BANKS.find((b) => b.id === bankId) || null
  const effectiveNominal = customNominal ? Number(customNominal) : nominal

  // Setiap kali modal ini dibuka lagi dari awal, semua state di-reset. Kalau
  // sebelumnya sudah tahu jenis donasinya dari kartu program, langsung
  // lompat ke step 2.
  useEffect(() => {
    if (!open) return
    setStep(initialJenisId ? 2 : 1)
    setJenisId(initialJenisId)
    setNominal(100000)
    setCustomNominal('')
    setAnonim(false)
    setNama('')
    setNik('')
    setNiat('')
    setBankId(null)
    setSecondsLeft(BATAS_BAYAR_START)
    setCopied(false)
    setBuktiFile(null)
    setBuktiPreview('')
    setBuktiError('')
  }, [open, initialJenisId])

  // Hitung mundur "Batas Bayar" — cuma jalan selama nomor rekening bank
  // sedang ditampilkan.
  useEffect(() => {
    if (step !== 3 || !bank) return
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [step, bank])

  if (!open) return null

  const canGoStep2 = Boolean(jenis)
  const canGoStep3 = effectiveNominal > 0 && (anonim || nama.trim().length > 0)

  const MAX_BUKTI_SIZE = 5 * 1024 * 1024 // 5MB

  const handleBuktiChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setBuktiError('File harus berupa gambar (JPG/PNG)')
      return
    }
    if (file.size > MAX_BUKTI_SIZE) {
      setBuktiError('Ukuran file maksimal 5MB')
      return
    }
    setBuktiError('')
    setBuktiFile(file)
    const reader = new FileReader()
    reader.onload = () => setBuktiPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const copyNoRek = async () => {
    if (!bank) return
    try {
      await navigator.clipboard.writeText(bank.noRek)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Izin akses clipboard ditolak — abaikan saja, nomor rekeningnya
      // tetap terlihat dan bisa disalin manual.
    }
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-navy-dark/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Bentuk sudut tajam / lengkung dalam yang sama seperti card lain
          di situs ini, cuma dibuat lebih besar untuk modal — supaya
          terasa sebagai bagian dari brand, bukan dialog generik yang
          asal ditempel. */}
      <div
        className="relative max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-lg rounded-br-lg bg-white p-6 shadow-[0_32px_70px_-24px_rgba(6,30,40,0.55)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        {(step === 1 || step === 2) && (
          <>
            <div className="mb-6 flex items-center gap-3 pr-8">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                {jenis ? (
                  <JenisIcon id={jenis.id} />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                )}
              </span>
              <div>
                <h3 className="font-heading text-lg font-bold text-primary-dark">Donasi via Transfer</h3>
                {step === 1 ? (
                  <p className="text-xs text-gray-400">LAZIS PT PLN Batam</p>
                ) : (
                  <span className="mt-0.5 inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-gray-500">
                    {jenis?.label}
                  </span>
                )}
              </div>
            </div>
            <StepIndicator step={step} />
          </>
        )}

        {step === 1 && (
          <div>
            <h4 className="mb-4 text-sm font-bold text-navy">Pilih Jenis Donasi</h4>
            <div className="mb-8 grid grid-cols-3 gap-3">
              {JENIS_DONASI.map((item) => {
                const active = jenisId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setJenisId(item.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-5 text-center transition-all ${
                      active
                        ? 'border-navy bg-navy text-white'
                        : 'border-gray-200 text-navy hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    <JenisIcon id={item.id} className={active ? 'text-gold' : 'text-primary'} />
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="border-t border-gray-100 pt-6">
              <button
                type="button"
                disabled={!canGoStep2}
                onClick={() => setStep(2)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_24px_-10px_rgba(10,126,126,0.55)] disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                Lanjut
                <ArrowIcon />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h4 className="mb-3 text-sm font-bold text-navy">Pilih Nominal Donasi</h4>
            <div className="mb-3 grid grid-cols-3 gap-3">
              {NOMINAL_PRESETS.map((preset) =>
                preset === 'lainnya' ? (
                  <button
                    key="lainnya"
                    type="button"
                    onClick={() => {
                      setNominal(null)
                      document.getElementById('nominal-lain-input')?.focus()
                    }}
                    className={`rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
                      customNominal
                        ? 'border-navy bg-navy text-white'
                        : 'border-gray-200 text-navy hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    Lainnya
                  </button>
                ) : (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setNominal(preset)
                      setCustomNominal('')
                    }}
                    className={`rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
                      !customNominal && nominal === preset
                        ? 'border-navy bg-navy text-white'
                        : 'border-gray-200 text-navy hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    {formatRp(preset)}
                  </button>
                )
              )}
            </div>
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 transition-colors focus-within:border-primary focus-within:bg-white">
              <span className="text-sm font-semibold text-gray-500">Rp</span>
              <input
                id="nominal-lain-input"
                type="number"
                min="0"
                placeholder="Nominal lain"
                value={customNominal}
                onChange={(e) => setCustomNominal(e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold text-gray-800 outline-none"
              />
            </div>
            <p className="mb-6 text-center text-xs text-gray-500">
              Nominal: <strong className="text-navy">{formatRp(effectiveNominal)}</strong>
            </p>

            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-bold text-navy">Data Donatur</h4>
              <label className="flex items-center gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={anonim}
                  onChange={(e) => setAnonim(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                Anonim
              </label>
            </div>
            <div className="mb-3">
              <input
                type="text"
                disabled={anonim}
                placeholder={anonim ? 'Hamba Allah' : 'Nama lengkap'}
                value={anonim ? '' : nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-primary focus:bg-white disabled:opacity-50"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="NIK karyawan (opsional)"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-primary focus:bg-white"
              />
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Niat / catatan donasi (opsional)"
                value={niat}
                onChange={(e) => setNiat(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-primary focus:bg-white"
              />
            </div>

            <div className="flex gap-3 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3.5 text-sm font-bold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                <ArrowIcon className="rotate-180" />
                Kembali
              </button>
              <button
                type="button"
                disabled={!canGoStep3}
                onClick={() => setStep(3)}
                className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_24px_-10px_rgba(10,126,126,0.55)] disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                Pilih Bank Pembayaran
                <ArrowIcon />
              </button>
            </div>
          </div>
        )}

        {step === 3 && !bank && (
          <div>
            <h4 className="mb-1 pr-8 text-sm font-bold text-navy">Pilih Bank Tujuan Transfer</h4>
            <p className="mb-6 text-xs text-gray-400">Total tagihan {formatRp(effectiveNominal)}</p>
            <div className="mb-6 flex flex-col gap-3">
              {BANKS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBankId(b.id)}
                  className="flex w-full items-center gap-4 rounded-xl border border-gray-200 px-4 py-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  <BankBadge bank={b} />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-navy">{b.name}</div>
                    <div className="text-xs text-gray-400">Transfer Bank</div>
                  </div>
                  <ArrowIcon className="text-gray-300" />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3.5 text-sm font-bold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              <ArrowIcon className="rotate-180" />
              Kembali
            </button>
          </div>
        )}

        {step === 3 && bank && (
          <div>
            <div className="mb-5 flex items-start justify-between gap-4 pr-8">
              <div className="flex items-center gap-3">
                <BankBadge bank={bank} />
                <div>
                  <div className="text-sm font-bold text-navy">{bank.name}</div>
                  <div className="text-xs text-gray-400">Rekening · LAZIS PLN Batam</div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[9px] font-semibold uppercase tracking-[0.5px] text-gray-400">Batas Bayar</div>
                <div className="font-heading text-base font-bold text-primary-dark">{formatCountdown(secondsLeft)}</div>
              </div>
            </div>

            <div className="mb-5 flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-xs font-semibold text-primary-dark">
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              Sudah transfer? Upload bukti pembayaran di bawah untuk mengonfirmasi donasi Anda.
            </div>

            <div className="mb-5 rounded-xl bg-primary/5 py-6 text-center">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-gray-400">Total Pembayaran</div>
              <div className="font-heading text-3xl font-extrabold text-primary-dark">{formatRp(effectiveNominal)}</div>
              <div className="mt-1 text-xs text-gray-400">Bayar tepat nominal ini — kelebihan tidak dikembalikan</div>
            </div>

            <div className="mb-5 rounded-xl border border-gray-200 p-4">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-gray-400">Nomor Rekening</div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BankBadge bank={bank} size="sm" />
                  <div>
                    <div className="font-heading text-lg font-bold tracking-wide text-navy-dark">{bank.noRek}</div>
                    <div className="text-xs text-gray-400">{bank.name}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyNoRek}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-dark transition-colors hover:bg-primary/20"
                >
                  {copied ? (
                    <>
                      <CheckIcon width={12} height={12} />
                      Disalin
                    </>
                  ) : (
                    'Salin'
                  )}
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-400">a.n. LAZIS PT PLN Batam</p>
            </div>

            <div className="mb-5 overflow-hidden rounded-xl bg-gray-50">
              <div className="bg-primary/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.5px] text-primary-dark">
                Cara Pembayaran ATM / Mobile Banking
              </div>
              <div className="flex flex-col gap-3 px-4 py-4">
                {[
                  'Pilih menu Transfer, lalu pilih Rekening Bank',
                  `Masukkan nomor rekening: ${bank.noRek}`,
                  `Masukkan nominal: ${formatRp(effectiveNominal)}`,
                  'Konfirmasi dan selesaikan transaksi',
                ].map((text, i) => (
                  <div key={text} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary-dark">
                      {i + 1}
                    </span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Upload bukti transfer — karena penyalurannya masih transfer
                manual, konfirmasinya juga dilakukan manual lewat bukti
                pembayaran ini, bukan deteksi otomatis. */}
            <div className="mb-5">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-gray-400">
                Bukti Transfer
              </div>
              <label
                htmlFor="bukti-transfer-input"
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                  buktiPreview
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-gray-200 hover:border-primary/40 hover:bg-primary/5'
                }`}
              >
                {buktiPreview ? (
                  <>
                    <img src={buktiPreview} alt="Pratinjau bukti transfer" className="h-24 w-24 rounded-lg object-cover" />
                    <span className="text-xs font-semibold text-primary-dark">{buktiFile?.name}</span>
                    <span className="text-[11px] text-gray-400">Klik untuk ganti file</span>
                  </>
                ) : (
                  <>
                    <UploadIcon className="text-primary" />
                    <span className="text-xs font-semibold text-navy">Upload bukti transfer</span>
                    <span className="text-[11px] text-gray-400">Screenshot atau foto struk (JPG/PNG, maks 5MB)</span>
                  </>
                )}
              </label>
              <input
                id="bukti-transfer-input"
                type="file"
                accept="image/*"
                onChange={handleBuktiChange}
                className="hidden"
              />
              {buktiError && <p className="mt-2 text-xs font-semibold text-coral">{buktiError}</p>}
            </div>

            <button
              type="button"
              disabled={!buktiFile}
              onClick={() => setStep(4)}
              className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_24px_-10px_rgba(10,126,126,0.55)] disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              Konfirmasi Pembayaran
              <ArrowIcon />
            </button>

            <button
              type="button"
              onClick={() => setBankId(null)}
              className="flex w-full items-center justify-center gap-1.5 text-center text-xs font-semibold text-gray-400 transition-colors hover:text-primary"
            >
              <ArrowIcon className="rotate-180" />
              Ganti Bank
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="pr-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
              <ClockIcon className="text-gold-dark" />
            </div>
            <h3 className="mb-1 text-center font-heading text-2xl font-extrabold text-primary-dark">
              Bukti Pembayaran Terkirim!
            </h3>
            <p className="mb-1 text-center text-sm text-gray-500">
              Tim kami akan memverifikasi pembayaran Anda dalam 1x24 jam.
            </p>
            <p className="mb-6 text-center text-xs font-semibold text-primary-dark">via {bank?.name}</p>

            <div className="mb-6 flex flex-col gap-3 rounded-xl bg-primary/5 p-5 text-sm">
              {buktiPreview && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Bukti Transfer</span>
                  <div className="flex items-center gap-2">
                    <img src={buktiPreview} alt="Bukti transfer" className="h-8 w-8 rounded-md object-cover" />
                    <strong className="max-w-[140px] truncate text-navy-dark">{buktiFile?.name}</strong>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Program</span>
                <strong className="text-navy-dark">{jenis?.programLabel}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Nominal</span>
                <strong className="text-navy-dark">{formatRp(effectiveNominal)}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Bank</span>
                <strong className="text-navy-dark">{bank?.name}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">No. Rekening</span>
                <strong className="text-navy-dark">{bank?.noRek}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Status</span>
                <strong className="inline-flex items-center gap-1.5 text-gold-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  Menunggu Verifikasi
                </strong>
              </div>
            </div>

            <p className="mb-6 text-center text-sm leading-relaxed text-gray-500">
              Jazakallahu khairan atas kebaikan Anda.
              <br />
              Semoga menjadi amal jariyah yang berkah.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_24px_-10px_rgba(10,126,126,0.55)]"
            >
              Selesai
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
