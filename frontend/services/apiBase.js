// URL dasar backend API. Kalau halaman dibuka lewat host selain localhost
// (mis. IP LAN 192.168.x.x untuk tes di HP), "localhost" di NEXT_PUBLIC_API_URL
// akan menunjuk ke perangkat itu sendiri dan cookie sesi jadi lintas-situs —
// jadi hostnya diganti mengikuti host halaman yang sedang dibuka.
const ENV_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export function getApiBase() {
  if (typeof window === 'undefined') return ENV_URL
  try {
    const url = new URL(ENV_URL)
    const local = ['localhost', '127.0.0.1']
    if (local.includes(url.hostname) && !local.includes(window.location.hostname)) {
      url.hostname = window.location.hostname
    }
    return url.origin
  } catch {
    return ENV_URL
  }
}
