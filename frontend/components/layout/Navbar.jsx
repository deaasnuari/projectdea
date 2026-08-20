'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// A small "you are here" tag that pops up under the current page's link,
// rather than a plain permanent underline — it remounts (and re-plays its
// pop-in) each time the active route changes.
function ActiveTag() {
  return (
    <span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] animate-pop-in whitespace-nowrap rounded-md bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-[0_6px_16px_rgba(0,0,0,0.3)]">
      <span className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-gold" />
      Sedang dibuka
    </span>
  )
}

// `solid` forces the dark bar to always show — for pages like /donatur/blog
// that don't have a dark hero image behind the navbar at the top of the page,
// where the default transparent-until-scrolled look would make the white
// nav text unreadable.
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
      // Slide away once the user is scrolling down past the hero, so the
      // pill never sits on top of the text it's covering; any upward scroll
      // brings it straight back, even by a pixel.
      setHidden(currentY > lastScrollY.current && currentY > 160)
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
      {/* The bar is detached from the viewport edges rather than spanning
          full-width — a floating pill, always faintly present against the
          hero so it reads as an object sitting on the page, then solidifying
          once there's a plain background behind it to blend into. */}
      <div
        className={`relative z-[1001] mx-auto flex max-w-[1120px] items-center justify-between rounded-full border py-2.5 pl-4 pr-2.5 transition-all duration-300 md:pl-6 md:pr-3 ${
          showSolid
            ? 'border-white/10 bg-navy-dark/90 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-md'
            : 'border-white/15 bg-navy-dark/25 shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-sm'
        } ${
          hidden && !menuOpen
            ? '-translate-y-[calc(100%+2rem)] opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-[1.03]">
          <img
            src="/images/logo lazis pln.png"
            alt="Lazis PLN Batam"
            className="h-9 w-auto rounded-full bg-white px-2.5 py-1.5 shadow-sm"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="flex items-center gap-9 max-[900px]:hidden">
          <Link href="/donatur#programs" className="relative navbar-link" onClick={closeMenu}>
            Program Kami
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
        </nav>

        {/* Auth (desktop) */}
        <div className="flex items-center gap-5 max-[900px]:hidden">
          <Link
            href="/login"
            className="btn btn-outline px-6 py-2.5 text-sm active:border-gold active:bg-gold active:text-navy"
          >
            Login
          </Link>
          <Link href="/register" className="btn btn-gold px-6 py-2.5 text-sm">
            Register
          </Link>
        </div>

        {/* Hamburger */}
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

      {/* Mobile menu overlay — kept as a sibling of the pill rather than
          nested inside it. The pill's backdrop-blur establishes a new
          containing block for `position: fixed` descendants, which would
          otherwise trap this full-screen panel inside the pill's own small
          box instead of covering the viewport. */}
      <nav
        id="mobile-nav"
        className={`fixed inset-0 z-[1000] hidden flex-col items-center justify-center gap-6 bg-navy-dark/[0.98] backdrop-blur-lg transition-transform duration-400 max-[900px]:flex ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Link href="/donatur#programs" className="navbar-link text-base" onClick={closeMenu}>
          Program Kami
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

        <div className="mt-4 flex items-center gap-5">
          <Link
            href="/login"
            className="btn btn-outline active:border-gold active:bg-gold active:text-navy"
            onClick={closeMenu}
          >
            Login
          </Link>
          <Link href="/register" className="btn btn-gold" onClick={closeMenu}>
            Register
          </Link>
        </div>
      </nav>
    </header>
  )
}
