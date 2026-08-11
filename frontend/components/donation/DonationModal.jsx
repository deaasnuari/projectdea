'use client'

import { useEffect, useState } from 'react'

const JENIS_DONASI = [
  { id: 'zakat-profesi', label: 'Zakat Profesi', programLabel: 'Zakat Profesi Karyawan', icon: '⚡' },
  { id: 'zakat-maal', label: 'Zakat Maal', programLabel: 'Zakat Maal', icon: '🏦' },
  { id: 'infaq', label: 'Infaq', programLabel: 'Infaq', icon: '📖' },
  { id: 'shadaqah', label: 'Shadaqah', programLabel: 'Shadaqah', icon: '🤲' },
  { id: 'fidyah', label: 'Fidyah', programLabel: 'Fidyah', icon: '🌙' },
  { id: 'wakaf', label: 'Wakaf', programLabel: 'Wakaf', icon: '🕌' },
]

const NOMINAL_PRESETS = [50000, 100000, 250000, 500000, 'lainnya', 1000000]

const BANKS = [
  { id: 'bsi', name: 'Bank Syariah Indonesia', short: 'BSI', va: '890052060000', badgeClass: 'bg-[#00754A]' },
  { id: 'mandiri', name: 'Bank Mandiri', short: 'MDR', va: '889089829000', badgeClass: 'bg-[#003D79]' },
  { id: 'bri', name: 'BRI', short: 'BRI', va: '002601099999509', badgeClass: 'bg-[#00529C]' },
]

const STEPS = [
  { n: 1, label: 'Jenis Donasi' },
  { n: 2, label: 'Nominal & Data' },
  { n: 3, label: 'Pilih Bank VA' },
]

const BATAS_BAYAR_START = 23 * 3600 + 59 * 60 + 57 // 23:59:57

function formatRp(n) {
  return 'Rp ' + Math.round(n || 0).toLocaleString('id-ID')
}

