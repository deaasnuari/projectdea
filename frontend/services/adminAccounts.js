'use client'

import { useCallback, useEffect, useState } from 'react'

// Klien API akun admin — tabel `admin_accounts` di backend.
// Semua endpoint di bawah /api/auth. register/accounts/reset butuh sesi
// admin; change-password publik (perlu password lama yang benar).
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function req(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}/api/auth${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `${method} ${path} → ${res.status}`)
  return data
}

export const registerAccount = (payload) => req('/register', { method: 'POST', body: payload })
export const fetchAccounts = () => req('/accounts').then((d) => d.data || [])
export const deleteAccount = (id) => req(`/accounts/${id}`, { method: 'DELETE' })
export const resetAccountPassword = (id, newPassword) =>
  req(`/accounts/${id}/reset-password`, { method: 'POST', body: { newPassword } })
export const changePassword = (payload) => req('/change-password', { method: 'POST', body: payload })

export function useAdminAccounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchAccounts()
      .then((a) => {
        setAccounts(a)
        setError('')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { accounts, loading, error, refresh }
}
