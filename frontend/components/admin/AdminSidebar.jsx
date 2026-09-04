'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logoutAdmin } from '@/services/adminAuth'

// Dikelompokkan jadi dua bagian (Utama & Konten) supaya menu yang jumlahnya
// makin banyak tetap gampang dipindai, bukan satu tumpukan panjang rata.
// Item yang belum punya halaman (href: null) ditandai "Segera".
const NAV_SECTIONS = [
  {
    label: 'Utama',
    items: [
      {
        href: '/admin',
        label: 'Dashboard',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
          </svg>
        ),
      },
      {
        href: '/admin/riwayat-donasi',
        label: 'Riwayat Donasi',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
          </svg>
        ),
      },
      {
        href: '/admin/pesan-masuk',
        label: 'Pesan Masuk',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Konten',
    items: [
      {
        href: '/admin/konten-kami-peduli',
        label: 'Konten Kami Peduli',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5" />
            <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        ),
      },
      {
        href: '/admin/blog',
        label: 'Blog & Kursus',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M4 4h13a3 3 0 013 3v13H7a3 3 0 01-3-3V4z" />
            <path d="M8 8h8M8 12h8M8 16h4" />
          </svg>
        ),
      },
      {
        href: '/admin/konten-tentang-kami',
        label: 'Konten Tentang Kami',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        ),
      },
      {
        href: '/admin/program',
        label: 'Daftar Program',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        ),
      },
      {
        href: '/admin/konten-kontak-kami',
        label: 'Konten Kontak Kami',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M4 4h16v12H5.17L4 17.17V4z" />
            <path d="M8 9h8M8 12h5" />
          </svg>
        ),
      },
      {
        href: '/admin/donatur',
        label: 'Informasi Donatur Kami Peduli',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        ),
      },
      {
        href: '/admin/tim',
        label: 'Tim',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        ),
      },
      {
        href: '/admin/dokumentasi',
        label: 'Dokumentasi Kami Peduli',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <rect x="2.5" y="6.5" width="13" height="11" rx="2" />
            <path d="M15.5 10.5l5-3v9l-5-3" />
          </svg>
        ),
      },
    ],
  },
]

const STORAGE_KEY = 'lazispln_admin_sidebar'

export default function AdminSidebar({ mobileOpen = false, onClose = () => {} }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  // Rail (ikon-saja) hanya berlaku di desktop. Di HP/iPad drawer selalu penuh.
  const rail = collapsed && isDesktop

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === 'collapsed')
    } catch {
      /* localStorage tidak tersedia — biarkan sidebar terbuka */
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'collapsed' : 'open')
      } catch {
        /* abaikan */
      }
      return next
    })
  }

  const handleLogout = async () => {
    await logoutAdmin()
    router.push('/login')
  }

  return (
    <>
      {/* Latar gelap di belakang drawer (hanya HP/iPad) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-navy/50 transition-opacity min-[900px]:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-white/10 bg-navy-dark text-white transition-transform duration-200 ease-in-out min-[900px]:static min-[900px]:z-auto min-[900px]:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full min-[900px]:translate-x-0'
        } ${rail ? 'min-[900px]:w-16' : 'min-[900px]:w-64'}`}
      >
        <div
          className={`flex border-b border-white/10 ${
            rail ? 'flex-col items-center gap-2 px-2 py-4' : 'items-center gap-2 px-3 py-4'
          }`}
        >
          <Link
            href="/admin"
            onClick={onClose}
            className={`flex items-center ${rail ? '' : 'min-w-0 flex-1 gap-2.5'}`}
          >
            <img
              src="/images/logo lazis pln.png"
              alt="Lazis PLN Batam"
              className={`shrink-0 rounded-md bg-white ${
                rail ? 'h-8 w-10 object-contain p-1' : 'h-7 w-auto px-1.5 py-1'
              }`}
            />
            {!rail && (
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="whitespace-nowrap font-heading text-xs font-bold uppercase tracking-[0.08em]">
                  Admin Panel
                </span>
                <span className="truncate text-[10px] font-normal text-white/45">Lembaga Zakat &amp; Shadaqah</span>
              </span>
            )}
          </Link>

          {/* Perkecil/perluas — desktop saja */}
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? 'Perluas menu' : 'Perkecil menu'}
            aria-label={collapsed ? 'Perluas menu' : 'Perkecil menu'}
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white min-[900px]:flex"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15" className={collapsed ? 'rotate-180' : ''}>
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Tutup drawer — HP/iPad saja */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white min-[900px]:hidden"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              {rail ? (
                <div className="mx-2 mb-1.5 border-t border-white/10" />
              ) : (
                <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
                  {section.label}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  if (!item.href) {
                    return (
                      <span
                        key={item.label}
                        title={rail ? `${item.label} (Segera)` : undefined}
                        className={`flex cursor-not-allowed items-center rounded-lg text-[13px] font-medium text-white/30 ${
                          rail ? 'justify-center py-2.5' : 'gap-3 px-3 py-2'
                        }`}
                      >
                        {item.icon}
                        {!rail && (
                          <>
                            {item.label}
                            <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em]">
                              Segera
                            </span>
                          </>
                        )}
                      </span>
                    )
                  }

                  const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      title={rail ? item.label : undefined}
                      className={`flex items-center rounded-lg text-[13px] transition-colors ${
                        rail ? 'justify-center py-2.5' : 'gap-3 px-3 py-2'
                      } ${
                        active
                          ? 'bg-gold font-semibold text-navy'
                          : 'font-medium text-white/70 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      {item.icon}
                      {!rail && item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          {/* Kartu profil admin dipindah ke ujung kanan topbar. Di sini hanya
              tersisa aksi yang harus selalu kelihatan. */}
          <Link
            href="/admin/daftar-akun"
            onClick={onClose}
            title={rail ? 'Daftar Akun Baru' : undefined}
            className={`flex w-full items-center rounded-lg text-[13px] font-medium text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white ${
              rail ? 'justify-center py-2.5' : 'gap-3 px-3 py-2'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
            {!rail && 'Daftar Akun Baru'}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            title={rail ? 'Keluar' : undefined}
            aria-label="Keluar"
            className={`mt-0.5 flex w-full items-center rounded-lg text-[13px] font-semibold text-coral transition-colors hover:bg-coral/10 ${
              rail ? 'justify-center py-2.5' : 'gap-3 px-3 py-2'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            {!rail && 'Keluar'}
          </button>
        </div>
      </aside>
    </>
  )
}
