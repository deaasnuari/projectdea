// Ukuran gambar utama halaman menu (persen lebar area gambar), diatur admin
// dengan menarik pojok gambar di editor konten dan disimpan di page.data.heroSize.
// Tinggi mengikuti rasio asli gambar (tidak dipotong).
export const HERO_SIZE_MIN = 20
export const HERO_SIZE_MAX = 100

export function normalizeHeroSize(v) {
  const n = Number(v)
  if (!Number.isFinite(n) || n <= 0) return HERO_SIZE_MAX
  return Math.min(HERO_SIZE_MAX, Math.max(HERO_SIZE_MIN, Math.round(n)))
}
