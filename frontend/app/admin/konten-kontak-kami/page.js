import DevicePreviewFrame from '@/components/inline-edit/DevicePreviewFrame'

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
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
        <h1 className="font-heading text-2xl font-bold text-navy">Konten "Kontak Kami"</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Edit konten langsung pada pratinjau di bawah. Klik ✏️ untuk mengubah teks, dan Tambah/Hapus
          untuk mengelola daftar info kontak. Klik <b>Simpan Semua</b> untuk menyimpan sebagai draf
          (belum tampil ke publik), lalu klik <b>Selesai Edit</b> untuk menerbitkannya.
          Tampilan tablet &amp; HP menyesuaikan otomatis.
        </p>
      </div>

      {/* Pratinjau per perangkat (Desktop / Tablet / HP) — isinya dimuat di
          iframe dari /admin-pratinjau/kontak-kami supaya tata letak responsif tiap
          perangkat benar-benar aktif saat diedit. */}
      <DevicePreviewFrame page="kontak-kami" />
    </div>
  )
}
