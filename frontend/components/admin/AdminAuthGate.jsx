'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminSession, isAdminLoggedIn } from '@/services/adminAuth'

// Menahan akses ke /admin/* kalau belum login. Cek ke backend (/api/auth/me).
// Render pertama selalu `null` (sama di server & client — hindari hydration
// mismatch); useEffect yang menentukan tampil/tidak.
export default function AdminAuthGate({ children }) {
  const router = useRouter()
  const [status, setStatus] = useState('checking') // checking | allowed | denied

  useEffect(() => {
    let alive = true

    // Petunjuk sinkron: kalau sebelumnya sudah login, tampilkan langsung
    // supaya tidak berkedip saat pindah antar halaman /admin.
    if (isAdminLoggedIn()) setStatus('allowed')

    checkAdminSession().then((ok) => {
      if (!alive) return
      if (ok) {
        setStatus('allowed')
      } else {
        setStatus('denied')
        router.replace('/login')
      }
    })

    return () => {
      alive = false
    }
  }, [router])

  return status === 'allowed' ? children : null
}
