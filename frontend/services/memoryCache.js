// Cache sederhana di memori (hidup selama tab terbuka, bertahan saat pindah
// halaman lewat <Link>). Dipakai hook data publik (menu, teks, program,
// artikel) sebagai nilai AWAL: halaman yang sudah pernah dibuka langsung tampil
// penuh tanpa menunggu server, sementara datanya tetap diambil ulang di
// belakang (stale-while-revalidate) supaya perubahan admin tetap muncul.
const store = new Map()

export const getCache = (key) => store.get(key)
export const setCache = (key, value) => {
  store.set(key, value)
  return value
}
