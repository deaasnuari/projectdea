// Aturan & perhitungan zakat karyawan PLN Batam.
// Dipisah dari komponen kalkulatornya supaya angka nisab & rumus zakat
// gampang dicari/diaudit tanpa perlu buka file UI.

export const NISAB_MAAL = 80750000
export const NISAB_PROFESI = Math.round(NISAB_MAAL / 12)
export const ZAKAT_RATE = 0.025

export function hitungZakatProfesi(penghasilanBulanan) {
  return penghasilanBulanan >= NISAB_PROFESI ? penghasilanBulanan * ZAKAT_RATE : 0
}

export function hitungZakatMaal(hartaMaal) {
  return hartaMaal >= NISAB_MAAL ? hartaMaal * ZAKAT_RATE : 0
}
