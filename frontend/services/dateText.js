// Bantu-bantu tanggal yang dipakai di beberapa fitur (blog, dokumentasi).
// Tanggal disimpan sebagai ISO "YYYY-MM-DD" (dari input kalender), tapi data
// lama masih berupa teks bebas ("12 Jan 2025", "Desember 2024") — dua-duanya
// tetap dibaca.

const ID_MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, may: 4, jun: 5,
  jul: 6, agu: 7, agt: 7, ags: 7, aug: 7, sep: 8, okt: 9, oct: 9, nov: 10, des: 11, dec: 11,
}

export function parseLooseDate(v) {
  if (!v) return null
  const s = String(v).trim()
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(s)
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
  // "12 Jan 2025"
  const dmy = /^(\d{1,2})\s+([A-Za-z]+)\.?\s+(\d{4})$/.exec(s)
  if (dmy) {
    const mon = ID_MONTHS[dmy[2].toLowerCase().slice(0, 3)]
    if (mon != null) return new Date(Number(dmy[3]), mon, Number(dmy[1]))
  }
  // "Desember 2024"
  const my = /^([A-Za-z]+)\.?\s+(\d{4})$/.exec(s)
  if (my) {
    const mon = ID_MONTHS[my[1].toLowerCase().slice(0, 3)]
    if (mon != null) return new Date(Number(my[2]), mon, 1)
  }
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d
}

// Untuk tampilan: "12 Jan 2025". Kalau tidak bisa diparse, tampilkan apa adanya.
export function formatDateID(v) {
  const d = parseLooseDate(v)
  if (!d) return v || ''
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Untuk <input type="date">: "YYYY-MM-DD" atau '' kalau kosong/tak terbaca.
export function toDateInputValue(v) {
  const d = parseLooseDate(v)
  if (!d) return ''
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// Angka untuk mengurutkan (paling baru dulu). Pakai `date` kalau ada &
// terbaca, kalau tidak pakai `created_at`.
export function postSortKey(item) {
  const d = parseLooseDate(item?.date)
  if (d) return d.getTime()
  const c = new Date(item?.created_at || 0)
  return Number.isNaN(c.getTime()) ? 0 : c.getTime()
}
