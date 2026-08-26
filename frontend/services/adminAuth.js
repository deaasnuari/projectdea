// "Autentikasi" admin versi prototipe — belum ada backend, jadi ini BUKAN
// keamanan sungguhan (siapa pun yang tahu cara buka DevTools bisa
// melewatinya). Fungsinya cuma menahan navigasi biasa ke /admin supaya
// panel admin tidak langsung kebuka tanpa lewat halaman login, sambil
// menunggu autentikasi asli tersambung ke backend.
const SESSION_KEY = 'lazispln_admin_session'

// Kredensial demo — ganti dengan verifikasi ke backend begitu sudah ada.
export const DEMO_ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' }

export function loginAdmin(username, password) {
  if (username !== DEMO_ADMIN_CREDENTIALS.username || password !== DEMO_ADMIN_CREDENTIALS.password) {
    return false
  }
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    // sessionStorage tidak tersedia (mis. mode privat) — abaikan saja.
  }
  return true
}

export function logoutAdmin() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // abaikan
  }
}

export function isAdminLoggedIn() {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}
