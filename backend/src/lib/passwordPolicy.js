// Aturan password baru: minimal 8 karakter, ada huruf dan angka.
// (Hanya untuk password yang DIBUAT/DIGANTI — login tidak memeriksa ini.)
function passwordError(pw) {
  const s = String(pw || '')
  if (s.length < 8) return 'Password minimal 8 karakter'
  if (s.length > 128) return 'Password maksimal 128 karakter'
  if (!/[A-Za-z]/.test(s) || !/\d/.test(s)) return 'Password harus mengandung huruf dan angka'
  return null
}
module.exports = { passwordError }
