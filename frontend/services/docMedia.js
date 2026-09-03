'use client'

import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_KAMI_PEDULI_CONTENT } from '@/app/donatur/sections/kamiPeduliData'

// Klien API "Dokumentasi" Kami Peduli — tabel `doc_videos` & `doc_photos`.
// GET publik, mutasi (POST/PUT/DELETE) butuh sesi admin.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function getList(pathSeg) {
  const res = await fetch(`${BASE}/api/${pathSeg}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET ${pathSeg} → ${res.status}`)
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

// Hook generik untuk satu koleksi dokumentasi.
function useDocCollection(pathSeg, fallback, changeKey) {
  const [items, setItems] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(() => {
    setLoading(true)
    return getList(pathSeg)
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data)
          setError('')
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [pathSeg])

  useEffect(() => {
    refresh()
    const evt = `${changeKey}:changed`
    const stoKey = `lazispln_${changeKey}_rev`
    const onChanged = () => refresh()
    const onStorage = (e) => {
      if (e.key === stoKey) refresh()
    }
    const onVisible = () => document.visibilityState === 'visible' && refresh()
    window.addEventListener(evt, onChanged)
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onChanged)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener(evt, onChanged)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onChanged)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refresh, changeKey])

  const broadcast = useCallback(() => {
    window.dispatchEvent(new Event(`${changeKey}:changed`))
    try {
      localStorage.setItem(`lazispln_${changeKey}_rev`, String(Date.now()))
    } catch {
      /* abaikan */
    }
  }, [changeKey])

  const save = useCallback(
    async (item) => {
      const saved = item.id
        ? await mutate(`${BASE}/api/${pathSeg}/${item.id}`, 'PUT', item)
        : await mutate(`${BASE}/api/${pathSeg}`, 'POST', item)
      broadcast()
      await refresh()
      return saved
    },
    [pathSeg, broadcast, refresh],
  )

  const remove = useCallback(
    async (item) => {
      const id = item && typeof item === 'object' ? item.id : item
      if (id == null) return
      await mutate(`${BASE}/api/${pathSeg}/${id}`, 'DELETE')
      broadcast()
      await refresh()
    },
    [pathSeg, broadcast, refresh],
  )

  return { items, loading, error, refresh, save, remove }
}

export function useDocVideos() {
  const { items, loading, error, refresh, save, remove } = useDocCollection(
    'doc-videos',
    DEFAULT_KAMI_PEDULI_CONTENT.videos,
    'doc-videos',
  )
  return { videos: items, loading, error, refresh, saveVideo: save, removeVideo: remove }
}

export function useDocPhotos() {
  const { items, loading, error, refresh, save, remove } = useDocCollection(
    'doc-photos',
    DEFAULT_KAMI_PEDULI_CONTENT.galeri,
    'doc-photos',
  )
  return { photos: items, loading, error, refresh, savePhoto: save, removePhoto: remove }
}
