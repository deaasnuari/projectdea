// Aturan & perhitungan zakat karyawan PLN Batam.
// Dipisah dari komponen kalkulatornya (ZakatCalculatorSection.jsx) supaya
// angka nisab & rumus zakat satu sumber — gampang dicari/diaudit tanpa perlu
// buka file UI, dan tidak ada angka nisab yang tersebar ke banyak file.
// Untuk ganti nilai nisab/kadar zakat, ubah di sini SAJA — cukup ubah
// `nisabTahunan`, nilai lain menyesuaikan otomatis (lihat di bawah).
const NISAB_TAHUNAN = 91681728 // nisab zakat maal (harga 85 gram emas saat ini)
const KADAR_ZAKAT = 0.025 // 2.5%
const NISAB_EMAS_GRAM = 85

export const ZAKAT_CONFIG = {
  nisabTahunan: NISAB_TAHUNAN,
  nisabBulanan: Math.round(NISAB_TAHUNAN / 12), // nisab zakat profesi/penghasilan
  kadarZakat: KADAR_ZAKAT,
  nisabEmasGram: NISAB_EMAS_GRAM,
}

// Nama lama dipertahankan (dipakai ZakatCalculatorSection.jsx) — nilainya
// diambil dari ZAKAT_CONFIG, jadi tetap satu sumber angka.
export const NISAB_MAAL = ZAKAT_CONFIG.nisabTahunan
export const NISAB_PROFESI = ZAKAT_CONFIG.nisabBulanan
export const ZAKAT_RATE = ZAKAT_CONFIG.kadarZakat

// Jaga-jaga: input kosong/NaN/undefined/null/negatif dianggap 0, tidak pernah
// diteruskan mentah ke perhitungan.
function toAmount(v) {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}

// Zakat profesi: 2,5% dari total penghasilan bulanan (gaji pokok + tunjangan
// tetap), kalau sudah mencapai nisab bulanan. Di bawah nisab -> 0.
export function hitungZakatProfesi(penghasilanBulanan) {
  const total = toAmount(penghasilanBulanan)
  return total >= ZAKAT_CONFIG.nisabBulanan ? total * ZAKAT_CONFIG.kadarZakat : 0
}

// Zakat maal: 2,5% dari total harta (tabungan/deposito + nilai emas &
// perhiasan) yang sudah genap setahun (haul), kalau sudah mencapai nisab
// tahunan. Di bawah nisab -> 0.
export function hitungZakatMaal(hartaMaal) {
  const total = toAmount(hartaMaal)
  return total >= ZAKAT_CONFIG.nisabTahunan ? total * ZAKAT_CONFIG.kadarZakat : 0
}

// Total zakat (profesi + maal) — dihitung terpisah supaya bisa dipakai lagi
// kalau desain nanti perlu menampilkannya.
export function hitungTotalZakat(zakatProfesi, zakatMaal) {
  return toAmount(zakatProfesi) + toAmount(zakatMaal)
}
