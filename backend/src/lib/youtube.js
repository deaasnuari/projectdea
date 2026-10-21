// Link video hanya boleh YouTube. Diambil ID-nya lalu dibentuk ulang jadi
// alamat tetap https://www.youtube.com/watch?v=ID — alamat lain (mis.
// "javascript:..." atau situs asing) ditolak, jadi tidak bisa disusupi lewat
// kolom link video.
const ID_RE = /^[A-Za-z0-9_-]{11}$/

function youtubeId(input) {
  const s = String(input || '').trim()
  if (ID_RE.test(s)) return s
  let u
  try {
    u = new URL(s)
  } catch {
    return ''
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return ''
  const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '')
  if (host === 'youtu.be') return ID_RE.test(u.pathname.slice(1, 12)) ? u.pathname.slice(1, 12) : ''
  if (host !== 'youtube.com' && host !== 'youtube-nocookie.com') return ''
  const v = u.searchParams.get('v')
  if (v && ID_RE.test(v)) return v
  const m = u.pathname.match(/\/(?:embed|shorts|v)\/([A-Za-z0-9_-]{11})/)
  return m ? m[1] : ''
}

// Alamat tetap hasil normalisasi, atau '' kalau bukan link YouTube yang valid.
const youtubeWatchUrl = (input) => {
  const id = youtubeId(input)
  return id ? `https://www.youtube.com/watch?v=${id}` : ''
}

module.exports = { youtubeId, youtubeWatchUrl }
