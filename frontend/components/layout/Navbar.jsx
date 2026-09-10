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

const pathOf = (href) => (href || '').split('#')[0]

//ini fungsi untuk menampilkan navbar di halaman donatur — sumber menu diambil
// dari database (Manajemen Menu), bukan hardcode lagi.
export default function Navbar({ solid = false }) {
  const pathname = usePathname()
  const { menus } = usePublicMenus()
  const [isScrolled, setIsScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [openId, setOpenId] = useState(null) // dropdown yang sedang dibuka (HP/klik)
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

  // Tutup dropdown saat pindah halaman.
  useEffect(() => setOpenId(null), [pathname])

  const showSolid = isScrolled || solid
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

        {/* Menu navigasi — sumbernya dinamis (Manajemen Menu), jumlahnya bisa
            berubah-ubah. Di HP: baris rapat yang bisa digeser ke samping.
            Mulai sm: mengalir normal & rata kanan (logo di kiri) supaya tidak
            pernah bertabrakan dengan logo berapa pun banyak menunya. */}
        <nav
          className="no-scrollbar flex min-w-0 flex-1 items-center justify-between gap-2 overflow-x-auto whitespace-nowrap pl-2 [&_.nav-top]:text-[8px] [&_.nav-top]:normal-case [&_.nav-top]:tracking-normal min-[400px]:gap-2.5 min-[400px]:[&_.nav-top]:text-[9px] sm:justify-center sm:gap-4 sm:overflow-visible sm:pl-0 sm:[&_.nav-top]:text-[10px] min-[900px]:gap-6 min-[900px]:[&_.nav-top]:text-xs min-[900px]:[&_.nav-top]:uppercase min-[900px]:[&_.nav-top]:tracking-[0.06em]"
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

                {/* Panel dropdown — hanya layar sm ke atas (HP pakai inline).
                    Muncul saat hover (CSS) atau saat caret diklik (state). */}
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

                {/* HP/tablet kecil: submenu ditampilkan inline (nav bisa digeser),
                    supaya tidak terpotong oleh overflow scroller. */}
                {kids.map((k) => (
                  <Link
                    key={`inline-${k.id}`}
                    href={k.href}
                    {...(k.openNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={`nav-top relative ml-2 sm:hidden ${
                      isActive(k.href) ? 'navbar-link-active' : 'navbar-link'
                    }`}
                  >
                    <span className="mr-1 text-white/30">·</span>
                    {k.name}
                  </Link>
                ))}
              </div>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
