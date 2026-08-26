import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminMobileNav from '@/components/admin/AdminMobileNav'
import AdminAuthGate from '@/components/admin/AdminAuthGate'

export const metadata = {
  title: 'Panel Admin — Lazis PLN Batam',
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthGate>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 min-[900px]:hidden">
            <span className="font-heading text-sm font-bold text-navy">Admin Lazis PLN Batam</span>
            <AdminMobileNav />
          </header>

          {/* Topbar desktop — dulu link "Kembali ke Situs" ada di footer
              sidebar, dipindah ke sini (mengikuti tata letak yang diminta)
              supaya tetap ada aksesnya tanpa menambah baris di sidebar. */}
          <header className="hidden items-center justify-end gap-4 border-b border-gray-200 bg-white px-6 py-3 min-[900px]:flex sm:px-10">
            <Link
              href="/donatur"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-primary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <path d="M15 3h6v6M10 14L21 3" />
              </svg>
              Lihat Situs
            </Link>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              A
            </span>
          </header>

          <main className="flex-1 px-6 py-8 sm:px-10">{children}</main>
        </div>
      </div>
    </AdminAuthGate>
  )
}
