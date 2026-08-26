'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminLoggedIn } from '@/services/adminAuth'

// Menahan akses ke /admin/* kalau belum "login" (lihat catatan di
// services/adminAuth.js — ini gerbang prototipe, bukan keamanan sungguhan).
// Selama status login belum dicek (sesaat di render pertama), sengaja tidak
// menampilkan apa pun supaya konten admin tidak sempat kelihatan berkedip.
export default function AdminAuthGate({ children }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (isAdminLoggedIn()) {
      setAllowed(true)
    } else {
      router.replace('/login')
    }
    setChecked(true)
  }, [router])

  if (!checked || !allowed) return null

  return children
}
