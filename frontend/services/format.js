// Fungsi-fungsi format tampilan (angka, uang, waktu) yang dipakai di beberapa
// halaman/komponen — supaya tidak ada logika format yang sama ditulis ulang
// di banyak tempat.

export function formatRp(n) {
  return 'Rp ' + Math.round(n || 0).toLocaleString('id-ID')
}

// Bersihkan input nominal (string yang mungkin sudah ber-titik pemisah ribuan,
// atau kosong) jadi number murni — dipakai supaya field input Rupiah tidak
// pernah menghasilkan NaN/undefined/null saat dipakai dalam perhitungan.
// Contoh: "10.000.000" atau "10000000" -> 10000000; "" atau "abc" -> 0.
export function parseRupiah(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0
  const digits = String(value ?? '').replace(/[^0-9]/g, '')
  if (!digits) return 0
  const n = Number(digits)
  return Number.isFinite(n) ? n : 0
}

// Format number jadi teks ber-titik pemisah ribuan TANPA prefix "Rp" —
// dipakai di dalam field input yang label "Rp"-nya sudah ditampilkan
// terpisah. 0/kosong -> '' supaya placeholder "0" yang tampil, bukan angka 0.
export function formatRupiahInput(n) {
  const v = parseRupiah(n)
  return v ? v.toLocaleString('id-ID') : ''
}

// Format angka besar jadi singkatan "juta", contoh: 2100000 -> "Rp 2.1jt"
export function formatJt(n) {
  const v = n / 1000000
  const text = Number.isInteger(v) ? String(v) : v.toFixed(1)
  return `Rp ${text}jt`
}

// Format angka jadi singkatan "ribu", contoh: 250000 -> "Rp 250rb". Dipakai
// untuk nominal donasi satuan yang biasanya di bawah satu juta, jadi tidak
// perlu dibulatkan lagi jadi "jt" seperti formatJt.
export function formatRb(n) {
  return `Rp ${Math.round((n || 0) / 1000).toLocaleString('id-ID')}rb`
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
