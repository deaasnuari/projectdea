'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Klien API "Informasi Donatur" — tabel `donor_info` (satu baris) di backend.
// GET publik, PUT butuh sesi admin.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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

// Tampilan awal sebelum data API tiba (offline fallback).
const DEFAULT_DONOR_CONTENT = {
  title: 'Jumlah Donatur Saat Ini',
  description: 'Kepercayaan yang tumbuh dari kebaikan yang dilakukan bersama.',
  stats: [
    { value: 157, label: 'Donatur Zakat', source: 'manual', metric: 'donatur' },
    { value: 21, label: 'Donatur Infaq', source: 'manual', metric: 'donatur' },
    { value: 1, label: 'Donatur Orang Tua Asuh', source: 'manual', metric: 'donatur' },
  ],
}
const CHANGE_EVENT = 'donor-info:changed'
const CHANGE_KEY = 'lazispln_donor_rev'

export async function fetchDonorInfo() {
  const res = await fetch(`${BASE}/api/donor-info`, { cache: 'no-store' })
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
  const [content, setContent] = useState(DEFAULT_DONOR_CONTENT)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const ref = useRef(DEFAULT_DONOR_CONTENT)

  const apply = useCallback((next) => {
    ref.current = next
    setContent(next)
  }, [])

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchDonorInfo()
      .then((data) => {
        if (!data || typeof data !== 'object') return
        // Isi field yang kosong dengan default (mis. tabel belum di-seed).
        const stats =
          Array.isArray(data.stats) && data.stats.length
            ? data.stats.map((s) => ({
                value: Number(s.value) || 0,
                label: String(s.label || ''),
                source: s.source === 'auto' ? 'auto' : 'manual',
                metric: s.metric || 'donatur',
              }))
            : DEFAULT_DONOR_CONTENT.stats
        apply({
          title: data.title || DEFAULT_DONOR_CONTENT.title,
          description: data.description || DEFAULT_DONOR_CONTENT.description,
          stats,
        })
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
          console.warn('[donor-info] gagal simpan:', err.message)
        })
    },
    [apply],
  )

  const patch = useCallback((p) => save((c) => ({ ...c, ...p })), [save])

  return { content, save, patch, loading, error }
}
