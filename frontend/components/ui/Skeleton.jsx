// Kotak abu-abu berdenyut sebagai pengganti konten selagi data API dimuat,
// supaya pengunjung tidak melihat data contoh lalu "berubah sendiri".
export default function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-2xl ${className}`} />
}
