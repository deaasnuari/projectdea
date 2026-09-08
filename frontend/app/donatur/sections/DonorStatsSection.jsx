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
    <section className="relative overflow-hidden bg-gradient-to-br from-navy to-navy-dark py-5">
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
        <h2 className="mb-3 text-center font-heading text-sm font-bold text-white max-[600px]:text-xs">
          {content.title}
        </h2>
        <p className="mx-auto mb-4 max-w-xl text-center text-xs text-white/60">{content.description}</p>

        {/* Grid dengan kolom lebar sama supaya angka tetap sejajar di atas
            labelnya, berapa pun panjang teks label (label panjang seperti
            "Donatur Orang Tua Asuh" tidak lagi menggeser angka). 2 kolom di
            HP, 4 kolom mulai tablet. */}
        <div className="mx-auto grid max-w-xs grid-cols-2 gap-x-4 gap-y-5 sm:max-w-2xl sm:grid-cols-4">
          {content.stats.map((stat, i) => (
            <div key={stat.label || i} className="flex flex-col items-center text-center">
              <span className="block font-heading text-lg font-extrabold text-gold">
                {(displays[i] ?? 0).toLocaleString('id-ID')}
              </span>
              <span className="mt-0.5 block text-[9px] font-semibold uppercase leading-tight tracking-[0.08em] text-white/70">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
