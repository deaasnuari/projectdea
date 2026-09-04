'use client'

import { useCallback, useEffect, useState } from 'react'

// Pengaturan tipografi halaman "Kami Peduli" — tabel `page_typography`
// (baris id 12345) di backend. GET publik, PUT & reset butuh sesi admin.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const DEFAULT_TYPO = { bodyFont: 'default', headingFont: 'default', fontScale: 1 }

// Stack font — hanya font web-safe / yang sudah dimuat (Inter & Fraunces via
// next/font), jadi tidak perlu memuat font eksternal.
export const BODY_FONT_OPTIONS = [
  { key: 'default', label: 'Bawaan (Inter)', stack: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  { key: 'serif', label: 'Serif Klasik', stack: "Georgia, 'Times New Roman', Times, serif" },
  { key: 'system', label: 'Font Sistem', stack: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
  { key: 'rounded', label: 'Membulat', stack: "'Trebuchet MS', 'Segoe UI', Verdana, sans-serif" },
  { key: 'mono', label: 'Monospace', stack: "ui-monospace, 'Cascadia Code', 'Courier New', monospace" },
]

export const HEADING_FONT_OPTIONS = [
  { key: 'default', label: 'Bawaan (Fraunces)', stack: "var(--font-heading), Georgia, 'Times New Roman', serif" },
  { key: 'match-body', label: 'Ikut Font Isi', stack: 'inherit' },
  { key: 'serif', label: 'Serif Klasik', stack: "Georgia, 'Times New Roman', Times, serif" },
  { key: 'sans', label: 'Sans Tegas', stack: "'Segoe UI', system-ui, -apple-system, Roboto, sans-serif" },
  { key: 'slab', label: 'Slab / Tebal', stack: "'Rockwell', 'Courier New', Georgia, serif" },
]

export const FONT_SCALE_OPTIONS = [
  { key: 0.85, label: 'Kecil' },
  { key: 1, label: 'Normal' },
  { key: 1.1, label: 'Besar' },
  { key: 1.25, label: 'Sangat Besar' },
]

export function bodyFontStack(key) {
  return (BODY_FONT_OPTIONS.find((o) => o.key === key) || BODY_FONT_OPTIONS[0]).stack
}
export function headingFontStack(key) {
  return (HEADING_FONT_OPTIONS.find((o) => o.key === key) || HEADING_FONT_OPTIONS[0]).stack
}

// Gaya inline untuk wrapper .kp-typography.
export function typographyVars(typo) {
  const t = typo || DEFAULT_TYPO
  return {
    '--kp-body-font': bodyFontStack(t.bodyFont),
    '--kp-heading-font': headingFontStack(t.headingFont),
    '--kp-scale': String(t.fontScale || 1),
  }
}

const CHANGE_EVENT = 'page-typography:changed'
const CHANGE_KEY = 'lazispln_typography_rev'

export async function fetchTypography() {
  const res = await fetch(`${BASE}/api/page-typography`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET page-typography → ${res.status}`)
  return res.json()
}

async function send(url, method) {
  const res = await fetch(url, { method, credentials: 'include' })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `${method} ${url} → ${res.status}`)
  }
  return res.json()
}

export async function saveTypography(payload) {
  const res = await fetch(`${BASE}/api/page-typography`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `PUT page-typography → ${res.status}`)
  }
  return res.json()
}

export const resetTypography = () => send(`${BASE}/api/page-typography/reset`, 'POST')

function broadcast() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CHANGE_EVENT))
  try {
    localStorage.setItem(CHANGE_KEY, String(Date.now()))
  } catch {
    /* abaikan */
  }
}

function normalize(data) {
  if (!data || typeof data !== 'object') return { ...DEFAULT_TYPO }
  return {
    bodyFont: data.bodyFont || 'default',
    headingFont: data.headingFont || 'default',
    fontScale: Number(data.fontScale) || 1,
  }
}

export function usePageTypography() {
  const [typo, setTypo] = useState(DEFAULT_TYPO)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchTypography()
      .then((d) => {
        setTypo(normalize(d))
        setError('')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

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

  const save = useCallback(
    async (patch) => {
      const next = normalize({ ...typo, ...patch })
      setTypo(next) // optimistis
      const saved = await saveTypography(next)
      setTypo(normalize(saved))
      broadcast()
      return saved
    },
    [typo],
  )

  const reset = useCallback(async () => {
    const saved = await resetTypography()
    setTypo(normalize(saved))
    broadcast()
    return saved
  }, [])

  return { typo, loading, error, refresh, save, reset }
}
