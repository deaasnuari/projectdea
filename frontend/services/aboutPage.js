'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_TENTANG_CONTENT } from '@/app/donatur/tentang-kami/tentangData'

// Klien API konten "Tentang Kami" — tabel `about_page` (satu baris) di
// backend. GET publik, PUT butuh sesi admin. Daftar anggota tim TIDAK di
// sini (tetap lewat services/team.js → tabel team_members).
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const CHANGE_EVENT = 'about-page:changed'
const CHANGE_KEY = 'lazispln_about_rev'

export async function fetchAboutPage() {
  const res = await fetch(`${BASE}/api/about`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET about → ${res.status}`)
  return res.json()
}

export async function saveAboutPage(payload) {
  const res = await fetch(`${BASE}/api/about`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `PUT about → ${res.status}`)
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

// Isi field top-level yang belum ada dari default, supaya section baru tetap
// jalan tanpa harus re-seed.
function merge(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return DEFAULT_TENTANG_CONTENT
  return { ...DEFAULT_TENTANG_CONTENT, ...data }
}

export function useTentangContent() {
  const [content, setContent] = useState(DEFAULT_TENTANG_CONTENT)
  const ref = useRef(DEFAULT_TENTANG_CONTENT)

  const apply = useCallback((next) => {
    ref.current = next
    setContent(next)
  }, [])

  const refresh = useCallback(
    () =>
      fetchAboutPage()
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
      saveAboutPage(next)
        .then(broadcast)
        .catch((err) => console.warn('[about] gagal simpan:', err.message))
      return next
    },
    [apply],
  )

  const patch = useCallback(
    (section, p) => commit((c) => ({ ...c, [section]: { ...c[section], ...p } })),
    [commit],
  )

  const patchListItem = useCallback(
    (listKey, id, p) =>
      commit((c) => ({
        ...c,
        [listKey]: (c[listKey] || []).map((it) => (it.id === id ? { ...it, ...p } : it)),
      })),
    [commit],
  )

  const addListItem = useCallback(
    (listKey, item) => commit((c) => ({ ...c, [listKey]: [...(c[listKey] || []), item] })),
    [commit],
  )

  const removeListItem = useCallback(
    (listKey, id) => commit((c) => ({ ...c, [listKey]: (c[listKey] || []).filter((it) => it.id !== id) })),
    [commit],
  )

  return { content, patch, patchListItem, addListItem, removeListItem }
}
