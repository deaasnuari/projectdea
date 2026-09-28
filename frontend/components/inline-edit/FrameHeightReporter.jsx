'use client'

import { useEffect, useRef } from 'react'

export const FRAME_HEIGHT_MSG = 'lazis-frame:height'

// Dipakai di halaman /admin-pratinjau (isi iframe). Melaporkan tinggi isi ke
// halaman induk (DevicePreviewFrame) setiap kali berubah, supaya iframe dibuat
// setinggi isinya — tanpa scroll di dalam iframe, cukup scroll halaman admin.
export default function FrameHeightReporter({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.parent === window) return
    let last = 0
    const report = () => {
      const height = Math.ceil(el.getBoundingClientRect().height)
      if (height === last) return
      last = height
      window.parent.postMessage({ type: FRAME_HEIGHT_MSG, height }, window.location.origin)
    }
    report()
    const ro = new ResizeObserver(report)
    ro.observe(el)
    // Gambar/font yang selesai dimuat belakangan juga mengubah tinggi.
    window.addEventListener('load', report)
    return () => {
      ro.disconnect()
      window.removeEventListener('load', report)
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
