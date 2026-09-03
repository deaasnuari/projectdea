'use client'

import { useCallback, useEffect, useState } from 'react'

// Klien API rekening bank — tabel `bank_accounts` di backend, per `scope`
// ('tentang' | 'program'). GET publik (dipakai modal donasi), mutasi butuh
// sesi admin.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Tampilan awal sebelum data API tiba (offline fallback).
const FALLBACK_BANKS = [
  { id: 'bsi', name: 'BSI (Bank Syariah Indonesia)', short: 'BSI', noRek: '7123 456 789', badgeClass: 'bg-[#00754A]' },
  { id: 'mandiri', name: 'Bank Mandiri', short: 'MDR', noRek: '109 0001 23456', badgeClass: 'bg-[#003D79]' },
  { id: 'bri', name: 'BRI', short: 'BRI', noRek: '0026 01 099999 50 9', badgeClass: 'bg-[#00529C]' },
]

export async function fetchBankAccounts(scope) {
  const qs = scope ? `?scope=${encodeURIComponent(scope)}` : ''
  const res = await fetch(`${BASE}/api/bank-accounts${qs}`, { cache: 'no-store' })
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
