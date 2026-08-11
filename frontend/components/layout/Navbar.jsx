'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// `solid` forces the dark bar to always show — for pages like /donatur/blog
// that don't have a dark hero image behind the navbar at the top of the page,
// where the default transparent-until-scrolled look would make the white
// nav text unreadable.
export default function Navbar({ solid = false }) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1000] py-4 transition-all duration-300 ${
        isScrolled || solid
          ? 'bg-navy-dark/95 py-2.5 shadow-[0_2px_20px_rgba(0,0,0,0.3)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="z-[1001] flex items-center">
          <img
            src="/images/logo lazis pln.png"
            alt="Lazis PLN Batam"
            className="h-10 w-auto rounded-lg bg-white px-2.5 py-1.5 shadow-sm"
          />
        </Link>

        {/* Desktop Nav */}
        <nav
          className={`flex items-center gap-8 max-[900px]:fixed max-[900px]:inset-0 max-[900px]:flex-col max-[900px]:justify-center max-[900px]:gap-6 max-[900px]:bg-navy-dark/[0.98] max-[900px]:backdrop-blur-lg max-[900px]:transition-transform max-[900px]:duration-400 ${
            menuOpen ? 'max-[900px]:translate-x-0' : 'max-[900px]:translate-x-full'
          }`}
        >
          <Link href="/donatur#programs" className="navbar-link" onClick={closeMenu}>
            Program Kami
          </Link>
          <Link
            href="/donatur/blog"
            className={
              pathname === '/donatur/blog'
                ? 'rounded-lg bg-primary-light px-3 py-1.5 text-sm font-bold text-white'
                : 'navbar-link'
            }
            onClick={closeMenu}
          >
            Blog
          </Link>
          <Link
            href="/donatur/tentang-kami"
            className={
              pathname === '/donatur/tentang-kami'
                ? 'rounded-lg bg-primary-light px-3 py-1.5 text-sm font-bold text-white'
                : 'navbar-link'
            }
            onClick={closeMenu}
          >
            Tentang Kami
          </Link>
          <a href="#" className="navbar-link" onClick={closeMenu}>
            Daftar Program
          </a>
          <Link href="/donatur#zakat-calculator" className="navbar-link" onClick={closeMenu}>
            Kalkulator Zakat
          </Link>
          <Link href="/donatur#konsultasi" className="navbar-link" onClick={closeMenu}>
            Konsultasi
          </Link>
          <div className="hidden items-center gap-5 max-[900px]:mt-4 max-[900px]:flex">
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
          aria-label="Menu"
          className="z-[1001] hidden flex-col gap-[5px] p-1 max-[900px]:flex"
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
    </header>
  )
}
