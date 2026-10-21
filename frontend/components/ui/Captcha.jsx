'use client'

import { useCallback, useEffect, useState } from 'react'
import { getApiBase } from '@/services/apiBase'

// Verifikasi "bukan robot" untuk form publik: soal hitung sederhana dari
// backend sendiri (tanpa layanan pihak ketiga). Setiap token hanya sekali
// pakai — ubah `resetKey` (mis. naikkan angkanya) setelah form dikirim,
// berhasil maupun gagal, supaya soal baru dimuat.
//
// onChange({ captchaToken, captchaAnswer }) dipanggil tiap jawaban berubah.
export default function Captcha({ onChange, resetKey = 0, className = '' }) {
  const [challenge, setChallenge] = useState(null)
  const [answer, setAnswer] = useState('')
  const [failed, setFailed] = useState(false)

  const load = useCallback(async () => {
    setFailed(false)
    setAnswer('')
    setChallenge(null)
    try {
      const res = await fetch(`${getApiBase()}/api/captcha`, { cache: 'no-store' })
      if (!res.ok) throw new Error('captcha')
      const c = await res.json()
      setChallenge(c)
      onChange?.({ captchaToken: c.token, captchaAnswer: '' })
    } catch {
      setFailed(true)
      onChange?.({ captchaToken: '', captchaAnswer: '' })
    }
  }, [onChange])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  const onInput = (v) => {
    const clean = v.replace(/[^\d-]/g, '').slice(0, 4)
    setAnswer(clean)
    onChange?.({ captchaToken: challenge?.token || '', captchaAnswer: clean })
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 ${className}`}>
      <span className="text-xs font-semibold text-gray-600">Verifikasi:</span>
      {failed ? (
        <button type="button" onClick={load} className="text-xs font-semibold text-primary-dark underline">
          Gagal memuat soal — coba lagi
        </button>
      ) : (
        <>
          <span className="min-w-[72px] rounded-md bg-white px-2.5 py-1 text-center text-sm font-bold tabular-nums text-navy ring-1 ring-gray-200" aria-live="polite">
            {challenge ? challenge.question : '…'}
          </span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            aria-label="Jawaban verifikasi"
            placeholder="Jawaban"
            value={answer}
            onChange={(e) => onInput(e.target.value)}
            className="w-20 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm font-semibold text-navy outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={load}
            aria-label="Ganti soal verifikasi"
            title="Ganti soal"
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200 hover:text-navy"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
              <path d="M16 10a6 6 0 11-1.8-4.3M16 3v4h-4" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
