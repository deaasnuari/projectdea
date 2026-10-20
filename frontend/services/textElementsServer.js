// Ambil isi elemen teks (yang bisa diedit admin) di SERVER, supaya HTML
// pertama sudah berisi teks/gambar final — tanpa menunggu fetch di browser.
// Gagal/offline → null → browser mengambil sendiri seperti biasa.
export async function getTextElementsSSR(page) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    const res = await fetch(`${base}/api/text-elements?page=${encodeURIComponent(page)}`, {
      next: { revalidate: 30 },
    })
    if (!res.ok) return null
    const rows = (await res.json()).data
    return Array.isArray(rows) ? rows : null
  } catch {
    return null
  }
}
