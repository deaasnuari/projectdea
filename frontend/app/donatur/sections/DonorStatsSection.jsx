'use client'

import { useEffect, useState } from 'react'

const STATS = [
  { value: 157, label: 'Donatur Zakat' },
  { value: 21, label: 'Donatur Infaq' },
  { value: 1, label: 'Donatur Orang Tua Asuh' },
]

export default function DonorStatsSection() {
  const [displays, setDisplays] = useState(STATS.map(() => 0))

  useEffect(() => {
    const timer = setTimeout(() => {
      STATS.forEach((stat, index) => {
        let current = 0
        const increment = Math.max(stat.value / 40, 1)
        const interval = setInterval(() => {
          current += increment
          if (current >= stat.value) {
            current = stat.value
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
  }, [])

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
          Jumlah Donatur Saat ini
        </h2>

        <div className="grid grid-cols-3 gap-3 max-[600px]:grid-cols-1 max-[600px]:gap-2">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <span className="block font-heading text-lg font-extrabold text-gold max-[600px]:text-base">
                {displays[i].toLocaleString('id-ID')}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-white/70">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
