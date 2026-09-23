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
  // credentials:'include' WAJIB — tanpa cookie sesi, backend menganggap ini
  // request publik dan cuma balas nilai live (bukan draft admin sendiri
  // yang baru saja disimpan lewat Simpan Semua), jadi editor terlihat
  // "balik ke semula" padahal draft-nya sebenarnya sudah tersimpan.
  const res = await fetch(`${BASE}/api/text-elements${qs}`, { cache: 'no-store', credentials: 'include' })
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

// "Selesai Edit" — publikasikan seluruh draft halaman ini (yang sebelumnya
// ditahan lewat saveTextElement/deleteTextElement) supaya baru sekarang
// kelihatan di halaman publik/donatur.
export async function publishTextElements(page) {
  const res = await fetch(`${BASE}/api/text-elements/publish`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page }),
  })
  if (!res.ok) {
    const b = await res.json().catch(() => ({}))
    throw new Error(b.error || `POST text-elements/publish → ${res.status}`)
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
//
// Semua perubahan (teks, styling, posisi, lebar, gambar) TIDAK langsung
// dikirim ke server. Komponen editor memanggil `stage()` / `stageReset()`
// yang cuma menahan perubahan di memori (state `pending*`) — `get()`
// langsung mengembalikan versi gabungan (tersimpan + tahanan) supaya
// pratinjau tetap terasa langsung. Baru saat admin klik "Simpan Semua"
// (`saveAll`) seluruh tahanan itu dikirim sekaligus ke database.
export function useTextElements(page) {
  const [map, setMap] = useState(() => new Map())
  const [loading, setLoading] = useState(true)
  const [pendingPatches, setPendingPatches] = useState(() => new Map()) // elementKey -> payload belum dikirim
  const [pendingResets, setPendingResets] = useState(() => new Set()) // elementKey yang ditahan untuk direset

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

  // Tahan perubahan (belum kirim ke server). Menggabung dengan tahanan
  // sebelumnya untuk elemen yang sama, dan membatalkan tahanan "reset"
  // kalau elemen itu diedit lagi.
  const stage = useCallback((elementKey, payload) => {
    setPendingPatches((prev) => {
      const m = new Map(prev)
      m.set(elementKey, { ...(m.get(elementKey) || {}), ...payload })
      return m
    })
    setPendingResets((prev) => {
      if (!prev.has(elementKey)) return prev
      const s = new Set(prev)
      s.delete(elementKey)
      return s
    })
  }, [])

  // Tahan permintaan "kembalikan ke bawaan" — dieksekusi saat Simpan Semua.
  const stageReset = useCallback((elementKey) => {
    setPendingResets((prev) => new Set(prev).add(elementKey))
    setPendingPatches((prev) => {
      if (!prev.has(elementKey)) return prev
      const m = new Map(prev)
      m.delete(elementKey)
      return m
    })
  }, [])

  // Versi gabungan: tersimpan di DB + tahanan yang belum dikirim.
  const get = useCallback(
    (elementKey) => {
      if (pendingResets.has(elementKey)) return null
      const base = map.get(elementKey) || null
      const patch = pendingPatches.get(elementKey)
      if (!patch) return base
      return { ...base, ...patch }
    },
    [map, pendingPatches, pendingResets],
  )

  const pendingCount = pendingPatches.size + pendingResets.size

  // Cegah tab ditutup/direfresh tanpa sadar selagi ada perubahan yang belum
  // dikirim ke database (masih di memori, hilang kalau halaman ditutup).
  useEffect(() => {
    if (pendingCount === 0) return
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [pendingCount])

  // Kirim SEMUA tahanan sekaligus. Yang gagal tetap tertahan supaya bisa
  // dicoba lagi, yang sukses dibersihkan dari tahanan & masuk ke `map`.
  const saveAll = useCallback(async () => {
    const patchEntries = Array.from(pendingPatches.entries())
    const resetKeys = Array.from(pendingResets)
    const failedPatches = new Map()
    const failedResets = new Set()
    let okCount = 0

    for (const key of resetKeys) {
      try {
        await deleteTextElement(key)
        setMap((prev) => {
          const m = new Map(prev)
          m.delete(key)
          return m
        })
        okCount += 1
      } catch {
        failedResets.add(key)
      }
    }

    for (const [key, payload] of patchEntries) {
      try {
        const saved = await saveTextElement(key, payload)
        setMap((prev) => {
          const m = new Map(prev)
          m.set(key, saved)
          return m
        })
        okCount += 1
      } catch {
        failedPatches.set(key, payload)
      }
    }

    setPendingPatches(failedPatches)
    setPendingResets(failedResets)
    if (okCount > 0) broadcast()

    return { okCount, failedCount: failedPatches.size + failedResets.size }
  }, [pendingPatches, pendingResets])

  const discardAll = useCallback(() => {
    setPendingPatches(new Map())
    setPendingResets(new Set())
  }, [])

  // "Selesai Edit" — publikasikan seluruh draft halaman ini (yang sudah
  // masuk DB lewat saveAll sebelumnya) supaya baru sekarang tampil di
  // halaman publik/donatur. Refresh sesudahnya supaya `map` konsisten
  // dengan kolom live yang baru saja ditulis.
  const publish = useCallback(async () => {
    const result = await publishTextElements(page)
    if (result.publishedCount > 0) {
      await refresh()
      broadcast()
    }
    return result
  }, [page, refresh])

  return {
    map,
    loading,
    refresh,
    get,
    stage,
    stageReset,
    saveAll,
    discardAll,
    publish,
    pendingCount,
  }
}
