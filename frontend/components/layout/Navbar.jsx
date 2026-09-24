'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePublicMenus } from '@/services/menus'

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

const Caret = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="9" height="9" className="ml-0.5 inline-block">
    <path d="M5.5 7.5L10 12l4.5-4.5z" />
  </svg>
)

const MenuIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20" aria-hidden="true">
    {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
  </svg>
)

const pathOf = (href) => (href || '').split('#')[0]

// Satu baris menu di panel HP (menu utama / submenu yang menjorok).
function MobileLink({ item, active, onPick, sub = false }) {
  return (
    <Link
      href={item.href}
      {...(item.openNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={onPick}
      className={`flex items-center justify-between rounded-xl transition-colors ${
        sub ? 'ml-4 px-4 py-2.5 text-[13px] font-medium' : 'px-4 py-3 text-sm font-semibold'
      } ${active ? 'bg-white/10 text-gold' : 'text-white/85 hover:bg-white/[0.06] active:bg-white/10'}`}
    >
      {item.name}
      {active && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
    </Link>
  )
}

//ini fungsi untuk menampilkan navbar di halaman donatur — sumber menu diambil
// dari database (Manajemen Menu), bukan hardcode lagi.
export default function Navbar({ solid = false }) {
  const pathname = usePathname()
  const { menus } = usePublicMenus()
  const [isScrolled, setIsScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [openId, setOpenId] = useState(null) // dropdown yang sedang dibuka (klik caret)
  const [mobileOpen, setMobileOpen] = useState(false) // panel menu HP (tombol ☰)
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

  // Tutup dropdown & panel menu HP saat pindah halaman.
  useEffect(() => {
    setOpenId(null)
    setMobileOpen(false)
  }, [pathname])

  // Panel menu HP: tutup dengan tombol Esc, dan otomatis tertutup kalau layar
  // dilebarkan melewati breakpoint sm (menu lengkap tampil lagi di navbar).
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e) => e.key === 'Escape' && setMobileOpen(false)
    const mq = window.matchMedia('(min-width: 640px)')
    const onMq = () => mq.matches && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [mobileOpen])

  const showSolid = isScrolled || solid || mobileOpen
  // Selama panel menu HP terbuka, navbar jangan ikut tersembunyi saat scroll.
  const isHidden = hidden && !mobileOpen
  const isActive = (href) => {
    const p = pathOf(href)
    return p && p !== '/donatur' && p !== '/' && pathname === p
  }

  const linkClass = (active) => `nav-top relative ${active ? 'navbar-link-active' : 'navbar-link'}`

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
          isHidden
            ? '-translate-y-[calc(100%+2rem)] opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Logo situs */}
        <Link
          href="/"
          className="flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.03]"
        >
          <img
            src="/images/logo-lazis-pln-putih.png"
            alt="Lazis PLN Batam"
            width="1080"
            height="387"
            decoding="async"
            className="h-6 w-auto md:h-8"
          />
        </Link>

        {/* Tombol ☰ — hanya di HP (< sm). Menu lengkapnya ada di panel
            yang turun dari kapsul ini (lihat di bawah). */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 active:bg-white/25 sm:hidden"
        >
          <MenuIcon open={mobileOpen} />
        </button>

        {/* Menu navigasi (tablet & desktop) — sumbernya dinamis (Manajemen
            Menu), jumlahnya bisa berubah-ubah. Mengalir normal & rata tengah
            supaya tidak pernah bertabrakan dengan logo berapa pun menunya. */}
        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-4 whitespace-nowrap [&_.nav-top]:text-[10px] [&_.nav-top]:normal-case [&_.nav-top]:tracking-normal sm:flex min-[900px]:gap-6 min-[900px]:[&_.nav-top]:text-xs min-[900px]:[&_.nav-top]:uppercase min-[900px]:[&_.nav-top]:tracking-[0.06em]"
        >
          {menus.map((item) => {
            const active = isActive(item.href)
            const kids = item.children || []
            const linkProps = item.openNewTab
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {}

            if (!kids.length) {
              return (
                <Link key={item.id} href={item.href} className={linkClass(active)} {...linkProps}>
                  {item.name}
                  {active && <ActiveTag />}
                </Link>
              )
            }

            // Menu dengan submenu → dropdown (desktop: hover CSS; HP/tablet: klik caret)
            const open = openId === item.id
            return (
              <div key={item.id} className="group/nav relative flex shrink-0 items-center">
                <Link href={item.href} className={linkClass(active)} {...linkProps}>
                  {item.name}
                  {active && <ActiveTag />}
                </Link>
                <button
                  type="button"
                  aria-label={`Buka submenu ${item.name}`}
                  aria-expanded={open}
                  onClick={() => setOpenId((id) => (id === item.id ? null : item.id))}
                  className="nav-top ml-0.5 text-white/70 hover:text-white"
                >
                  <Caret />
                </button>

                {/* Panel dropdown — muncul saat hover (CSS) atau saat caret
                    diklik (state). */}
                <div
                  className={`absolute left-1/2 top-[calc(100%+10px)] z-[1002] min-w-[180px] -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-white/10 bg-navy-dark/95 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-md hidden sm:group-hover/nav:flex ${
                    open ? 'sm:flex' : ''
                  }`}
                >
                  {kids.map((k) => (
                    <Link
                      key={k.id}
                      href={k.href}
                      {...(k.openNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                        isActive(k.href)
                          ? 'bg-white/10 text-gold'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {k.name}
                    </Link>
                  ))}
                </div>

              </div>
            )
          })}
        </nav>
      </div>

      {/* Panel menu HP — turun tepat di bawah kapsul navbar, gaya kaca navy
          yang sama. Tap di luar panel (lapisan transparan) = tutup. */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[999] bg-navy-dark/30 sm:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        id="mobile-nav-panel"
        className={`relative z-[1001] mx-auto mt-2 max-w-[1080px] origin-top overflow-hidden rounded-2xl border border-white/10 bg-navy-dark/95 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-200 sm:hidden ${
          mobileOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none invisible -translate-y-2 scale-[0.98] opacity-0'
        }`}
      >
        <nav className="flex max-h-[calc(100dvh-7rem)] flex-col overflow-y-auto">
          {menus.map((item) => (
            <div key={item.id}>
              <MobileLink item={item} active={isActive(item.href)} onPick={() => setMobileOpen(false)} />
              {(item.children || []).map((k) => (
                <MobileLink key={k.id} item={k} active={isActive(k.href)} onPick={() => setMobileOpen(false)} sub />
              ))}
            </div>
          ))}
        </nav>
      </div>
    </header>
  )
}
