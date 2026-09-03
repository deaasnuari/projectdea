'use client'

import { useCallback, useEffect, useState } from 'react'

// Klien API jenis donasi — tabel `donation_types` di backend, per `scope`
// ('tentang' | 'program'). GET publik, mutasi butuh sesi admin.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Tampilan awal sebelum data API tiba (offline fallback).
const FALLBACK_JENIS = [
  { id: 'zakat-profesi', key: 'zakat-profesi', label: 'Zakat Profesi', programLabel: 'Zakat Profesi Karyawan' },
  { id: 'zakat-maal', key: 'zakat-maal', label: 'Zakat Maal', programLabel: 'Zakat Maal' },
  { id: 'infaq', key: 'infaq', label: 'Infaq', programLabel: 'Infaq' },
  { id: 'shadaqah', key: 'shadaqah', label: 'Shadaqah', programLabel: 'Shadaqah' },
  { id: 'fidyah', key: 'fidyah', label: 'Fidyah', programLabel: 'Fidyah' },
  { id: 'wakaf', key: 'wakaf', label: 'Wakaf', programLabel: 'Wakaf' },
]

export async function fetchDonationTypes(scope) {
  const qs = scope ? `?scope=${encodeURIComponent(scope)}` : ''
  const res = await fetch(`${BASE}/api/donation-types${qs}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET donation-types → ${res.status}`)
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

export const createDonationType = (payload) => mutate(`${BASE}/api/donation-types`, 'POST', payload)
export const updateDonationType = (id, payload) => mutate(`${BASE}/api/donation-types/${id}`, 'PUT', payload)
export const deleteDonationType = (id) => mutate(`${BASE}/api/donation-types/${id}`, 'DELETE')

const CHANGE_EVENT = 'donation-types:changed'
const CHANGE_KEY = 'lazispln_jenis_rev'

function broadcastChange() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CHANGE_EVENT))
  try {
    localStorage.setItem(CHANGE_KEY, String(Date.now()))
  } catch {
    /* abaikan */
  }
}

export function useDonationTypes(scope = 'tentang') {
  const [jenis, setJenis] = useState(FALLBACK_JENIS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchDonationTypes(scope)
      .then((data) => {
        if (Array.isArray(data)) {
          setJenis(data)
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

  const saveJenis = useCallback(
    async (item) => {
      const payload = { ...item, scope }
      const saved = item.id ? await updateDonationType(item.id, payload) : await createDonationType(payload)
      broadcastChange()
      await refresh()
      return saved
    },
    [scope, refresh],
  )

  const removeJenis = useCallback(
    async (item) => {
      const id = item && typeof item === 'object' ? item.id : item
      if (id == null) return
      await deleteDonationType(id)
      broadcastChange()
      await refresh()
    },
    [refresh],
  )

  return { jenis, loading, error, refresh, saveJenis, removeJenis }
}
