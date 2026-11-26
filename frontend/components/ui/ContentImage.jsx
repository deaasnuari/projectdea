import Image from 'next/image'

// Gambar bawaan di /images dioptimalkan Next.js (format modern, lazy). Alamat
// lain (upload admin, thumbnail) tetap <img> biasa supaya tidak perlu
// mendaftarkan domain apa pun. `eager` untuk gambar yang langsung terlihat.
//
// File aslinya kecil (sekitar 420-520 px), jadi semua pemakaian sengaja meminta
// ukuran yang SAMA: gambar yang muncul di kartu video dan galeri cukup diunduh
// sekali. Ukuran tampil diatur lewat className.
const SOURCE_SIZE = 420

export default function ContentImage({ src, alt = '', width, height, eager = false, className }) {
  const props = {
    alt,
    className,
    loading: eager ? 'eager' : 'lazy',
    fetchPriority: eager ? 'high' : undefined,
    decoding: 'async',
  }
  if (typeof src === 'string' && src.startsWith('/images/') && !src.includes('?')) {
    return <Image src={src} width={SOURCE_SIZE} height={SOURCE_SIZE} {...props} />
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src || undefined} width={width} height={height} {...props} />
}
