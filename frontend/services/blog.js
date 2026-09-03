'use client'

import { useCallback, useEffect, useState } from 'react'
import { POSTS } from '@/app/donatur/blog/blogData'

// Klien API untuk artikel "Blog & Kursus" — tabel khusus `blog_posts` di
// backend (bukan lagi dokumen JSON di site_content). GET publik, mutasi
// (POST/PUT/DELETE) butuh sesi admin.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function fetchPosts() {
  const res = await fetch(`${BASE}/api/blog`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET blog → ${res.status}`)
  return (await res.json()).data
}

export async function fetchPost(slug) {
  const res = await fetch(`${BASE}/api/blog/${encodeURIComponent(slug)}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GET blog/${slug} → ${res.status}`)
  return res.json()
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

export const createPost = (payload) => mutate(`${BASE}/api/blog`, 'POST', payload)
export const updatePost = (id, payload) => mutate(`${BASE}/api/blog/${id}`, 'PUT', payload)
export const deletePost = (id) => mutate(`${BASE}/api/blog/${id}`, 'DELETE')

// Bantu-bantu tanggal (dipindah ke services/dateText.js supaya bisa dipakai
// bersama fitur lain). `formatBlogDate` dipertahankan sebagai alias lama.
export { toDateInputValue, formatDateID as formatBlogDate } from './dateText'

// Dipakai untuk memberi tahu instance hook lain (halaman publik yang sedang
// terbuka, atau tab lain) bahwa daftar artikel berubah → mereka fetch ulang.
const CHANGE_EVENT = 'blog:changed'
const CHANGE_KEY = 'lazispln_blog_rev'

function broadcastChange() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CHANGE_EVENT)) // tab yang sama
  try {
    localStorage.setItem(CHANGE_KEY, String(Date.now())) // tab lain (event `storage`)
  } catch {
    /* abaikan */
  }
}

// Hook dipakai di halaman publik & admin. `POSTS` jadi tampilan awal
// (offline fallback) sampai data dari API tiba.
export function useBlogPosts() {
  const [posts, setPosts] = useState(POSTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchPosts()
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data)
          setError('')
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refresh()

    const onChanged = () => refresh()
    const onStorage = (e) => {
      if (e.key === CHANGE_KEY) refresh()
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    window.addEventListener(CHANGE_EVENT, onChanged)
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onChanged)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChanged)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onChanged)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refresh])

  // savePost: ada `id` → update, tidak ada → buat baru.
  const savePost = useCallback(
    async (post) => {
      const saved = post.id ? await updatePost(post.id, post) : await createPost(post)
      broadcastChange()
      await refresh()
      return saved
    },
    [refresh],
  )

  // removePost: terima objek artikel atau id-nya langsung.
  const removePost = useCallback(
    async (post) => {
      const id = post && typeof post === 'object' ? post.id : post
      if (id == null) return
      await deletePost(id)
      broadcastChange()
      await refresh()
    },
    [refresh],
  )

  return { posts, loading, error, refresh, savePost, removePost }
}
