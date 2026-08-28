'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logoutAdmin } from '@/services/adminAuth'

// Dikelompokkan jadi dua bagian (Utama & Konten) supaya menu yang jumlahnya
// makin banyak tetap gampang dipindai, bukan satu tumpukan panjang rata.
// Item yang belum punya halaman (href: null) ditandai "Segera" — dipertahankan
// tetap terlihat (bukan disembunyikan) mengikuti pola yang sudah ada
// sebelumnya untuk "Verifikasi Donasi".
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
        href: null,
        label: 'Riwayat Donasi',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Konten',
    items: [
      {
        // Judul/teks hero & judul section "Kami Peduli" diedit langsung di
        // halaman yang tampilannya sama seperti publik (di dalam /admin).
        // Daftar video & foto dikelola di menu "Dokumentasi".
        href: '/admin/konten-kami-peduli',
        label: 'Konten Situs',
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
        // Sama seperti "Konten Situs": edit langsung di halaman "Tentang Kami".
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
        // Edit langsung di halaman "Kontak Kami".
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
        label: 'Informasi Donatur',
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
        label: 'Dokumentasi',
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

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logoutAdmin()
    router.push('/login')
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-navy-dark text-white max-[900px]:hidden">
      <Link href="/admin" className="flex items-center gap-2.5 px-6 py-6">
        <img
          src="/images/logo lazis pln.png"
          alt="Lazis PLN Batam"
          className="h-8 w-auto rounded-full bg-white px-2 py-1"
        />
        <span className="font-heading text-[11px] font-bold uppercase leading-tight tracking-[0.06em]">
          Admin Panel
          <br />
          <span className="text-[10px] font-normal normal-case tracking-normal text-white/50">
            Lembaga Zakat & Shadaqah
          </span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 pb-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
              {section.label}
            </p>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                if (!item.href) {
                  return (
                    <span
                      key={item.label}
                      className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/30"
                    >
                      {item.icon}
                      {item.label}
                      <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em]">
                        Segera
                      </span>
                    </span>
                  )
                }

                const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active ? 'bg-gold text-navy' : 'text-white/70 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-navy">
            A
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-white">Administrator</p>
            <p className="truncate text-xs text-white/40">admin@plnbatam.com</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/70 transition-colors hover:bg-coral/20 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  )
}
