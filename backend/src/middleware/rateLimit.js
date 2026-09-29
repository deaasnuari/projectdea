// Pembatas jumlah request per alamat IP (disimpan di memori server) — dipakai
// untuk endpoint publik yang bisa disalahgunakan untuk spam, mis. formulir
// "Kirim Pesan" (tiap pesan juga dikirim ke email admin).
//
// rateLimit({ windowMs, max, message }) → middleware Express. Kalau batas
// terlampaui: HTTP 429 + header Retry-After + pesan error yang langsung
// tampil di formulir.
//
// Catatan produksi: kalau server di belakang proxy/hosting (Nginx, Vercel,
// dsb.), aktifkan `app.set('trust proxy', 1)` supaya req.ip = IP pengunjung,
// bukan IP proxy.
function rateLimit({ windowMs, max, message }) {
  const hits = new Map() // ip -> [timestamp, ...] dalam jendela waktu

  // Bersihkan IP yang sudah lama tidak mengirim supaya memori tidak menumpuk.
  setInterval(() => {
    const cutoff = Date.now() - windowMs
    for (const [ip, times] of hits) {
      const recent = times.filter((t) => t > cutoff)
      if (recent.length) hits.set(ip, recent)
      else hits.delete(ip)
    }
  }, windowMs).unref()

  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown'
    const now = Date.now()
    const recent = (hits.get(ip) || []).filter((t) => t > now - windowMs)

    if (recent.length >= max) {
      const retrySec = Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000))
      res.set('Retry-After', String(retrySec))
      return res.status(429).json({ error: message(retrySec), retryAfter: retrySec })
    }

    recent.push(now)
    hits.set(ip, recent)
    next()
  }
}

// "45 detik" / "3 menit"
function formatWait(sec) {
  return sec < 60 ? `${sec} detik` : `${Math.ceil(sec / 60)} menit`
}

module.exports = { rateLimit, formatWait }
