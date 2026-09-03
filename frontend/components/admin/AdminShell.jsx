'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

export default function AdminShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Tutup drawer setiap pindah halaman.
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Kunci scroll body & tutup dengan Escape saat drawer terbuka.
  useEffect(() => {
    if (!mobileOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header HP/iPad — sidebar disembunyikan, akses lewat hamburger */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 min-[900px]:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-navy transition-colors hover:bg-gray-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="18" height="18">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <span className="min-w-0 flex-1 truncate font-heading text-sm font-bold text-navy">
            Admin Lazis PLN Batam
          </span>
          <Link
            href="/donatur"
            className="shrink-0 text-xs font-semibold text-gray-500 transition-colors hover:text-primary"
          >
            Lihat Situs
          </Link>
        </header>

        <AdminTopbar />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  )
}
