'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Pencegah ringan di halaman PUBLIK: gambar & video tidak bisa diseret ke
// desktop atau di-"Simpan gambar sebagai…" lewat klik kanan. Ini hanya menahan
// pengguna awam — bukan pengamanan sungguhan (siapa pun masih bisa
// screenshot / buka DevTools); watermark di file gambar adalah penanda asalnya.
// Halaman admin & login dikecualikan supaya admin bebas mengelola gambar.
export default function ImageProtection() {
  const pathname = usePathname()
  const skip = pathname.startsWith('/admin') || pathname.startsWith('/login')

  useEffect(() => {
    if (skip) return
    const isMedia = (t) => t instanceof Element && (t.tagName === 'IMG' || t.tagName === 'VIDEO' || t.closest?.('picture'))
    const block = (e) => {
      if (isMedia(e.target)) e.preventDefault()
    }
    document.addEventListener('contextmenu', block)
    document.addEventListener('dragstart', block)
    document.documentElement.setAttribute('data-protect-media', '')
    return () => {
      document.removeEventListener('contextmenu', block)
      document.removeEventListener('dragstart', block)
      document.documentElement.removeAttribute('data-protect-media')
    }
  }, [skip])

  return null
}
