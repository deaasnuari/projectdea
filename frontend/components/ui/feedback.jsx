'use client'

import { useEffect, useState } from 'react'

// Sistem notifikasi + dialog konfirmasi milik aplikasi sendiri — supaya
// pesan "hapus?", "berhasil disimpan", "login dulu", dst. tidak lagi memakai
// window.confirm / window.alert bawaan browser yang menampilkan teks
// "localhost:3000 says…". Dipakai lewat import fungsi, tanpa context:
//   import { toast, confirmDialog } from '@/components/ui/feedback'
// dan <FeedbackHost /> dipasang sekali di root layout.

let seq = 0
const toastListeners = new Set()
const confirmListeners = new Set()

/** Munculkan notifikasi singkat. tone: 'success' | 'error' | 'info' */
export function toast(message, opts = {}) {
  const item = {
    id: ++seq,
    message,
    tone: opts.tone || 'info',
    duration: opts.duration ?? 3800,
  }
  toastListeners.forEach((fn) => fn(item))
  return item.id
}

/** Dialog konfirmasi. Mengembalikan Promise<boolean>. */
export function confirmDialog(opts = {}) {
  return new Promise((resolve) => {
    const req = {
      id: ++seq,
      title: opts.title || 'Konfirmasi',
      message: opts.message || '',
      confirmLabel: opts.confirmLabel || 'Ya, lanjutkan',
      cancelLabel: opts.cancelLabel || 'Batal',
      tone: opts.tone || 'danger', // 'danger' | 'primary'
      resolve,
    }
    confirmListeners.forEach((fn) => fn(req))
  })
}

const TONE_STYLES = {
  success: { bar: 'bg-green-500', icon: 'text-green-600', ring: 'ring-green-100' },
  error: { bar: 'bg-coral', icon: 'text-coral', ring: 'ring-coral/20' },
  info: { bar: 'bg-primary', icon: 'text-primary', ring: 'ring-primary/15' },
}

function ToastIcon({ tone }) {
  if (tone === 'success') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    )
  }
  if (tone === 'error') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16h.01" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  )
}

export default function FeedbackHost() {
  const [toasts, setToasts] = useState([])
  const [dialog, setDialog] = useState(null)

  useEffect(() => {
    const onToast = (item) => {
      setToasts((cur) => [...cur, item])
      if (item.duration > 0) {
        setTimeout(() => {
          setToasts((cur) => cur.filter((t) => t.id !== item.id))
        }, item.duration)
      }
    }
    const onConfirm = (req) => setDialog(req)
    toastListeners.add(onToast)
    confirmListeners.add(onConfirm)
    return () => {
      toastListeners.delete(onToast)
      confirmListeners.delete(onConfirm)
    }
  }, [])

  const closeDialog = (result) => {
    if (dialog) dialog.resolve(result)
    setDialog(null)
  }

  useEffect(() => {
    if (!dialog) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeDialog(false)
      if (e.key === 'Enter') closeDialog(true)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog])

  const dismiss = (id) => setToasts((cur) => cur.filter((t) => t.id !== id))

  return (
    <>
      {/* Tumpukan notifikasi — pojok kanan atas, di atas segalanya */}
      <div className="pointer-events-none fixed right-4 top-4 z-[3000] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => {
          const s = TONE_STYLES[t.tone] || TONE_STYLES.info
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 overflow-hidden rounded-xl border border-gray-100 bg-white p-3 pl-0 shadow-[0_18px_44px_-16px_rgba(6,30,40,0.4)] ring-1 ${s.ring}`}
            >
              <span className={`h-full w-1 self-stretch rounded-full ${s.bar}`} />
              <span className={`mt-0.5 shrink-0 ${s.icon}`}>
                <ToastIcon tone={t.tone} />
              </span>
              <p className="flex-1 py-0.5 text-[13px] leading-snug text-navy">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Tutup notifikasi"
                className="shrink-0 text-gray-300 transition-colors hover:text-gray-500"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      {/* Dialog konfirmasi */}
      {dialog && (
        <div
          className="fixed inset-0 z-[3100] flex items-center justify-center bg-navy-dark/70 p-4 backdrop-blur-sm"
          onClick={() => closeDialog(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-[400px] overflow-hidden rounded-tr-[1.75rem] rounded-bl-[1.75rem] rounded-tl-lg rounded-br-lg bg-white p-6 shadow-[0_32px_70px_-24px_rgba(6,30,40,0.55)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  dialog.tone === 'danger' ? 'bg-coral/10 text-coral' : 'bg-primary/10 text-primary'
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-base font-bold text-navy">{dialog.title}</h3>
                {dialog.message && (
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{dialog.message}</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => closeDialog(false)}
                className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                {dialog.cancelLabel}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => closeDialog(true)}
                className={`flex flex-[1.3] items-center justify-center rounded-xl py-2.5 text-sm font-bold text-white transition-all ${
                  dialog.tone === 'danger'
                    ? 'bg-coral hover:bg-coral-dark'
                    : 'bg-primary hover:bg-primary-dark'
                }`}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
