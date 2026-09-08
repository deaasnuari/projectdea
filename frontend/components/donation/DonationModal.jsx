'use client'

import { useEffect, useState } from 'react'
import { formatRp, formatCountdown } from '@/services/format'
import { createDonation } from '@/services/donations'
import { useDonationMethods } from './donationMethodsData'

const NOMINAL_PRESETS = [50000, 100000, 250000, 500000, 'lainnya', 1000000]

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
      // Jenis donasi tambahan (dibuat admin) — ikon umum.
      return (
        <svg {...common}>
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      )
  }
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

function CopyIcon({ width = 13, height = 13 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={width} height={height}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function WalletIcon({ width = 20, height = 20 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" width={width} height={height}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M16 14h.01" />
    </svg>
  )
}

// Progress langkah — batang tersegmen di dalam header gelap modal.
function StepBar({ step }) {
  return (
    <div className="mt-4 flex gap-2">
      {STEPS.map((s) => {
        const on = step >= s.n
        return (
          <div key={s.n} className="flex-1">
            <div className={`h-1 rounded-full transition-colors ${on ? 'bg-gold' : 'bg-white/15'}`} />
            <span
              className={`mt-1.5 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.4px] transition-colors ${
                on ? 'text-white/85' : 'text-white/35'
              }`}
            >
              {step > s.n && <CheckIcon width={9} height={9} />}
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Header gelap ber-gradient di atas modal — dipakai di langkah pilih jenis,
// isi nominal/data, dan pilih bank. Ikut "bleed" sampai tepi kartu.
function ModalHeader({ step, jenis, sourceLabel }) {
  return (
    <div className="-mx-5 -mt-5 mb-6 bg-gradient-to-br from-navy to-primary-dark px-5 pb-5 pt-5 text-white sm:-mx-8 sm:-mt-8 sm:mb-7 sm:px-8 sm:pt-6">
      <div className="flex items-center gap-3 pr-9">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold ring-1 ring-white/15">
          {jenis ? <JenisIcon id={jenis.id} width={20} height={20} /> : <WalletIcon />}
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-base font-bold leading-tight">Donasi via Transfer</h3>
          <p className="truncate text-[11px] text-white/60">
            {jenis?.label || 'LAZIS PT PLN Batam'}
            {sourceLabel ? ` · ${sourceLabel}` : ''}
          </p>
        </div>
      </div>
      <StepBar step={step} />
    </div>
  )
}

function BankBadge({ bank, size = 'md' }) {
  const dims = size === 'sm' ? 'h-9 w-9 text-[10px]' : 'h-11 w-11 text-xs'
  return (
    <span className={`flex ${dims} shrink-0 items-center justify-center rounded-lg font-extrabold text-white ${bank.badgeClass || 'bg-navy'}`}>
      {bank.short || (bank.name || '?').slice(0, 3).toUpperCase()}
    </span>
  )
}

export default function DonationModal({
  open,
  onClose,
  initialJenisId = null,
  scope = 'tentang',
  sourceLabel = null,
}) {
  const { jenisList, banks } = useDonationMethods(scope)

  const [step, setStep] = useState(1)
  const [jenisId, setJenisId] = useState(initialJenisId)

  const [nominal, setNominal] = useState(100000)
  const [customNominal, setCustomNominal] = useState('')
  const [anonim, setAnonim] = useState(false)
  const [nama, setNama] = useState('')
  const [niat, setNiat] = useState('')

  const [bankId, setBankId] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(BATAS_BAYAR_START)
  const [copied, setCopied] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const jenis =
    jenisList.find((j) => j.key === jenisId || String(j.id) === String(jenisId)) || null
  const bank = banks.find((b) => b.id === bankId) || null
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
    setNiat('')
    setBankId(null)
    setSecondsLeft(BATAS_BAYAR_START)
    setCopied(false)
    setSubmitting(false)
    setSubmitError('')
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
  // Header gelap ber-gradient tampil di langkah pilih jenis, isi data, dan
  // pilih bank — tidak di rincian pembayaran (punya tata letak sendiri) & sukses.
  const darkHeader = step === 1 || step === 2 || (step === 3 && !bank)

  const handleConfirm = async () => {
    if (submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await createDonation({
        donorName: anonim ? 'Anonim' : nama.trim(),
        anonymous: anonim,
        source: scope, // 'program' | 'tentang'
        jenisId: jenis?.key || jenis?.id || null,
        jenisLabel: jenis?.label || null,
        program: sourceLabel || jenis?.programLabel || jenis?.label || null,
        amount: effectiveNominal,
        bankId: bank?.id || null,
        bankName: bank?.name || null,
        note: niat.trim() || null,
      })
      setStep(4)
    } catch (err) {
      setSubmitError(err.message || 'Gagal mengirim. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
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
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-navy-dark/70 p-3 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      {/* Bentuk sudut tajam / lengkung dalam yang sama seperti card lain
          di situs ini, cuma dibuat lebih besar untuk modal — supaya
          terasa sebagai bagian dari brand, bukan dialog generik yang
          asal ditempel. Scroll-nya di dalam kartu ini sendiri (bukan di
          overlay) supaya kartu tidak ikut geser dari tengah layar; bar-nya
          disembunyikan (.no-scrollbar) supaya tidak nongol di sudut yang
          melengkung. */}
      <div
        className="no-scrollbar relative max-h-[92vh] w-full max-w-[480px] animate-fade-in-up overflow-y-auto rounded-tr-[2rem] rounded-bl-[2rem] rounded-tl-lg rounded-br-lg bg-white p-5 shadow-[0_32px_70px_-24px_rgba(6,30,40,0.55)] sm:rounded-tr-[2.5rem] sm:rounded-bl-[2.5rem] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className={`absolute right-4 top-4 z-[1] flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            darkHeader
              ? 'text-white/70 hover:bg-white/15 hover:text-white'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        {darkHeader && <ModalHeader step={step} jenis={jenis} sourceLabel={sourceLabel} />}

        {step === 1 && (
          <div>
            <h4 className="mb-4 text-sm font-bold text-navy">Pilih Jenis Donasi</h4>
            <div className="mb-6 grid grid-cols-2 gap-2.5 min-[400px]:grid-cols-3 sm:gap-3">
              {jenisList.map((item) => {
                const val = item.key || String(item.id)
                const active = String(jenisId) === val
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setJenisId(val)}
                    className={`relative flex flex-col items-center gap-2 rounded-xl border px-3 py-5 text-center transition-all ${
                      active
                        ? 'border-primary bg-primary/[0.07] text-primary-dark shadow-[0_8px_20px_-12px_rgba(10,126,126,0.55)] ring-1 ring-primary'
                        : 'border-gray-200 text-navy hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    {active && (
                      <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                        <CheckIcon width={9} height={9} />
                      </span>
                    )}
                    <JenisIcon id={val} className={active ? 'text-primary' : 'text-primary/70'} />
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
            <div className="mb-3 grid grid-cols-2 gap-2.5 min-[400px]:grid-cols-3 sm:gap-3">
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
                        ? 'border-primary bg-primary/[0.07] text-primary-dark ring-1 ring-primary'
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
                        ? 'border-primary bg-primary/[0.07] text-primary-dark ring-1 ring-primary'
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
            <div className="mb-6 flex items-center justify-between rounded-xl bg-primary/[0.06] px-4 py-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-gray-500">Nominal donasi</span>
              <strong className="font-heading text-lg font-extrabold text-primary-dark">{formatRp(effectiveNominal)}</strong>
            </div>

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
              {banks.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBankId(b.id)}
                  className="flex w-full items-center gap-4 rounded-xl border border-gray-200 px-4 py-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  <BankBadge bank={b} />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-navy">{b.name}</div>
                    <div className="text-xs text-gray-400">{b.noRek}</div>
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
            <div className="mb-4 flex items-center justify-between gap-3 pr-9">
              <div className="flex min-w-0 items-center gap-2.5">
                <BankBadge bank={bank} size="sm" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-navy">{bank.name}</div>
                  <div className="truncate text-[11px] text-gray-400">a.n. {bank.owner || 'LAZIS PT PLN Batam'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBankId(null)}
                className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-[11px] font-semibold text-gray-500 transition-colors hover:border-primary/40 hover:text-primary"
              >
                Ganti
              </button>
            </div>

            {/* Total pembayaran — kartu gradient dengan hitung mundur */}
            <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-primary-dark p-5 text-center text-white">
              <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-white/55">Total Pembayaran</div>
              <div className="mt-1 font-heading text-[2rem] font-extrabold leading-none text-gold">{formatRp(effectiveNominal)}</div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10">
                <ClockIcon width={12} height={12} />
                Batas bayar {formatCountdown(secondsLeft)}
              </div>
              <p className="mt-2.5 text-[10px] text-white/45">Bayar tepat nominal ini — kelebihan tidak dikembalikan</p>
            </div>

            {/* Nomor rekening — angka besar + tombol salin menonjol */}
            <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.6px] text-gray-400">
                Nomor Rekening {bank.name}
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="break-all font-heading text-xl font-extrabold tracking-[0.06em] text-navy-dark">
                  {bank.noRek}
                </span>
                <button
                  type="button"
                  onClick={copyNoRek}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${
                    copied ? 'bg-green-100 text-green-700' : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckIcon width={13} height={13} />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <CopyIcon />
                      Salin
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4 flex items-start gap-2 rounded-xl bg-primary/[0.07] px-3.5 py-3 text-[11px] font-medium leading-snug text-primary-dark">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Sudah transfer? Klik &ldquo;Konfirmasi Pembayaran&rdquo; di bawah untuk menyelesaikan donasi Anda.
            </div>

            {/* Cara transfer */}
            <div className="mb-5 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.5px] text-gray-500">Cara Transfer</div>
              <ol className="flex flex-col gap-2.5">
                {[
                  'Pilih menu Transfer, lalu pilih Rekening Bank',
                  `Masukkan nomor rekening: ${bank.noRek}`,
                  `Masukkan nominal: ${formatRp(effectiveNominal)}`,
                  'Konfirmasi dan selesaikan transaksi',
                ].map((text, i) => (
                  <li key={text} className="flex items-start gap-2.5 text-[12px] leading-snug text-gray-600">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary-dark ring-1 ring-primary/20">
                      {i + 1}
                    </span>
                    {text}
                  </li>
                ))}
              </ol>
            </div>

            {submitError && (
              <p className="mb-3 text-center text-xs font-semibold text-coral">{submitError}</p>
            )}
            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirm}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_24px_-10px_rgba(10,126,126,0.55)] disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {submitting ? 'Mengirim…' : 'Konfirmasi Pembayaran'}
              {!submitting && <ArrowIcon />}
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold/25 to-primary/15 text-gold-dark ring-1 ring-gold/30">
              <CheckIcon width={28} height={28} />
            </div>
            <h3 className="mb-1 text-center font-heading text-2xl font-extrabold text-primary-dark">
              Konfirmasi Terkirim!
            </h3>
            <p className="mb-1 text-center text-sm text-gray-500">
              Tim kami akan memverifikasi pembayaran Anda dalam 1x24 jam.
            </p>
            <p className="mb-6 text-center text-xs font-semibold text-primary-dark">via {bank?.name}</p>

            <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-gray-50 p-5 text-sm ring-1 ring-black/[0.04]">
              <div className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-gray-500">Program</span>
                <strong className="text-right text-navy-dark">{jenis?.programLabel || jenis?.label}</strong>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-gray-500">Nominal</span>
                <strong className="text-right text-navy-dark">{formatRp(effectiveNominal)}</strong>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-gray-500">Bank</span>
                <strong className="text-right text-navy-dark">{bank?.name}</strong>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-gray-500">No. Rekening</span>
                <strong className="break-all text-right text-navy-dark">{bank?.noRek}</strong>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-gray-500">Status</span>
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
