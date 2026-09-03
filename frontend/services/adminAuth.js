// Autentikasi admin lewat backend (cookie sesi httpOnly).
// isAdminLoggedIn() hanya "petunjuk" sinkron untuk render pertama —
// selalu dikonfirmasi ulang dengan checkAdminSession() ke /api/auth/me.

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const HINT_KEY = 'lazispln_admin_hint'

// Hanya untuk teks bantuan di halaman login — kredensial asli ada di
// backend/.env (ADMIN_USERNAME / ADMIN_PASSWORD).
export const DEMO_ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' }

function setHint(ok) {
  try {
    if (ok) sessionStorage.setItem(HINT_KEY, '1')
    else sessionStorage.removeItem(HINT_KEY)
  } catch {
    // sessionStorage tidak tersedia — abaikan
  }
}

export async function loginAdmin(username, password) {
  try {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    setHint(res.ok)
    return res.ok
  } catch {
    setHint(false)
    return false
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

export async function checkAdminSession() {
  try {
    const res = await fetch(`${BASE}/api/auth/me`, { credentials: 'include', cache: 'no-store' })
    const { admin } = await res.json()
    setHint(!!admin)
    return !!admin
  } catch {
    return false
  }
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
