'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function fetchContent(key) {
  const res = await fetch(`${BASE}/api/content/${key}`, { credentials: 'include', cache: 'no-store' })
  if (!res.ok) throw new Error(`GET ${key} → ${res.status}`)
  return (await res.json()).data
}

export async function putContent(key, data) {
  const res = await fetch(`${BASE}/api/content/${key}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `PUT ${key} → ${res.status}`)
  }
  return (await res.json()).data
}

// Hook generik: baca konten `key` dari API (fallback ke `fallback` kalau API
// belum siap), lalu sediakan `update` yang meng-update state seketika dan
// menyimpan ke API di belakang layar. Section lain yang memakai key sama
// ikut menyegarkan lewat event `site-content:<key>`.
export function useSiteContent(key, fallback) {
  const [content, setContent] = useState(fallback)
  const ref = useRef(fallback)

  const apply = useCallback((next) => {
    ref.current = next
    setContent(next)
  }, [])

  useEffect(() => {
    let alive = true
    const load = () =>
      fetchContent(key)
        .then((data) => {
          if (!alive || !data || typeof data !== 'object') return
          // Isi key top-level yang belum ada di DB dengan nilai default,
          // supaya section baru langsung jalan tanpa harus re-seed.
          const merged =
            Array.isArray(data) || Array.isArray(fallback)
              ? data
              : { ...fallback, ...data }
          apply(merged)
        })
        .catch(() => {})
    load()
    const evt = `site-content:${key}`
    window.addEventListener(evt, load)
    return () => {
      alive = false
      window.removeEventListener(evt, load)
    }
  }, [key, apply])

  const update = useCallback(
    (updater) => {
      const next = typeof updater === 'function' ? updater(ref.current) : updater
      apply(next)
      putContent(key, next)
        .catch((err) => console.warn(`[${key}] gagal simpan:`, err.message))
        .finally(() => window.dispatchEvent(new Event(`site-content:${key}`)))
      return next
    },
    [key, apply],
  )

  return [content, update]
}

// Varian untuk konten berbentuk daftar (array): upsert & hapus per `idField`.
export function useSiteList(key, fallback, idField = 'id') {
  const [raw, update] = useSiteContent(key, fallback)
  const list = Array.isArray(raw) ? raw : fallback

  const save = useCallback(
    (item, { prepend = false } = {}) =>
      update((arr) => {
        const cur = Array.isArray(arr) ? arr : []
        const idx = cur.findIndex((x) => x[idField] === item[idField])
        if (idx >= 0) return cur.map((x, i) => (i === idx ? { ...x, ...item } : x))
        return prepend ? [item, ...cur] : [...cur, item]
      }),
    [update, idField],
  )

  const remove = useCallback(
    (id) => update((arr) => (Array.isArray(arr) ? arr : []).filter((x) => x[idField] !== id)),
    [update, idField],
  )

  return { list, save, remove }
}
