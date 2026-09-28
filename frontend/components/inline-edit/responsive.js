'use client'

import { useEffect, useState } from 'react'

// Perangkat untuk tampilan responsif otomatis teks yang diedit admin
// (lihat EditableRichText): posisi geser & lebar kotak diatur sekali di
// layar desktop, lalu di tablet/HP menyesuaikan sendiri.
//
// Perangkat ditentukan dari lebar layar (di pratinjau admin: lebar iframe).
export const DEVICES = [
  { id: 'desktop', label: 'Desktop', width: 1280 },
  { id: 'tablet', label: 'Tablet', width: 820 },
  { id: 'mobile', label: 'HP', width: 390 },
]

const DESKTOP_QUERY = '(min-width: 1024px)'
const TABLET_QUERY = '(min-width: 768px)'

export function currentDevice() {
  if (typeof window === 'undefined') return 'desktop'
  if (window.matchMedia(DESKTOP_QUERY).matches) return 'desktop'
  if (window.matchMedia(TABLET_QUERY).matches) return 'tablet'
  return 'mobile'
}

export function useDevice() {
  const [device, setDevice] = useState(currentDevice)
  useEffect(() => {
    const queries = [window.matchMedia(DESKTOP_QUERY), window.matchMedia(TABLET_QUERY)]
    const onChange = () => setDevice(currentDevice())
    onChange()
    queries.forEach((q) => q.addEventListener('change', onChange))
    return () => queries.forEach((q) => q.removeEventListener('change', onChange))
  }, [])
  return device
}
