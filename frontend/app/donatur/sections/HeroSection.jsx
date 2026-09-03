'use client'

import EditableText from '@/components/inline-edit/EditableText'
import { useKamiPeduliContent } from './useKamiPeduliContent'

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
    href: '/donatur/program',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function HeroSection() {
  const { content, patchSection } = useKamiPeduliContent()
  const hero = content.hero
  const setHero = (patch) => patchSection('hero', patch)

  return (
    <section id="top" className="relative flex min-h-screen items-end overflow-hidden pb-6 max-[600px]:min-h-0 max-[600px]:pb-8">
      {/* Latar belakang */}
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-bg.png" alt="Masjid" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,46,60,0.92)] via-[rgba(10,126,126,0.75)] to-[rgba(10,46,60,0.85)]" />
        {/* Pola bintang delapan sudut yang samar — terinspirasi ornamen
            geometris Islam, bukan sekadar gradasi warna biasa. Dibuat
            samar supaya terasa sebagai tekstur, bukan hiasan yang menonjol. */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
          <defs>
            <pattern id="hero-lattice" width="72" height="72" patternUnits="userSpaceOnUse">
              <path
                d="M36 2 L44 20 L64 12 L52 30 L70 36 L52 42 L64 60 L44 52 L36 70 L28 52 L8 60 L20 42 L2 36 L20 30 L8 12 L28 20 Z"
                fill="none"
                stroke="#fff"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-lattice)" />
        </svg>
      </div>

      <div className="container relative z-[1] pt-32 max-[600px]:pt-[104px]">
        {/* Konten */}
        <div className="max-w-[650px] animate-fade-in-up">
          <EditableText
            as="p"
            className="section-label !mb-3 !text-gold"
            value={hero.label}
            onSave={(v) => setHero({ label: v })}
            label="teks sambutan"
            multiline
          />
          <h1 className="mb-4 font-heading text-[3rem] font-extrabold leading-[1.15] text-white max-[768px]:text-4xl max-[480px]:text-[1.875rem]">
            <EditableText
              as="span"
              value={hero.titleBefore}
              onSave={(v) => setHero({ titleBefore: v })}
              label="judul hero"
              multiline
              preserveWhitespace
            />{' '}
            <EditableText
              as="span"
              className="italic text-gold"
              value={hero.titleHighlight}
              onSave={(v) => setHero({ titleHighlight: v })}
              label="kata yang ditonjolkan"
            />
          </h1>
          <EditableText
            as="p"
            className="mb-6 max-w-[520px] text-lg leading-[1.6] text-white/80"
            value={hero.description}
            onSave={(v) => setHero({ description: v })}
            label="deskripsi hero"
            multiline
          />
          <div className="mb-6 flex flex-wrap gap-4 max-[600px]:flex-col">
            <a href="#zakat-calculator" className="btn btn-gold">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
              </svg>
              <EditableText
                value={hero.ctaZakat}
                onSave={(v) => setHero({ ctaZakat: v })}
                label="tombol Tunaikan Zakat"
              />
            </a>
            <a href="/donatur/program" className="btn btn-primary">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <circle cx="10" cy="10" r="7.5" />
                <path d="M12.6 7.4l-1.8 3.8-3.8 1.8 1.8-3.8 3.8-1.8z" />
              </svg>
              <EditableText
                value={hero.ctaJelajahi}
                onSave={(v) => setHero({ ctaJelajahi: v })}
                label="tombol Jelajahi Kami"
              />
            </a>
          </div>
        </div>

        {/* Kartu-kartu fitur */}
        <div
          className="mb-6 grid animate-fade-in-up grid-cols-3 gap-4 opacity-0 max-[900px]:grid-cols-1"
          style={{ animationDelay: '0.3s' }}
        >
          {FEATURES.map((f) => {
            const Tag = f.href ? 'a' : 'div'
            return (
              <Tag
                key={f.title}
                href={f.href}
                className="group flex gap-4 rounded-tr-2xl rounded-bl-2xl rounded-tl-md rounded-br-md border border-white/[0.12] bg-white/[0.08] p-5 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/[0.14] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.15] text-gold transition-colors duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-white group-active:bg-gold group-active:text-white [&>svg]:h-[20px] [&>svg]:w-[20px]">
                  {f.icon}
                </div>
                <div>
                  <h4 className="mb-1 font-heading text-base font-semibold text-white">{f.title}</h4>
                  <p className="text-xs leading-[1.5] text-white/60">{f.desc}</p>
                </div>
              </Tag>
            )
          })}
        </div>
      </div>
    </section>
  )
}
