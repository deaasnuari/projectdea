'use client'

import { useCallback, useEffect, useState } from 'react'

// Editor teks visual (ala WordPress). Tiap elemen teks ber-`elementKey` unik
// menyimpan ISI + styling-nya di tabel `text_elements`. GET publik, PUT/DELETE
// butuh sesi admin. Kalau elemen belum ada di DB → komponen pakai style bawaan.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const STYLE_FIELDS = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'textDecoration',
  'textColor',
  'textAlign',
  'lineHeight',
  'letterSpacing',
]

// Pilihan font untuk toolbar. "stack" dipakai sebagai nilai CSS font-family.
// Font dekoratif dimuat lewat <link> Google Fonts di app/layout.js.
export const FONT_FAMILY_OPTIONS = [
  { label: 'Bawaan', value: '' },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Fraunces', value: "'Fraunces', Georgia, serif" },
  { label: 'Poppins', value: "'Poppins', sans-serif" },
  { label: 'Playfair Display', value: "'Playfair Display', Georgia, serif" },
  { label: 'Merriweather', value: "'Merriweather', Georgia, serif" },
  { label: 'Roboto Slab', value: "'Roboto Slab', Georgia, serif" },
  { label: 'Lobster', value: "'Lobster', cursive" },
  { label: 'Pacifico', value: "'Pacifico', cursive" },
  { label: 'Irish Grover', value: "'Irish Grover', system-ui, cursive" },
]

export const FONT_WEIGHT_OPTIONS = [
  { label: 'Bawaan', value: '' },
  { label: 'Thin', value: '300' },
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semibold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' },
]

export const TEXT_ALIGN_OPTIONS = ['left', 'center', 'right', 'justify']

// Ubah satu baris DB jadi object style React (hanya field yang terisi).
export function styleToCss(row) {
  if (!row) return undefined
  const s = {}
  if (row.fontFamily) s.fontFamily = row.fontFamily
  if (row.fontSize) s.fontSize = row.fontSize
  if (row.fontWeight) s.fontWeight = row.fontWeight
  if (row.fontStyle) s.fontStyle = row.fontStyle
  if (row.textDecoration) s.textDecoration = row.textDecoration
  if (row.textColor) s.color = row.textColor
  if (row.textAlign) s.textAlign = row.textAlign
  if (row.lineHeight) s.lineHeight = row.lineHeight
  if (row.letterSpacing) s.letterSpacing = row.letterSpacing
  return Object.keys(s).length ? s : undefined
}

const CHANGE_EVENT = 'text-elements:changed'
const CHANGE_KEY = 'lazispln_text_elements_rev'

export async function fetchTextElements(page) {
  const qs = page ? `?page=${encodeURIComponent(page)}` : ''
  const res = await fetch(`${BASE}/api/text-elements${qs}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET text-elements → ${res.status}`)
  return (await res.json()).data || []
}

export async function saveTextElement(elementKey, payload) {
  const res = await fetch(`${BASE}/api/text-elements/${encodeURIComponent(elementKey)}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const b = await res.json().catch(() => ({}))
    throw new Error(b.error || `PUT text-elements → ${res.status}`)
  }
  return res.json()
}

export async function deleteTextElement(elementKey) {
  const res = await fetch(`${BASE}/api/text-elements/${encodeURIComponent(elementKey)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    const b = await res.json().catch(() => ({}))
    throw new Error(b.error || `DELETE text-elements → ${res.status}`)
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

// Ambil semua elemen sebuah halaman sekali; komponen individual baca dari sini.
export function useTextElements(page) {
  const [map, setMap] = useState(() => new Map())
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchTextElements(page)
      .then((rows) => {
        const m = new Map()
        for (const r of rows) m.set(r.elementKey, r)
        setMap(m)
      })
      .catch(() => {
        /* offline → biarkan komponen pakai bawaan */
      })
      .finally(() => setLoading(false))
  }, [page])

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
    async (elementKey, payload) => {
      const saved = await saveTextElement(elementKey, payload)
      setMap((prev) => {
        const m = new Map(prev)
        m.set(elementKey, saved)
        return m
      })
      broadcast()
      return saved
    },
    [],
  )

  const reset = useCallback(async (elementKey) => {
    await deleteTextElement(elementKey)
    setMap((prev) => {
      const m = new Map(prev)
      m.delete(elementKey)
      return m
    })
    broadcast()
  }, [])

  return { map, loading, refresh, save, reset }
}
