'use client'

import { useCallback, useEffect, useState } from 'react'
import { getApiBase } from '@/services/apiBase'

// Verifikasi "bukan robot" untuk form publik: gambar 4 huruf acak dari
// backend sendiri (tanpa layanan pihak ketiga); pengunjung mengetik hurufnya.
// Setiap token hanya sekali pakai — ubah `resetKey` (mis. naikkan angkanya) setelah
// form dikirim, berhasil maupun gagal, supaya gambar baru dimuat.
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
    const clean = v.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()
    setAnswer(clean)
    onChange?.({ captchaToken: challenge?.token || '', captchaAnswer: clean })
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 ${className}`}>
      <span className="text-xs font-semibold text-gray-600">Verifikasi:</span>
      {failed ? (
        <button type="button" onClick={load} className="text-xs font-semibold text-primary-dark underline">
          Gagal memuat gambar — coba lagi
        </button>
      ) : (
        <>
          <span className="flex h-[44px] w-[128px] items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-gray-200">
            {challenge ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={challenge.image} alt="Gambar verifikasi: 4 huruf acak" width={128} height={44} draggable={false} />
            ) : (
              <span className="text-sm text-gray-400">…</span>
            )}
          </span>
          <input
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={4}
            aria-label="Ketik 4 huruf pada gambar"
            placeholder="4 huruf"
            value={answer}
            onChange={(e) => onInput(e.target.value)}
            className="w-24 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm font-semibold uppercase tracking-widest text-navy outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={load}
            aria-label="Ganti gambar verifikasi"
            title="Ganti gambar"
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
