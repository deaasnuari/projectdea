'use client'

import { useEffect, useState } from 'react'

const STATS = [
  { value: 3800000000, prefix: 'Rp ', suffix: ' M', label: 'Dana Terkumpul ZIS', divisor: 1000000 },
  { value: 1240, prefix: '', suffix: '+', label: 'Donatur Aktif' },
  { value: 5600, prefix: '', suffix: '+', label: 'Penerima Manfaat' },
  { value: 100, prefix: '', suffix: '%', label: 'Transparansi Dana' },
]

const FEATURES = [
  {
    title: 'Kalkulator Zakat',
    desc: 'Menghitung jumlah zakat yang harus dibayarkan sesuai dengan ketentuan syariah.',
    href: '#zakat-calculator',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="16" y1="14" x2="16" y2="18" />
        <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
  {
    title: 'Konsultasi',
    desc: 'Layanan konsultasi zakat secara online. Tanya dan pahami lebih lanjut mengenai pentingnya zakat.',
    href: '#konsultasi',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: 'Program',
    desc: 'Berbagai program zakat yang efektif dan transparan untuk membantu masyarakat yang membutuhkan.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function HeroSection() {
  const [displays, setDisplays] = useState(STATS.map(() => '0'))

  useEffect(() => {
    const timer = setTimeout(() => {
      STATS.forEach((stat, index) => {
        let current = 0
        const target = stat.divisor ? stat.value / stat.divisor : stat.value
        const increment = target / 60
        const interval = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(interval)
          }
          const text = stat.divisor
            ? `${stat.prefix}${(current / 1000).toFixed(1)}${stat.suffix}`
            : `${stat.prefix}${Math.floor(current).toLocaleString('id-ID')}${stat.suffix}`
          setDisplays((prev) => {
            const next = [...prev]
            next[index] = text
            return next
          })
        }, 16)
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="top" className="relative flex min-h-screen items-end overflow-hidden pb-12 max-[600px]:min-h-0 max-[600px]:pb-12">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-bg.png" alt="Masjid" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,46,60,0.92)] via-[rgba(10,126,126,0.75)] to-[rgba(10,46,60,0.85)]" />
      </div>

      <div className="container relative z-[1] pt-[120px] max-[600px]:pt-[100px]">
        {/* Content */}
        <div className="max-w-[650px] animate-fade-in-up">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[2px] text-gold">
  Selamat datang di Lembaga Zakat dan Shadaqah PT PLN Batam          </p>
          <h1 className="mb-6 font-heading text-[3rem] font-extrabold leading-[1.15] text-white max-[768px]:text-4xl max-[480px]:text-[1.875rem]">
            Bergabunglah Bersama
            <br />
            kami dalam Misi <span className="italic text-gold">Kebaikan</span>
          </h1>
          <p className="mb-8 max-w-[520px] text-lg leading-[1.7] text-white/80">
            Kami berkomitmen untuk menyalurkan kebaikan bagi yang membutuhkan melalui program-program sosial
            transparan dan terpercaya.
          </p>
          <div className="mb-16 flex flex-wrap gap-4 max-[600px]:flex-col">
            <a href="#zakat-calculator" className="btn btn-gold">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
              </svg>
              Tunaikan Zakat
            </a>
            <a href="#programs" className="btn btn-primary">
              Jelajahi Kami
            </a>
            <a href="#" className="btn btn-outline">
              Infaq / Shodaqoh
            </a>
          </div>
        </div>

        {/* Feature Cards */}
        <div
          className="mb-12 grid animate-fade-in-up grid-cols-3 gap-6 opacity-0 max-[900px]:grid-cols-1"
          style={{ animationDelay: '0.3s' }}
        >
          {FEATURES.map((f) => {
            const Tag = f.href ? 'a' : 'div'
            return (
              <Tag
                key={f.title}
                href={f.href}
                className="group flex gap-4 rounded-xl border border-white/[0.12] bg-white/[0.08] p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/[0.14] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/[0.15] text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-white group-active:bg-gold group-active:text-white [&>svg]:h-[22px] [&>svg]:w-[22px]">
                  {f.icon}
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-bold text-white">{f.title}</h4>
                  <p className="text-xs leading-[1.5] text-white/60">{f.desc}</p>
                </div>
              </Tag>
            )
          })}
        </div>

        {/* Stats */}
        <div
          className="grid animate-fade-in-up grid-cols-4 gap-6 rounded-2xl border border-white/10 bg-white/[0.06] px-12 py-8 opacity-0 backdrop-blur-md max-[900px]:grid-cols-2 max-[600px]:p-6"
          style={{ animationDelay: '0.6s' }}
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <span className="mb-1 block font-heading text-3xl font-extrabold text-white max-[600px]:text-xl">
                {displays[i]}
              </span>
              <span className="text-xs font-medium text-white/50">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
