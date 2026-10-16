import DevicePreviewFrame from '@/components/inline-edit/DevicePreviewFrame'
import ContentPageHeader from '@/components/admin/ContentPageHeader'

export const metadata = {
  title: 'Konten Kami Peduli — Panel Admin',
}

//ini fungsi untuk menampilkan halaman admin untuk mengelola konten "Kami Peduli". Halaman ini menampilkan pratinjau yang sama seperti publik, tapi teks bisa diedit langsung di tempatnya (klik ✏️), dan daftar program bisa ditambah/dihapus. Video & galeri dikelola di menu "Dokumentasi".
export default function AdminKontenKamiPeduliPage() {
  return (
    <div>
      <ContentPageHeader title="Kami Peduli" note="Video & galeri diatur di menu Dokumentasi; daftar program di menu Daftar Program." />

      {/* Pratinjau per perangkat (Desktop / Tablet / HP) — isinya dimuat di
          iframe dari /admin-pratinjau/kami-peduli supaya tata letak responsif tiap
          perangkat benar-benar aktif saat diedit. */}
      <DevicePreviewFrame page="kami-peduli" />
    </div>
  )
}
