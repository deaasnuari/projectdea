'use client'

import { useEffect, useState } from 'react'
import { useDonorContent } from './donorData'

export default function DonorStatsSection() {
  const { content } = useDonorContent()
  const [displays, setDisplays] = useState(() => content.stats.map(() => 0))

  useEffect(() => {
    setDisplays(content.stats.map(() => 0))
    const timer = setTimeout(() => {
      content.stats.forEach((stat, index) => {
        const target = Number(stat.value) || 0
        let current = 0
        const increment = Math.max(target / 40, 1)
        const interval = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(interval)
          }
          setDisplays((prev) => {
            const next = [...prev]
            next[index] = Math.floor(current)
            return next
          })
        }, 30)
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [content])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy to-navy-dark py-9 sm:py-11">
      {/* Pola bintang delapan sudut yang samar, senada dengan section hero,
          supaya area navy solid ini tetap terasa satu keluarga dengan
          background hero, bukan potongan warna yang berdiri sendiri. */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden="true">
        <defs>
          <pattern id="donor-stats-lattice" width="72" height="72" patternUnits="userSpaceOnUse">
            <path
              d="M36 2 L44 20 L64 12 L52 30 L70 36 L52 42 L64 60 L44 52 L36 70 L28 52 L8 60 L20 42 L2 36 L20 30 L8 12 L28 20 Z"
              fill="none"
              stroke="#fff"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#donor-stats-lattice)" />
      </svg>

      <div className="container relative z-[1]">
        <h2 className="mb-1 text-center font-heading text-xl font-bold text-white sm:text-2xl after:mx-auto after:mt-3 after:block after:h-1 after:w-12 after:rounded-full after:bg-gold">
          {content.title}
        </h2>
        <p className="mx-auto mb-7 mt-3 max-w-xl text-center text-sm text-white/65">{content.description}</p>

        {/* Grid dengan kolom lebar sama supaya angka tetap sejajar di atas
            labelnya, berapa pun panjang teks label (label panjang seperti
            "Donatur Orang Tua Asuh" tidak lagi menggeser angka). 2 kolom di
            HP, 4 kolom mulai tablet. */}
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:max-w-4xl sm:grid-cols-4 sm:gap-4">
          {content.stats.map((stat, i) => (
            <div key={stat.label || i} className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.06] px-3 py-4 text-center backdrop-blur-sm transition-colors hover:bg-white/10">
              <span className="block font-heading text-3xl font-extrabold leading-tight text-gold sm:text-4xl">
                {(displays[i] ?? 0).toLocaleString('id-ID')}
              </span>
              <span className="mt-1 block text-[11px] font-semibold uppercase leading-tight tracking-[0.06em] text-white/70">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
