import Image from 'next/image'

// Gambar bawaan di /images dioptimalkan Next.js (ukuran sesuai layar, format
// modern, lazy). Alamat lain (upload admin, thumbnail) tetap <img> biasa supaya
// tidak perlu mendaftarkan domain apa pun. `eager` untuk gambar yang langsung
// terlihat saat halaman dibuka.
export default function ContentImage({ src, alt = '', width, height, sizes, eager = false, className }) {
  const props = {
    alt,
    width,
    height,
    className,
    loading: eager ? 'eager' : 'lazy',
    fetchPriority: eager ? 'high' : undefined,
    decoding: 'async',
  }
  if (typeof src === 'string' && src.startsWith('/images/') && !src.includes('?')) {
    return <Image src={src} sizes={sizes} {...props} />
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src || undefined} {...props} />
}
