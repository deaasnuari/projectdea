// Ubah file gambar (dari <input type="file">) jadi data URL yang sudah
// diperkecil, supaya muat disimpan di localStorage (belum ada backend
// untuk upload file sungguhan). Gambar di-resize maksimal `maxDim` px pada
// sisi terpanjang dan dikompres jadi JPEG.
export function fileToResizedDataUrl(file, { maxDim = 1200, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Tidak ada file dipilih'))
      return
    }
    if (!file.type || !file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan gambar'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Gagal memuat gambar'))
      img.onload = () => {
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Browser tidak mendukung pemrosesan gambar'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        try {
          resolve(canvas.toDataURL('image/jpeg', quality))
        } catch (err) {
          reject(new Error('Gagal memproses gambar'))
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
