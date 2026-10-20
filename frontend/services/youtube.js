import { getApiBase } from '@/services/apiBase'

// Bantu ekstrak ID video YouTube dari berbagai bentuk URL, lalu turunkan
// URL thumbnail & URL tonton yang rapi. Dipakai halaman admin Dokumentasi
// supaya admin cukup menempel link YouTube — thumbnail-nya otomatis.

export function youtubeId(input) {
  if (!input) return ''
  const s = String(input).trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s // sudah berupa ID

  try {
    const u = new URL(s)
    if (u.hostname.replace(/^www\./, '') === 'youtu.be') {
      return u.pathname.slice(1, 12)
    }
    const v = u.searchParams.get('v')
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v
    const m = u.pathname.match(/\/(?:embed|shorts|v)\/([a-zA-Z0-9_-]{11})/)
    if (m) return m[1]
  } catch {
    // bukan URL yang valid — abaikan
  }
  return ''
}

// Thumbnail YouTube yang tersimpan di DB (img.youtube.com / i.ytimg.com) →
// diambil lewat backend sendiri, supaya tidak ada request & cookie pihak ketiga.
export function localThumb(url) {
  const m = /^https?:\/\/(?:img\.youtube\.com|i\.ytimg\.com)\/vi\/([a-zA-Z0-9_-]{11})\//.exec(url || '')
  return m ? `${getApiBase()}/api/yt-thumb/${m[1]}` : url
}

export function youtubeThumb(input) {
  const id = youtubeId(input)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ''
}

export function youtubeWatchUrl(input) {
  const id = youtubeId(input)
  return id ? `https://www.youtube.com/watch?v=${id}` : String(input || '').trim()
}