function formatCountdown(totalSeconds) {
  const s = Math.max(0, totalSeconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (v) => String(v).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(sec)}`
}

function StepIndicator({ step }) {
  return (
    <div className="mb-6 flex items-start">
      {STEPS.map((s, i) => (
        <div key={s.n} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
          <div className="flex flex-col items-center gap-1.5">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                step > s.n ? 'bg-navy text-white' : step === s.n ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step > s.n ? '✓' : s.n}
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
            <div className={`mx-2 mb-4 h-px flex-1 ${step > s.n ? 'bg-navy' : 'bg-gray-200'}`} />
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

export default function DonationModal({ open, onClose }) {
  const [step, setStep] = useState(1)
  const [jenisId, setJenisId] = useState(null)

  const [nominal, setNominal] = useState(100000)
  const [customNominal, setCustomNominal] = useState('')
  const [anonim, setAnonim] = useState(false)
  const [nama, setNama] = useState('')
  const [nik, setNik] = useState('')
  const [niat, setNiat] = useState('')

  const [bankId, setBankId] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(BATAS_BAYAR_START)
  const [copied, setCopied] = useState(false)

  const jenis = JENIS_DONASI.find((j) => j.id === jenisId) || null
  const bank = BANKS.find((b) => b.id === bankId) || null
  const effectiveNominal = customNominal ? Number(customNominal) : nominal

  // Reset the whole flow every time the modal is opened fresh.
  useEffect(() => {
    if (!open) return
    setStep(1)
    setJenisId(null)
    setNominal(100000)
    setCustomNominal('')
    setAnonim(false)
    setNama('')
    setNik('')
    setNiat('')
    setBankId(null)
    setSecondsLeft(BATAS_BAYAR_START)
    setCopied(false)
  }, [open])

  // "Batas bayar" countdown, only while a bank VA is showing.
  useEffect(() => {
    if (step !== 3 || !bank) return
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [step, bank])

  // Simulates the bank notifying us the transfer has landed — no click needed,
  // it just moves on once the "payment" comes in.
  useEffect(() => {
    if (step !== 3 || !bank) return
    const id = setTimeout(() => setStep(4), 6000)
    return () => clearTimeout(id)
  }, [step, bank])

  if (!open) return null

  const canGoStep2 = Boolean(jenis)
  const canGoStep3 = effectiveNominal > 0 && (anonim || nama.trim().length > 0)

  const copyVa = async () => {
    if (!bank) return
    try {
      await navigator.clipboard.writeText(bank.va)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard permission denied — ignore, the number is still visible to copy manually.
    }
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-5 top-5 text-gray-400 transition-colors hover:text-gray-600"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {(step === 1 || step === 2) && (
          <>
            <div className="mb-6 flex items-center gap-3 pr-8">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary-dark">
                {jenis ? (
                  jenis.icon
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
                    <span className="text-2xl">{item.icon}</span>
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
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Lanjut →
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
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-primary">
              <span className="text-sm font-semibold text-gray-500">Rp</span>
              <input
                id="nominal-lain-input"
                type="number"
                min="0"
                placeholder="Nominal lain"
                value={customNominal}
                onChange={(e) => setCustomNominal(e.target.value)}
                className="flex-1 text-sm font-semibold text-gray-800"
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
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 transition-colors focus:border-primary disabled:opacity-50"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="NIK karyawan (opsional)"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 transition-colors focus:border-primary"
              />
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Niat / catatan donasi (opsional)"
                value={niat}
                onChange={(e) => setNiat(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 transition-colors focus:border-primary"
              />
            </div>

            <div className="flex gap-3 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-gray-200 py-3.5 text-sm font-bold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                ← Kembali
              </button>
              <button
                type="button"
                disabled={!canGoStep3}
                onClick={() => setStep(3)}
                className="flex-[1.4] rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Pilih Bank Pembayaran →
              </button>
            </div>
          </div>
        )}

        {step === 3 && !bank && (
          <div>
            <h4 className="mb-1 pr-8 text-sm font-bold text-navy">Pilih Bank Virtual Account</h4>
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
                    <div className="text-xs text-gray-400">Virtual Account</div>
                  </div>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="text-gray-300">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full rounded-xl border border-gray-200 py-3.5 text-sm font-bold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              ← Kembali
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
                  <div className="text-xs text-gray-400">Virtual Account · LAZIS PLN Batam</div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[9px] font-semibold uppercase tracking-[0.5px] text-gray-400">Batas Bayar</div>
                <div className="font-heading text-base font-bold text-primary-dark">{formatCountdown(secondsLeft)}</div>
              </div>
            </div>

            <div className="mb-5 flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-xs font-semibold text-primary-dark">
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-primary" />
              Menunggu pembayaran masuk — halaman ini akan otomatis lanjut begitu transfer Anda terdeteksi.
            </div>

            <div className="mb-5 rounded-xl bg-primary/5 py-6 text-center">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-gray-400">Total Pembayaran</div>
              <div className="font-heading text-3xl font-extrabold text-primary-dark">{formatRp(effectiveNominal)}</div>
              <div className="mt-1 text-xs text-gray-400">Bayar tepat nominal ini — kelebihan tidak dikembalikan</div>
            </div>

            <div className="mb-5 rounded-xl border border-gray-200 p-4">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-gray-400">Nomor Virtual Account</div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BankBadge bank={bank} size="sm" />
                  <div>
                    <div className="font-heading text-lg font-bold tracking-wide text-navy-dark">{bank.va}</div>
                    <div className="text-xs text-gray-400">{bank.name}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyVa}
                  className="shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-dark transition-colors hover:bg-primary/20"
                >
                  {copied ? 'Disalin ✓' : 'Salin'}
                </button>
              </div>
            </div>

            <div className="mb-5 overflow-hidden rounded-xl bg-gray-50">
              <div className="bg-primary/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.5px] text-primary-dark">
                Cara Pembayaran ATM / Mobile Banking
              </div>
              <div className="flex flex-col gap-3 px-4 py-4">
                {[
                  'Pilih menu Transfer → Virtual Account',
                  `Masukkan nomor VA: ${bank.va}`,
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

            <button
              type="button"
              onClick={() => setBankId(null)}
              className="w-full text-center text-xs font-semibold text-gray-400 transition-colors hover:text-primary"
            >
              ← Ganti Bank
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="pr-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="30" height="30" className="text-primary">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mb-1 text-center font-heading text-2xl font-extrabold text-primary-dark">Donasi Diterima!</h3>
            <p className="mb-1 text-center text-sm text-gray-500">Pembayaran Anda telah berhasil dikonfirmasi.</p>
            <p className="mb-6 text-center text-xs font-semibold text-primary-dark">via {bank?.name}</p>

            <div className="mb-6 flex flex-col gap-3 rounded-xl bg-primary/5 p-5 text-sm">
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
                <span className="text-gray-500">No. VA</span>
                <strong className="text-navy-dark">{bank?.va}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Status</span>
                <strong className="text-primary-dark">✅ Lunas</strong>
              </div>
            </div>

            <p className="mb-6 text-center text-sm leading-relaxed text-gray-500">
              Jazakallahu khairan atas kebaikan Anda 🤝
              <br />
              Semoga menjadi amal jariyah yang berkah.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-dark"
            >
              Selesai
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
