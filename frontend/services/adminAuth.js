// Autentikasi admin lewat backend (cookie sesi httpOnly).
// isAdminLoggedIn() hanya "petunjuk" sinkron untuk render pertama —
// selalu dikonfirmasi ulang dengan checkAdminSession() ke /api/auth/me.

import { getApiBase } from '@/services/apiBase'
const BASE = getApiBase()
const HINT_KEY = 'lazispln_admin_hint'

function setHint(ok) {
  try {
    if (ok) sessionStorage.setItem(HINT_KEY, '1')
    else sessionStorage.removeItem(HINT_KEY)
  } catch {
    // sessionStorage tidak tersedia — abaikan
  }
}

// Mengembalikan { ok, error }. `error` berisi pesan dari server (mis. akun
// terkunci karena terlalu banyak percobaan) atau pesan koneksi.
export async function loginAdmin(username, password) {
  try {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    setHint(res.ok)
    if (res.ok) return { ok: true, error: '' }
    const data = await res.json().catch(() => ({}))
    return { ok: false, error: data.error || `Login gagal (${res.status})` }
  } catch {
    setHint(false)
    return { ok: false, error: `Server tidak dapat dihubungi (${BASE}). Pastikan backend berjalan.` }
  }
}

export async function logoutAdmin() {
  try {
    await fetch(`${BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' })
  } catch {
    // abaikan — hint tetap dibersihkan
  }
  setHint(false)
}

// Mengembalikan true (login), false (belum login), atau null (gagal
// menghubungi server / respons error) — null BUKAN berarti belum login,
// jadi pemanggil sebaiknya mencoba ulang alih-alih langsung menolak.
export async function checkAdminSessionState() {
  try {
    const res = await fetch(`${BASE}/api/auth/me`, { credentials: 'include', cache: 'no-store' })
    if (!res.ok) return null
    const { admin } = await res.json()
    setHint(!!admin)
    return !!admin
  } catch {
    return null
  }
}

export async function checkAdminSession() {
  return (await checkAdminSessionState()) === true
}

// Profil ringkas admin dari sesi aktif (untuk ditampilkan di panel).
export async function getAdminProfile() {
  try {
    const res = await fetch(`${BASE}/api/auth/me`, { credentials: 'include', cache: 'no-store' })
    const data = await res.json()
    return data.admin ? { username: data.username || 'admin', loginAt: data.loginAt || null } : null
  } catch {
    return null
  }
}

export function isAdminLoggedIn() {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(HINT_KEY) === '1'
  } catch {
    return false
  }
}
