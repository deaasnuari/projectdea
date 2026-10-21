'use client'

import { Children, useCallback, useEffect, useRef, useState } from 'react'

// Lebar tiap kartu di dalam <CardCarousel>: 1 kartu (+ intipan kartu berikut)
// di HP, 2 di tablet, 3 di desktop — gap antar kartu 1.5rem.
export const CAROUSEL_ITEM =
  'w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]'

const Arrow = ({ dir }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path
      fillRule="evenodd"
      d={
        dir === 'prev'
          ? 'M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
          : 'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
      }
      clipRule="evenodd"
    />
  </svg>
)

// Baris kartu yang digeser ke samping (scroll-snap): mouse/trackpad, swipe di
// HP & iPad, plus tombol panah di layar ≥ sm (hanya muncul kalau memang ada
// kartu yang tersembunyi). Tiap anak langsung = satu kartu; beri mereka
// className CAROUSEL_ITEM supaya ukurannya seragam.
export default function CardCarousel({ children, className = '' }) {
  const scrollerRef = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const count = Children.count(children)

  const updateEdge = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })

  }, [])

  useEffect(() => {
    updateEdge()
    window.addEventListener('resize', updateEdge)
    return () => window.removeEventListener('resize', updateEdge)
  }, [updateEdge, count])

  const slide = (dir) => {
    const el = scrollerRef.current
    if (!el) return
    const first = el.firstElementChild
    const step = first ? first.getBoundingClientRect().width + 24 : el.clientWidth
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const arrows = ['prev', 'next'].map((dir) => {
    const disabled = dir === 'prev' ? edge.start : edge.end
    return (
      <button
        key={dir}
        type="button"
        onClick={() => slide(dir === 'prev' ? -1 : 1)}
        disabled={disabled}
        aria-label={dir === 'prev' ? 'Kartu sebelumnya' : 'Kartu berikutnya'}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-all hover:bg-white/25 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white/10"
      >
        <Arrow dir={dir} />
      </button>
    )
  })

  return (
    <div className={className}>
      <div
        ref={scrollerRef}
        onScroll={updateEdge}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth -mb-4 -mt-2 pb-6 pt-2"
      >
        {children}
      </div>

      {!(edge.start && edge.end) && <div className="mt-5 hidden justify-end gap-2 sm:flex">{arrows}</div>}
    </div>
  )
}
