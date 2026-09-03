'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

//ini fungsi untuk menampilkan tag "Sedang dibuka" di navbar ketika user berada di halaman blog, tentang kami, dan daftar program
function ActiveTag() {
  return (
    <span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] animate-pop-in whitespace-nowrap rounded-md bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-[0_6px_16px_rgba(0,0,0,0.3)]">
      <span className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-gold" />
      Sedang dibuka
    </span>
  )
}

//ini fungsi untuk menampilkan navbar di halaman donatur
export default function Navbar({ solid = false }) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  const toggleMenu = () => {
    setMenuOpen((open) => {
      const next = !open
      document.body.style.overflow = next ? 'hidden' : ''
      return next
    })
  }

  const showSolid = isScrolled || solid

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] px-4 pt-4 md:px-6 md:pt-5">
      {/* Bar navbar ini sengaja tidak menempel di tepi layar (bukan
          full-width) — dibuat seperti pil yang mengambang, tampil samar di
          atas gambar hero seolah objek yang diletakkan di halaman, lalu
          jadi solid begitu ada background polos di belakangnya. */}
      <div
        className={`relative z-[1001] mx-auto flex max-w-[1080px] items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 md:px-6 ${
          showSolid
            ? 'border-white/10 bg-navy-dark/90 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-md'
            : 'border-white/15 bg-navy-dark/25 shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-sm'
        } ${
          hidden && !menuOpen
            ? '-translate-y-[calc(100%+2rem)] opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Logo situs */}
        <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-[1.03]">
          <img
            src="/images/logo lazis pln.png"
            alt="Lazis PLN Batam"
            className="h-9 w-auto rounded-full bg-white px-2.5 py-1.5 shadow-sm"
          />
        </Link>

        {/* Menu navigasi versi desktop — diposisikan absolut di tengah pil
            supaya tetap center berapa pun lebar logo. w-max + whitespace-nowrap
            memastikan tiap menu tetap satu baris (mis. "Kami Peduli" tidak
            patah jadi dua baris). */}
        <nav className="absolute left-1/2 top-1/2 flex w-max -translate-x-1/2 -translate-y-1/2 items-center gap-8 whitespace-nowrap max-[900px]:hidden">
          <Link href="/donatur#programs" className="relative navbar-link" onClick={closeMenu}>
            Kami Peduli
          </Link>
          <Link
            href="/donatur/blog"
            className={`relative ${pathname === '/donatur/blog' ? 'text-xs font-semibold uppercase tracking-[0.08em] text-gold' : 'navbar-link'}`}
            onClick={closeMenu}
          >
            Blog
            {pathname === '/donatur/blog' && <ActiveTag />}
          </Link>
          <Link
            href="/donatur/tentang-kami"
            className={`relative ${pathname === '/donatur/tentang-kami' ? 'text-xs font-semibold uppercase tracking-[0.08em] text-gold' : 'navbar-link'}`}
            onClick={closeMenu}
          >
            Tentang Kami
            {pathname === '/donatur/tentang-kami' && <ActiveTag />}
          </Link>
          <Link
            href="/donatur/program"
            className={`relative ${pathname === '/donatur/program' ? 'text-xs font-semibold uppercase tracking-[0.08em] text-gold' : 'navbar-link'}`}
            onClick={closeMenu}
          >
            Daftar Program
            {pathname === '/donatur/program' && <ActiveTag />}
          </Link>
          <Link
            href="/donatur/kontak-kami"
            className={`relative ${pathname === '/donatur/kontak-kami' ? 'text-xs font-semibold uppercase tracking-[0.08em] text-gold' : 'navbar-link'}`}
            onClick={closeMenu}
          >
            Kontak Kami
            {pathname === '/donatur/kontak-kami' && <ActiveTag />}
          </Link>
        </nav>

        {/* Tombol menu hamburger (untuk mobile) */}
        <button
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          className="hidden flex-col gap-[5px] p-1 max-[900px]:flex"
        >
          <span
            className={`block h-0.5 w-6 rounded bg-white transition-transform duration-300 ${
              menuOpen ? 'translate-x-[5px] translate-y-[5px] rotate-45' : ''
            }`}
          />
          <span className={`block h-0.5 w-6 rounded bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span
            className={`block h-0.5 w-6 rounded bg-white transition-transform duration-300 ${
              menuOpen ? 'translate-x-[5px] -translate-y-[5px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/*ini adalah menu navigasi untuk versi mobile, yang akan muncul ketika tombol hamburger diklik*/}
      <nav
        id="mobile-nav"
        className={`fixed inset-0 z-[1000] hidden flex-col items-center justify-center gap-6 bg-navy-dark/[0.98] backdrop-blur-lg transition-transform duration-400 max-[900px]:flex ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Link href="/donatur#programs" className="navbar-link text-base" onClick={closeMenu}>
          Kami Peduli
        </Link>
        <Link
          href="/donatur/blog"
          className={pathname === '/donatur/blog' ? 'navbar-link-active text-base' : 'navbar-link text-base'}
          onClick={closeMenu}
        >
          Blog
        </Link>
        <Link
          href="/donatur/tentang-kami"
          className={pathname === '/donatur/tentang-kami' ? 'navbar-link-active text-base' : 'navbar-link text-base'}
          onClick={closeMenu}
        >
          Tentang Kami
        </Link>
        <Link
          href="/donatur/program"
          className={pathname === '/donatur/program' ? 'navbar-link-active text-base' : 'navbar-link text-base'}
          onClick={closeMenu}
        >
          Daftar Program
        </Link>
        <Link
          href="/donatur/kontak-kami"
          className={pathname === '/donatur/kontak-kami' ? 'navbar-link-active text-base' : 'navbar-link text-base'}
          onClick={closeMenu}
        >
          Kontak Kami
        </Link>
      </nav>
    </header>
  )
}
