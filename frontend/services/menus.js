'use client'

import { useCallback, useEffect, useState } from 'react'

// Klien API "Manajemen Menu / Navbar Dinamis" — tabel `menus` + `menu_pages`.
// GET publik (navbar), mutasi butuh sesi admin.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const CHANGE_EVENT = 'menus:changed'
const CHANGE_KEY = 'lazispln_menus_rev'

// Menu bawaan — dipakai kalau API belum siap / gagal, supaya navbar tak kosong.
export const FALLBACK_MENUS = [
  { id: -1, name: 'Kami Peduli', href: '/donatur#programs', templateType: 'system', children: [] },
  { id: -2, name: 'Blog', href: '/donatur/blog', templateType: 'system', children: [] },
  { id: -3, name: 'Tentang Kami', href: '/donatur/tentang-kami', templateType: 'system', children: [] },
  { id: -4, name: 'Daftar Program', href: '/donatur/program', templateType: 'system', children: [] },
  { id: -5, name: 'Kontak Kami', href: '/donatur/kontak-kami', templateType: 'system', children: [] },
]

function broadcast() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CHANGE_EVENT))
  try {
    localStorage.setItem(CHANGE_KEY, String(Date.now()))
  } catch {
    /* abaikan */
  }
}

async function jsonOrThrow(res, label) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error(body.error || `${label} → ${res.status}`)
    err.status = res.status
    err.body = body
    throw err
  }
  return res.json()
}

// ---- fetch helpers ----
export const fetchPublicMenus = () =>
  fetch(`${BASE}/api/menus`, { cache: 'no-store' }).then((r) => jsonOrThrow(r, 'GET menus')).then((d) => d.data || [])

export const fetchAdminMenus = () =>
  fetch(`${BASE}/api/menus/all`, { credentials: 'include', cache: 'no-store' }).then((r) =>
    jsonOrThrow(r, 'GET menus/all'),
  )

export const fetchMenu = (idOrSlug, { preview = false } = {}) =>
  fetch(`${BASE}/api/menus/${encodeURIComponent(idOrSlug)}${preview ? '?preview=1' : ''}`, {
    credentials: 'include',
    cache: 'no-store',
  }).then((r) => jsonOrThrow(r, 'GET menu'))

async function mutate(path, method, payload) {
  const res = await fetch(`${BASE}/api/menus${path}`, {
    method,
    credentials: 'include',
    headers: payload ? { 'Content-Type': 'application/json' } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  })
  const out = await jsonOrThrow(res, `${method} menus${path}`)
  broadcast()
  return out
}

export const createMenu = (payload) => mutate('', 'POST', payload)
export const updateMenu = (id, payload) => mutate(`/${id}`, 'PUT', payload)
export const reorderMenusApi = (items) => mutate('/reorder', 'PUT', { items })
export const saveMenuPage = (id, payload) => mutate(`/${id}/page`, 'PUT', payload)
export const deleteMenu = (id, { cascade = false } = {}) =>
  mutate(`/${id}${cascade ? '?cascade=1' : ''}`, 'DELETE')

// ---- hooks ----
function useChangeSubscription(refresh) {
  useEffect(() => {
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
}

// Navbar publik.
export function usePublicMenus() {
  const [menus, setMenus] = useState([])
  const [ready, setReady] = useState(false)

  const refresh = useCallback(() => {
    return fetchPublicMenus()
      .then((data) => {
        if (Array.isArray(data)) setMenus(data)
      })
      .catch(() => {
        /* diamkan → pakai fallback di komponen */
      })
      .finally(() => setReady(true))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])
  useChangeSubscription(refresh)

  return { menus: menus.length ? menus : ready ? FALLBACK_MENUS : [], ready }
}

// Panel admin.
export function useAdminMenus() {
  const [flat, setFlat] = useState([])
  const [tree, setTree] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchAdminMenus()
      .then((res) => {
        setFlat(res.data || [])
        setTree(res.tree || [])
        setError('')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])
  useChangeSubscription(refresh)

  const saveMenu = useCallback(
    async (payload) => {
      const saved = payload.id ? await updateMenu(payload.id, payload) : await createMenu(payload)
      await refresh()
      return saved
    },
    [refresh],
  )
  const removeMenu = useCallback(
    async (id, opts) => {
      await deleteMenu(id, opts)
      await refresh()
    },
    [refresh],
  )
  const reorderMenus = useCallback(
    async (items) => {
      await reorderMenusApi(items)
      await refresh()
    },
    [refresh],
  )

  return { flat, tree, loading, error, refresh, saveMenu, removeMenu, reorderMenus }
}

// Halaman dinamis /donatur/[slug].
export function useMenuPage(slug, { preview = false } = {}) {
  const [state, setState] = useState({ loading: true, menu: null, page: null, notFound: false })

  const refresh = useCallback(() => {
    if (!slug) return
    setState((s) => ({ ...s, loading: true }))
    fetchMenu(slug, { preview })
      .then(({ menu, page }) => setState({ loading: false, menu, page, notFound: false }))
      .catch((e) =>
        setState({ loading: false, menu: null, page: null, notFound: e.status === 404 }),
      )
  }, [slug, preview])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { ...state, refresh }
}
