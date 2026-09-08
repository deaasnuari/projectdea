'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/donatur#programs', label: 'Kami Peduli', match: null },
  { href: '/donatur/blog', label: 'Blog', match: '/donatur/blog' },
  { href: '/donatur/tentang-kami', label: 'Tentang Kami', match: '/donatur/tentang-kami' },
  { href: '/donatur/program', label: 'Daftar Program', match: '/donatur/program' },
  { href: '/donatur/kontak-kami', label: 'Kontak Kami', match: '/donatur/kontak-kami' },
]

//ini fungsi untuk menampilkan tag "Sedang dibuka" di navbar ketika user berada di
// halaman blog, tentang kami, dan daftar program. Hanya di layar besar — di HP
// navigasinya rapat & bisa digeser, jadi tooltip melayang malah menutupi menu.
function ActiveTag() {
  return (
    <span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] hidden animate-pop-in whitespace-nowrap rounded-md bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-[0_6px_16px_rgba(0,0,0,0.3)] min-[900px]:block">
      <span className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-gold" />
      Sedang dibuka
    </span>
  )
}

//ini fungsi untuk menampilkan navbar di halaman donatur
export default function Navbar({ solid = false }) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setIsScrolled(currentY > 50)
      //ini untuk menyembunyikan navbar ketika scroll ke bawah dan menampilkan ketika scroll ke atas
      setHidden(currentY > lastScrollY.current && currentY > 24)
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const showSolid = isScrolled || solid

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] px-4 pt-4 md:px-6 md:pt-5">
      {/* Bar navbar ini sengaja tidak menempel di tepi layar (bukan
          full-width) — dibuat seperti pil yang mengambang, tampil samar di
          atas gambar hero seolah objek yang diletakkan di halaman, lalu
          jadi solid begitu ada background polos di belakangnya. */}
      <div
        className={`relative z-[1001] mx-auto flex max-w-[1080px] items-center gap-1.5 rounded-full border px-2.5 py-2 transition-all duration-300 sm:gap-2 sm:px-4 sm:py-2.5 md:px-6 ${
          showSolid
            ? 'border-white/10 bg-navy-dark/90 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-md'
            : 'border-white/15 bg-navy-dark/25 shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-sm'
        } ${
          hidden
            ? '-translate-y-[calc(100%+2rem)] opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Logo situs — di HP dikecilkan supaya menu tetap muat sebaris */}
        <Link
          href="/"
          className="flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.03]"
        >
          <img
            src="/images/logo lazis pln.png"
            alt="Lazis PLN Batam"
            width="1080"
            height="387"
            decoding="async"
            className="h-3.5 w-auto sm:h-6 md:h-8"
          />
        </Link>

        {/* Menu navigasi — sama seperti tampilan laptop di semua ukuran,
            hanya diperkecil di HP: font & jarak lebih rapat, dan kalau
            masih belum muat, baris menu ini yang bisa digeser ke samping
            (bukan halamannya). Mulai layar ≥900px, menu ini di-posisikan
            absolut di tengah pil supaya tetap center berapa pun lebar logo. */}
        <nav
          className="no-scrollbar flex min-w-0 flex-1 items-center justify-between gap-2 overflow-x-auto whitespace-nowrap pl-2 [&_a]:text-[8px] [&_a]:normal-case [&_a]:tracking-normal min-[400px]:gap-2.5 min-[400px]:[&_a]:text-[9px] sm:absolute sm:left-1/2 sm:w-max sm:flex-none sm:-translate-x-1/2 sm:justify-center sm:gap-5 sm:overflow-visible sm:pl-0 sm:[&_a]:text-[10px] min-[900px]:gap-8 min-[900px]:[&_a]:text-xs min-[900px]:[&_a]:uppercase min-[900px]:[&_a]:tracking-[0.08em]"
        >
          {NAV_ITEMS.map((item) => {
            const active = item.match && pathname === item.match
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative ${active ? 'navbar-link-active' : 'navbar-link'}`}
              >
                {item.label}
                {active && <ActiveTag />}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
