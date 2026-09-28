import DevicePreviewFrame from '@/components/inline-edit/DevicePreviewFrame'
import DonationMethodsManager from '@/components/donation/DonationMethodsManager'

export const metadata = {
  title: 'Konten Tentang Kami — Panel Admin',
}

//ini fungsi untuk menampilkan halaman admin untuk mengelola konten "Tentang Kami". Halaman ini men
export default function AdminKontenTentangKamiPage() {
  return (
    <div>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
        <h1 className="font-heading text-xl font-bold text-navy">Konten &quot;Tentang Kami&quot;</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-gray-500">
          Edit konten langsung pada pratinjau di bawah — klik ✏️ untuk mengubah teks, Tambah/Hapus untuk
          mengelola item. Klik <b>Simpan Semua</b> untuk menyimpan sebagai draf (belum tampil ke
          publik), lalu klik <b>Selesai Edit</b> untuk menerbitkannya. Daftar anggota tim diatur di
          menu Tim.
          Tampilan tablet &amp; HP menyesuaikan otomatis.
        </p>
      </div>

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
