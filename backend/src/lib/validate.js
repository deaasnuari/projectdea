// Pembersih/pemeriksa input untuk endpoint PUBLIK (donasi, formulir kontak).
// Prinsipnya: terima hanya yang masuk akal — tipe, panjang, dan bentuknya.

// Teks satu baris: buang karakter kontrol (termasuk CR/LF → mencegah email
// header injection), rapikan spasi, potong ke `max` karakter.
function line(v, max = 200) {
  if (typeof v !== 'string') return ''
  return v.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
}

// Teks banyak baris (pesan/catatan): boleh baris baru, buang karakter kontrol lain.
function text(v, max = 5000) {
  if (typeof v !== 'string') return ''
  return v.replace(/[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, max)
}

const EMAIL_RE = /^[^\s@<>()[\]\,;:"]+@[^\s@<>()[\]\,;:"]+\.[A-Za-z]{2,}$/
const isEmail = (v) => typeof v === 'string' && v.length <= 200 && EMAIL_RE.test(v)

// Nomor telepon: angka, spasi, +, -, (, ) — 6–20 karakter.
const isPhone = (v) => typeof v === 'string' && /^[0-9+\-()\s]{6,20}$/.test(v)

// Bukti transfer: HANYA gambar jpeg/png/webp dalam data URL base64 (bukan
// html/svg/pdf yang bisa memuat skrip) dan tidak lebih dari `maxChars`.
const PROOF_RE = /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/
const isProof = (v, maxChars = 1_500_000) => typeof v === 'string' && v.length <= maxChars && PROOF_RE.test(v)

module.exports = { line, text, isEmail, isPhone, isProof }
