// Fungsi-fungsi format tampilan (angka, uang, waktu) yang dipakai di beberapa
// halaman/komponen — supaya tidak ada logika format yang sama ditulis ulang
// di banyak tempat.

export function formatRp(n) {
  return 'Rp ' + Math.round(n || 0).toLocaleString('id-ID')
}

// Format angka besar jadi singkatan "juta", contoh: 2100000 -> "Rp 2.1jt"
export function formatJt(n) {
  const v = n / 1000000
  const text = Number.isInteger(v) ? String(v) : v.toFixed(1)
  return `Rp ${text}jt`
}

// Format detik jadi "HH:MM:SS", dipakai untuk hitung mundur batas bayar.
export function formatCountdown(totalSeconds) {
  const s = Math.max(0, totalSeconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (v) => String(v).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(sec)}`
}
