// URL backend API. Ada dua jenis:
//
//  getApiBase()       - untuk request yang MEMBAWA SESI ADMIN (credentials: 'include').
//  getPublicApiBase() - untuk request publik tanpa cookie (baca konten, CAPTCHA, kirim form).
//
// Kenapa dibedakan: di production frontend dan backend beda situs (dua subdomain
// *.vercel.app dihitung beda situs), sehingga cookie sesi SameSite=Lax tidak pernah
// tersimpan/terkirim dan admin terlempar lagi ke /login. Karena itu request bersesi
// dikirim ke domain frontend sendiri (/api/...) lalu diteruskan ke backend lewat
// rewrites di next.config.js, sehingga cookie menjadi first-party. Request publik tetap
// langsung ke backend supaya rate limit per IP tetap melihat IP pengunjung seperti biasa.
//
// Proxy hanya aktif kalau NEXT_PUBLIC_API_URL berupa https non-lokal. Aturannya harus
// sama dengan rewrites di next.config.js. Lokal (http://localhost:3001) tidak berubah.
const ENV_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const LOCAL_HOSTS = ['localhost', '127.0.0.1']

function usesProxy() {
  try {
    const url = new URL(ENV_URL)
    return url.protocol === 'https:' && !LOCAL_HOSTS.includes(url.hostname)
  } catch {
    return false
  }
}

// Alamat backend langsung. Kalau halaman dibuka lewat host selain localhost
// (mis. IP LAN 192.168.x.x untuk tes di HP), "localhost" di NEXT_PUBLIC_API_URL
// akan menunjuk ke perangkat itu sendiri dan cookie sesi jadi lintas-situs —
// jadi hostnya diganti mengikuti host halaman yang sedang dibuka.
export function getPublicApiBase() {
  if (typeof window === 'undefined') return ENV_URL
  try {
    const url = new URL(ENV_URL)
    if (LOCAL_HOSTS.includes(url.hostname) && !LOCAL_HOSTS.includes(window.location.hostname)) {
      url.hostname = window.location.hostname
    }
    return url.origin
  } catch {
    return ENV_URL
  }
}

// Alamat untuk request bersesi. '' = same-origin (lewat proxy). Di server (SSR)
// tidak ada cookie browser dan fetch butuh URL absolut, jadi tetap langsung.
export function getApiBase() {
  if (typeof window !== 'undefined' && usesProxy()) return ''
  return getPublicApiBase()
}
