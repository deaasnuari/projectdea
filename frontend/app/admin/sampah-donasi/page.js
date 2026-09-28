import RiwayatDonasiView from '@/app/admin/riwayat-donasi/RiwayatDonasiView'

// Sampah donasi (menu di bawah Riwayat Donasi): donasi yang dihapus —
// tidak ikut dihitung, bisa dipulihkan atau dihapus permanen.
export default function AdminSampahDonasiPage() {
  return <RiwayatDonasiView trash />
}
