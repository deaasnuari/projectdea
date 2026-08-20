import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-navy-dark pt-16 text-white/70">
      {/* Brand seam — mirrors the hairline under the solid navbar */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="container">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1.3fr] gap-10 pb-12 max-[768px]:grid-cols-2 max-[768px]:gap-10 max-[480px]:grid-cols-1">
          {/* Brand */}
          <div className="max-[768px]:col-span-full">
            <div className="mb-4">
              <img
                src="/images/logo lazis pln.png"
                alt="Lazis PLN Batam"
                className="h-8 w-auto rounded-md bg-white px-[0.6rem] py-[0.35rem]"
              />
            </div>
            <p className="mb-5 max-w-[280px] text-sm leading-[1.7] text-white/60">
              Lembaga Amil Zakat, Infaq dan Shadaqah PLN Batam. Menyalurkan kebaikan untuk kesejahteraan
              masyarakat.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.08] text-white/60 transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.08] text-white/60 transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.08] text-white/60 transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="mb-5 font-heading text-base font-bold text-white after:mt-2.5 after:block after:h-0.5 after:w-6 after:rounded-full after:bg-gold/70">
              Navigasi
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/donatur#top" className="text-sm text-white/60 transition-colors hover:text-gold">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/donatur#programs" className="text-sm text-white/60 transition-colors hover:text-gold">
                  Program Kami
                </Link>
              </li>
              <li>
                <Link href="/donatur#zakat-calculator" className="text-sm text-white/60 transition-colors hover:text-gold">
                  Hitung Zakat
                </Link>
              </li>
              <li>
                <Link href="/donatur#konsultasi" className="text-sm text-white/60 transition-colors hover:text-gold">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-5 font-heading text-base font-bold text-white after:mt-2.5 after:block after:h-0.5 after:w-6 after:rounded-full after:bg-gold/70">
              Layanan
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-white/60 transition-colors hover:text-gold">
                  Zakat Penghasilan
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/60 transition-colors hover:text-gold">
                  Zakat Fitrah
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/60 transition-colors hover:text-gold">
                  Infaq
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/60 transition-colors hover:text-gold">
                  Shadaqah
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 font-heading text-base font-bold text-white after:mt-2.5 after:block after:h-0.5 after:w-6 after:rounded-full after:bg-gold/70">
              Kontak
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-primary-light">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </span>
                <span className="pt-1 text-sm leading-[1.6] text-white/60">Jl. PLN Batam, Kepulauan Riau, Indonesia</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-primary-light">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </span>
                <span className="pt-1 text-sm leading-[1.6] text-white/60">(0778) 123-456</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-primary-light">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <span className="pt-1 text-sm leading-[1.6] text-white/60">lazis@plnbatam.co.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-3 border-t border-white/[0.08] py-6 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>&copy; {currentYear} Lazis PLN Batam. Seluruh hak cipta dilindungi.</p>
          <a
            href="#top"
            className="flex items-center gap-1.5 font-medium text-white/45 transition-colors hover:text-gold"
          >
            Kembali ke atas
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
              <path d="M10 15V5M4 9l6-6 6 6" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
