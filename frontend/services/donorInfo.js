'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getCache, setCache } from '@/services/memoryCache'

// Klien API "Informasi Donatur" — tabel `donor_info` (satu baris) di backend.
// GET publik, PUT butuh sesi admin.
import { getApiBase, getPublicApiBase } from '@/services/apiBase'
import { devWarn } from '@/services/devLog'
const BASE = getApiBase()
const PUBLIC_BASE = getPublicApiBase()

// Pilihan sumber angka untuk stat "auto" — nama harus sama dengan
// METRIC_KEYS di backend (models/DonorInfo.js).
export const DONOR_STAT_METRICS = [
  { key: 'donatur', label: 'Total donatur (transaksi diterima)' },
  { key: 'dana', label: 'Dana terkumpul (Rp)' },
  { key: 'donasi_terverifikasi', label: 'Jumlah donasi terverifikasi' },
  { key: 'total_donasi', label: 'Total seluruh donasi masuk' },
  { key: 'donasi_program', label: 'Donasi dari Program' },
  { key: 'donasi_tentang', label: 'Donasi dari Tentang Kami' },
]

// Sebelum data API tiba: tanpa angka sama sekali. Angka hanya boleh berasal dari
// database, jadi tidak ada nilai cadangan.
const EMPTY_DONOR_CONTENT = { title: 'Jumlah Donatur Saat Ini', description: '', stats: [] }
const CHANGE_EVENT = 'donor-info:changed'
const CHANGE_KEY = 'lazispln_donor_rev'

export async function fetchDonorInfo() {
  const res = await fetch(`${PUBLIC_BASE}/api/donor-info`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET donor-info → ${res.status}`)
  return res.json()
}

export async function saveDonorInfo(payload) {
  const res = await fetch(`${BASE}/api/donor-info`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `PUT donor-info → ${res.status}`)
  }
  return res.json()
}

function broadcast() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CHANGE_EVENT))
  try {
    localStorage.setItem(CHANGE_KEY, String(Date.now()))
  } catch {
    /* abaikan */
  }
}

export function useDonorContent() {
  const [content, setContent] = useState(() => getCache('donor:content') || EMPTY_DONOR_CONTENT)
  const [loading, setLoading] = useState(() => !getCache('donor:content'))
  // true setelah data asli dari database pernah diterima.
  const [loaded, setLoaded] = useState(() => Boolean(getCache('donor:content')))
  const [error, setError] = useState('')
  const ref = useRef(content)

  const apply = useCallback((next) => {
    setCache('donor:content', next)
    ref.current = next
    setContent(next)
  }, [])

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchDonorInfo()
      .then((data) => {
        if (!data || typeof data !== 'object') return
        const stats = (Array.isArray(data.stats) ? data.stats : []).map((s) => ({
          value: Number(s.value) || 0,
          label: String(s.label || ''),
          source: s.source === 'auto' ? 'auto' : 'manual',
          metric: s.metric || 'donatur',
        }))
        apply({
          title: data.title || EMPTY_DONOR_CONTENT.title,
          description: data.description || '',
          stats,
        })
        setLoaded(true)
        setError('')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [apply])

  useEffect(() => {
    refresh()
    const onChanged = () => refresh()
    const onStorage = (e) => e.key === CHANGE_KEY && refresh()
    window.addEventListener(CHANGE_EVENT, onChanged)
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onChanged)
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChanged)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onChanged)
    }
  }, [refresh])

  // Ganti seluruh dokumen (dipakai form admin) — update tampilan seketika,
  // simpan ke backend di belakang layar.
  const save = useCallback(
    (updater) => {
      const next = typeof updater === 'function' ? updater(ref.current) : updater
      apply(next)
      return saveDonorInfo(next)
        .then(broadcast)
        .catch((err) => {
          setError(err.message)
          devWarn('[donor-info] gagal simpan:', err.message)
        })
    },
    [apply],
  )

  const patch = useCallback((p) => save((c) => ({ ...c, ...p })), [save])

  return { content, save, patch, loading, loaded, error }
}
