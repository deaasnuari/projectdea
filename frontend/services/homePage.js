'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_KAMI_PEDULI_CONTENT } from '@/app/donatur/sections/kamiPeduliData'

// Klien API konten "Kami Peduli" (Konten Situs) — tabel `home_page` (satu
// baris) di backend. GET publik, PUT butuh sesi admin.
// Daftar video & foto galeri TIDAK di sini — sudah lewat services/docMedia.js
// (tabel doc_videos / doc_photos).
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const CHANGE_EVENT = 'home-page:changed'
const CHANGE_KEY = 'lazispln_home_rev'

export async function fetchHomePage() {
  const res = await fetch(`${BASE}/api/home`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET home → ${res.status}`)
  return res.json()
}

export async function saveHomePage(payload) {
  const res = await fetch(`${BASE}/api/home`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `PUT home → ${res.status}`)
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

// Lengkapi key top-level yang belum ada dari default (mis. tabel belum
// di-seed / ada section baru). videos & galeri selalu dari default (fallback
// offline) — tampilan aslinya diambil komponen dari services/docMedia.js.
function merge(data) {
  const d = DEFAULT_KAMI_PEDULI_CONTENT
  if (!data || typeof data !== 'object' || Array.isArray(data)) return d
  return { ...d, ...data, videos: d.videos, galeri: d.galeri }
}

export function useKamiPeduliContent() {
  const [content, setContent] = useState(DEFAULT_KAMI_PEDULI_CONTENT)
  const ref = useRef(DEFAULT_KAMI_PEDULI_CONTENT)

  const apply = useCallback((next) => {
    ref.current = next
    setContent(next)
  }, [])

  const refresh = useCallback(
    () =>
      fetchHomePage()
        .then((data) => apply(merge(data)))
        .catch(() => {}),
    [apply],
  )

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

  // Update tampilan seketika + simpan seluruh dokumen ke backend.
  const commit = useCallback(
    (updater) => {
      const next = typeof updater === 'function' ? updater(ref.current) : updater
      apply(next)
      saveHomePage(next)
        .then(broadcast)
        .catch((err) => console.warn('[home] gagal simpan:', err.message))
      return next
    },
    [apply],
  )

  const patchSection = useCallback(
    (section, patch) => commit((c) => ({ ...c, [section]: { ...c[section], ...patch } })),
    [commit],
  )

  const patchListItem = useCallback(
    (listKey, id, patch) =>
      commit((c) => ({
        ...c,
        [listKey]: (c[listKey] || []).map((item) => (item.id === id ? { ...item, ...patch } : item)),
      })),
    [commit],
  )

  const addListItem = useCallback(
    (listKey, item) => commit((c) => ({ ...c, [listKey]: [...(c[listKey] || []), item] })),
    [commit],
  )

  const removeListItem = useCallback(
    (listKey, id) =>
      commit((c) => ({ ...c, [listKey]: (c[listKey] || []).filter((item) => item.id !== id) })),
    [commit],
  )

  const setTopField = useCallback((key, value) => commit((c) => ({ ...c, [key]: value })), [commit])

  // FAQ Konsultasi (nested di dalam `konsultasi`).
  const patchFaq = useCallback(
    (id, patch) =>
      commit((c) => ({
        ...c,
        konsultasi: {
          ...c.konsultasi,
          faqs: (c.konsultasi?.faqs || []).map((f) => (f.id === id ? { ...f, ...patch } : f)),
        },
      })),
    [commit],
  )
  const addFaq = useCallback(
    () =>
      commit((c) => ({
        ...c,
        konsultasi: {
          ...c.konsultasi,
          faqs: [
            ...(c.konsultasi?.faqs || []),
            {
              id: `faq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              q: 'Pertanyaan baru?',
              a: 'Jawaban.',
            },
          ],
        },
      })),
    [commit],
  )
  const removeFaq = useCallback(
    (id) =>
      commit((c) => ({
        ...c,
        konsultasi: { ...c.konsultasi, faqs: (c.konsultasi?.faqs || []).filter((f) => f.id !== id) },
      })),
    [commit],
  )

  return {
    content,
    patchSection,
    patchListItem,
    addListItem,
    removeListItem,
    setTopField,
    patchFaq,
    addFaq,
    removeFaq,
  }
}
