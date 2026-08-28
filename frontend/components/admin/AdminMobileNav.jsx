'use client'

import { useRouter, usePathname } from 'next/navigation'
import { logoutAdmin } from '@/services/adminAuth'

const OPTIONS = [
  { value: '/admin', label: 'Dashboard' },
  { value: '/admin/konten-kami-peduli', label: 'Konten Situs' },
  { value: '/admin/blog', label: 'Blog & Kursus' },
  { value: '/admin/konten-tentang-kami', label: 'Konten Tentang Kami' },
  { value: '/admin/program', label: 'Daftar Program' },
  { value: '/admin/konten-kontak-kami', label: 'Konten Kontak Kami' },
  { value: '/admin/donatur', label: 'Informasi Donatur' },
  { value: '/admin/tim', label: 'Tim' },
  { value: '/admin/dokumentasi', label: 'Dokumentasi' },
]

// Sidebar admin disembunyikan di layar sempit (lihat AdminSidebar.jsx), jadi
// navigasi mobile-nya dipindah ke dropdown ini supaya tetap bisa berpindah
// halaman tanpa perlu sidebar geser/hamburger yang lebih rumit.
export default function AdminMobileNav() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logoutAdmin()
    router.push('/login')
  }

  return (
    <div className="hidden items-center gap-2 max-[900px]:flex">
      <select
        value={OPTIONS.find((o) => (o.value === '/admin' ? pathname === '/admin' : pathname.startsWith(o.value)))?.value ?? '/admin'}
        onChange={(e) => router.push(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-navy"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg bg-coral/10 px-3 py-2 text-xs font-semibold text-coral transition-colors hover:bg-coral/20"
      >
        Keluar
      </button>
    </div>
  )
}
