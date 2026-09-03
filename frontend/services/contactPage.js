'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_KONTAK_CONTENT, uid } from '@/app/donatur/kontak-kami/kontakData'

// Klien API konten "Kontak Kami" — tabel `contact_page` (satu baris) di
// backend. GET publik, PUT butuh sesi admin.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const CHANGE_EVENT = 'contact-page:changed'
const CHANGE_KEY = 'lazispln_contact_rev'

export async function fetchContactPage() {
  const res = await fetch(`${BASE}/api/contact`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET contact → ${res.status}`)
  return res.json()
}

export async function saveContactPage(payload) {
  const res = await fetch(`${BASE}/api/contact`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `PUT contact → ${res.status}`)
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

// Gabung hasil API dengan default supaya field yang belum ada tetap terisi.
function merge(data) {
  const d = DEFAULT_KONTAK_CONTENT
  return {
    hero: { ...d.hero, ...(data?.hero || {}) },
    info: Array.isArray(data?.info) && data.info.length ? data.info : d.info,
    form: { ...d.form, ...(data?.form || {}) },
  }
}

export function useKontakContent() {
  const [content, setContent] = useState(DEFAULT_KONTAK_CONTENT)
  const ref = useRef(DEFAULT_KONTAK_CONTENT)

  const apply = useCallback((next) => {
    ref.current = next
    setContent(next)
  }, [])

  const refresh = useCallback(() => {
    return fetchContactPage()
      .then((data) => apply(merge(data)))
      .catch(() => {})
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

  // Update tampilan seketika + simpan seluruh dokumen ke backend.
  const commit = useCallback(
    (updater) => {
      const next = typeof updater === 'function' ? updater(ref.current) : updater
      apply(next)
      saveContactPage(next)
        .then(broadcast)
        .catch((err) => console.warn('[contact] gagal simpan:', err.message))
    },
    [apply],
  )

  const patch = useCallback(
    (section, p) => commit((c) => ({ ...c, [section]: { ...c[section], ...p } })),
    [commit],
  )

  const patchInfo = useCallback(
    (id, p) => commit((c) => ({ ...c, info: c.info.map((it) => (it.id === id ? { ...it, ...p } : it)) })),
    [commit],
  )

  const addInfo = useCallback(
    () =>
      commit((c) => ({
        ...c,
        info: [
          ...c.info,
          { id: uid('info'), type: 'alamat', label: 'Label Baru', value: 'Isi keterangan baru' },
        ],
      })),
    [commit],
  )

  const removeInfo = useCallback(
    (id) => commit((c) => ({ ...c, info: c.info.filter((it) => it.id !== id) })),
    [commit],
  )

  return { content, patch, patchInfo, addInfo, removeInfo }
}
