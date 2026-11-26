'use client'

import { useCallback, useEffect, useState } from 'react'

// Klien API rekening bank — tabel `bank_accounts` di backend, per `scope`
// ('tentang' | 'program'). GET publik (dipakai modal donasi), mutasi butuh
// sesi admin.
import { getApiBase, getPublicApiBase } from '@/services/apiBase'
const BASE = getApiBase()
const PUBLIC_BASE = getPublicApiBase()

// Sengaja kosong: nomor rekening tidak boleh punya nilai contoh, supaya pengunjung
// tidak pernah melihat rekening yang bukan dari database (saat memuat / API error).
const FALLBACK_BANKS = []

export async function fetchBankAccounts(scope) {
  const qs = scope ? `?scope=${encodeURIComponent(scope)}` : ''
  const res = await fetch(`${PUBLIC_BASE}/api/bank-accounts${qs}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET bank-accounts → ${res.status}`)
  return (await res.json()).data
}

async function mutate(url, method, payload) {
  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: payload ? { 'Content-Type': 'application/json' } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `${method} ${url} → ${res.status}`)
  }
  return res.json()
}

export const createBankAccount = (payload) => mutate(`${BASE}/api/bank-accounts`, 'POST', payload)
export const updateBankAccount = (id, payload) => mutate(`${BASE}/api/bank-accounts/${id}`, 'PUT', payload)
export const deleteBankAccount = (id) => mutate(`${BASE}/api/bank-accounts/${id}`, 'DELETE')

const CHANGE_EVENT = 'bank-accounts:changed'
const CHANGE_KEY = 'lazispln_banks_rev'

function broadcastChange() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CHANGE_EVENT))
  try {
    localStorage.setItem(CHANGE_KEY, String(Date.now()))
  } catch {
    /* abaikan */
  }
}

export function useBankAccounts(scope = 'tentang') {
  const [banks, setBanks] = useState(FALLBACK_BANKS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchBankAccounts(scope)
      .then((data) => {
        if (Array.isArray(data)) {
          setBanks(data)
          setError('')
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [scope])

  useEffect(() => {
    refresh()
    const onChanged = () => refresh()
    const onStorage = (e) => {
      if (e.key === CHANGE_KEY) refresh()
    }
    window.addEventListener(CHANGE_EVENT, onChanged)
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onChanged)
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChanged)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onChanged)
    }
  }, [refresh])

  // saveBank: ada `id` → update, tidak ada → buat baru (scope ikut hook).
  const saveBank = useCallback(
    async (bank) => {
      const payload = { ...bank, scope }
      const saved = bank.id ? await updateBankAccount(bank.id, payload) : await createBankAccount(payload)
      broadcastChange()
      await refresh()
      return saved
    },
    [scope, refresh],
  )

  const removeBank = useCallback(
    async (bank) => {
      const id = bank && typeof bank === 'object' ? bank.id : bank
      if (id == null) return
      await deleteBankAccount(id)
      broadcastChange()
      await refresh()
    },
    [refresh],
  )

  return { banks, loading, error, refresh, saveBank, removeBank }
}
