'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminSession, isAdminLoggedIn } from '@/services/adminAuth'
import { toast } from '@/components/ui/feedback'

// Menahan akses ke /admin/* kalau belum login. Cek ke backend (/api/auth/me).
// Kalau belum login → diberi notifikasi "login dulu" lalu dilempar ke /login.
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
        toast('Kamu harus login dulu untuk membuka halaman admin.', { tone: 'info' })
        router.replace('/login')
      }
    })

    return () => {
      alive = false
    }
  }, [router])

  if (status === 'allowed') return children

  // Selagi memeriksa / sudah ditolak — tampilkan layar tunggu ringkas
  // (bukan layar putih kosong).
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-primary" />
        <p className="text-sm font-medium">
          {status === 'denied' ? 'Mengarahkan ke halaman login…' : 'Memeriksa sesi…'}
        </p>
      </div>
    </div>
  )
}
