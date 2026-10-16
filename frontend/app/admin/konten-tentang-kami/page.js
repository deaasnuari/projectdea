import DevicePreviewFrame from '@/components/inline-edit/DevicePreviewFrame'
import ContentPageHeader from '@/components/admin/ContentPageHeader'
import DonationMethodsManager from '@/components/donation/DonationMethodsManager'

export const metadata = {
  title: 'Konten Tentang Kami — Panel Admin',
}

//ini fungsi untuk menampilkan halaman admin untuk mengelola konten "Tentang Kami". Halaman ini men
export default function AdminKontenTentangKamiPage() {
  return (
    <div>
      <ContentPageHeader title="Tentang Kami" note="Daftar anggota tim diatur di menu Tim. Metode donasi via transfer ada di bagian bawah halaman ini." />

      {/* Pratinjau per perangkat (Desktop / Tablet / HP) — isinya dimuat di
          iframe dari /admin-pratinjau/tentang-kami supaya tata letak responsif tiap
          perangkat benar-benar aktif saat diedit. */}
      <DevicePreviewFrame page="tentang-kami" />

      {/* Metode donasi untuk tombol "Donasi via Transfer" di halaman ini —
          terpisah dari metode donasi kartu program, jadi rekeningnya bisa
          dibedakan. */}
      <div className="mt-10">
        <DonationMethodsManager
          scope="tentang"
          title="Metode Donasi via Transfer"
          description='Jenis donasi & rekening bank yang tampil di modal "Donasi via Transfer" pada halaman Tentang Kami.'
        />
      </div>
    </div>
  )
}
