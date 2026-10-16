import DevicePreviewFrame from '@/components/inline-edit/DevicePreviewFrame'
import ContentPageHeader from '@/components/admin/ContentPageHeader'

export const metadata = {
  title: 'Konten Kontak Kami — Panel Admin',
}

// Halaman "Kontak Kami" versi admin: tampilannya sama seperti publik, tapi
// teksnya (hero, info kontak, judul formulir) bisa diedit langsung di tempat
// (klik ✏️), dan daftar info kontak bisa ditambah/dihapus. Formulir pesannya
// sendiri tidak diubah.
export default function AdminKontenKontakKamiPage() {
  return (
    <div>
      <ContentPageHeader title="Kontak Kami" note="Gunakan Tambah/Hapus untuk mengelola daftar info kontak. Pesan dari formulir masuk di menu Pesan Masuk." />

      {/* Pratinjau per perangkat (Desktop / Tablet / HP) — isinya dimuat di
          iframe dari /admin-pratinjau/kontak-kami supaya tata letak responsif tiap
          perangkat benar-benar aktif saat diedit. */}
      <DevicePreviewFrame page="kontak-kami" />
    </div>
  )
}
