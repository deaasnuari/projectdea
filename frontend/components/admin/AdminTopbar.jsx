'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AdminProfileMenu from '@/components/admin/AdminProfileMenu'

// Judul halaman ditentukan dari URL supaya topbar tidak kosong di sisi kiri
// dan admin tahu sedang di menu mana. Urutan penting: yang lebih spesifik dulu,
// "/admin" dicek paling akhir dengan pencocokan persis.
const PAGE_TITLES = [
  ['/admin/riwayat-donasi', 'Riwayat Donasi'],
  ['/admin/pesan-masuk', 'Pesan Masuk'],
  ['/admin/konten-kami-peduli', 'Konten Kami Peduli'],
  ['/admin/konten-tentang-kami', 'Konten Tentang Kami'],
  ['/admin/konten-kontak-kami', 'Konten Kontak Kami'],
  ['/admin/blog', 'Blog & Kursus'],
  ['/admin/program', 'Daftar Program'],
  ['/admin/donatur', 'Informasi Donatur Kami Peduli'],
  ['/admin/dokumentasi', 'Dokumentasi Kami Peduli'],
  ['/admin/daftar-akun', 'Daftar Akun Baru'],
  ['/admin/tim', 'Tim'],
  ['/admin', 'Dashboard'],
]

function titleFor(pathname) {
  const hit = PAGE_TITLES.find(([href]) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href),
  )
  return hit ? hit[1] : 'Panel Admin'
}

export default function AdminTopbar() {
  const pathname = usePathname()
  const title = titleFor(pathname)

  return (
    <header className="sticky top-0 z-30 hidden h-14 items-center justify-between border-b border-gray-200 bg-white px-6 min-[900px]:flex sm:px-10">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Panel Admin</span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-navy">{title}</span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/donatur"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <path d="M15 3h6v6M10 14L21 3" />
          </svg>
          Lihat Situs
        </Link>
        <span className="h-5 w-px bg-gray-200" />
        <AdminProfileMenu />
      </div>
    </header>
  )
}
