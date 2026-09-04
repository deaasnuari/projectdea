'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { logoutAdmin, getAdminProfile } from '@/services/adminAuth'

function formatLoginAt(ms) {
  if (!ms) return null
  try {
    return new Date(ms).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return null
  }
}

// Kartu profil admin — dulu di kaki sidebar, sekarang di ujung kanan topbar.
// Klik untuk buka detail akun (peran, panel, waktu masuk) + tombol keluar.
export default function AdminProfileMenu({ compact = false }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    getAdminProfile().then(setProfile)
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleLogout = async () => {
    await logoutAdmin()
    router.push('/login')
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center rounded-full border transition-colors ${
          open ? 'border-gray-300 bg-gray-50' : 'border-transparent hover:bg-gray-50'
        } ${compact ? 'gap-0 p-0.5' : 'gap-2 py-1 pl-1 pr-2'}`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy">
          A
        </span>
        {!compact && (
          <>
            <span className="leading-tight text-left">
              <span className="block text-[13px] font-semibold text-navy">Administrator</span>
              <span className="block text-[11px] text-gray-400">@{profile?.username || 'admin'}</span>
            </span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              width="14"
              height="14"
              className={`shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white text-navy shadow-[0_16px_40px_-12px_rgba(6,30,40,0.5)]">
          <div className="flex items-center gap-3 border-b border-gray-100 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-base font-bold text-navy">
              A
            </span>
            <div className="min-w-0">
              <p className="truncate font-heading text-sm font-bold">Administrator</p>
              <p className="truncate text-xs text-gray-400">@{profile?.username || 'admin'}</p>
            </div>
          </div>
          <dl className="flex flex-col gap-2 p-4 text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-gray-400">Peran</dt>
              <dd className="font-semibold">Administrator</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-gray-400">Panel</dt>
              <dd className="font-semibold">LAZIS PLN Batam</dd>
            </div>
            {formatLoginAt(profile?.loginAt) && (
              <div className="flex justify-between gap-3">
                <dt className="text-gray-400">Masuk</dt>
                <dd className="font-semibold">{formatLoginAt(profile.loginAt)}</dd>
              </div>
            )}
          </dl>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-3 text-left text-xs font-bold text-coral transition-colors hover:bg-coral/5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Keluar
          </button>
        </div>
      )}
    </div>
  )
}
