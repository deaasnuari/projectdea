'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminSessionState, hasTabLogin, isAdminLoggedIn } from '@/services/adminAuth'
import { toast } from '@/components/ui/feedback'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Menahan akses ke /admin/* kalau belum login. Cek ke backend (/api/auth/me).
// Kalau belum login → diberi notifikasi "login dulu" lalu dilempar ke /login.
export default function AdminAuthGate({ children }) {
  const router = useRouter()
  const [status, setStatus] = useState('checking') // checking | allowed | denied

  useEffect(() => {
    let alive = true

    // Tab ini belum login lewat form (mis. URL admin ditempel di tab baru):
    // wajib login dulu, walau cookie sesi dari tab lain masih berlaku.
    if (!hasTabLogin()) {
      setStatus('denied')
      toast('Kamu harus login dulu untuk membuka halaman admin.', { tone: 'info' })
      router.replace('/login')
      return undefined
    }

    const hadHint = isAdminLoggedIn()

    // Petunjuk sinkron: kalau sebelumnya sudah login, tampilkan langsung
    // supaya tidak berkedip saat pindah antar halaman /admin.
    if (hadHint) setStatus('allowed')

    ;(async () => {
      // Cek sesi bisa gagal sesaat (backend lambat / cookie baru diset).
      // Coba ulang dulu; hanya "belum login" yang pasti (false) yang boleh
      // langsung menolak, setelah satu kali konfirmasi ulang.
      const attempts = 4
      for (let i = 0; i < attempts; i += 1) {
        if (!alive) return
        const state = await checkAdminSessionState()
        if (state === true) {
          if (alive) setStatus('allowed')
          return
        }
        if (state === false && !hadHint && i >= 1) break
        if (i < attempts - 1) await sleep(500)
      }

      if (!alive) return
      setStatus('denied')
      toast('Kamu harus login dulu untuk membuka halaman admin.', { tone: 'info' })
      router.replace('/login')
    })()

    return () => {
      alive = false
    }
  }, [router])

  if (status === 'allowed') return children
// Kalau status 'checking' atau 'denied', tampilkan spinner dan teks.
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-primary" />
        <p className="text-sm font-medium">
          {status === 'denied' ? 'Mengarahkan ke halaman login…' : 'Memeriksa sesi…'}
        </p>
      </div>
    </div>
  )
}
