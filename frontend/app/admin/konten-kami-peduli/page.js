import DevicePreviewFrame from '@/components/inline-edit/DevicePreviewFrame'

export const metadata = {
  title: 'Konten Kami Peduli — Panel Admin',
}

//ini fungsi untuk menampilkan halaman admin untuk mengelola konten "Kami Peduli". Halaman ini menampilkan pratinjau yang sama seperti publik, tapi teks bisa diedit langsung di tempatnya (klik ✏️), dan daftar program bisa ditambah/dihapus. Video & galeri dikelola di menu "Dokumentasi".
export default function AdminKontenKamiPeduliPage() {
  return (
    <div>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
        <h1 className="font-heading text-xl font-bold text-navy">Konten &quot;Kami Peduli&quot;</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-gray-500">
          Edit konten langsung pada pratinjau di bawah — <b>klik</b> ✏️ untuk mengubah teks &amp;
          tampilannya (font, ukuran, warna, dll), atau <b>tarik/geser</b> teksnya untuk menata letak.
          Klik <b>Simpan Semua</b> untuk menyimpan sebagai draf (belum tampil ke publik), lalu klik{' '}
          <b>Selesai Edit</b> untuk menerbitkannya ke halaman donatur. Video &amp; galeri diatur di
          menu Dokumentasi. Tampilan tablet &amp; HP menyesuaikan otomatis.
        </p>
      </div>

      {/* Pratinjau per perangkat (Desktop / Tablet / HP) — isinya dimuat di
          iframe dari /admin-pratinjau/kami-peduli supaya tata letak responsif tiap
          perangkat benar-benar aktif saat diedit. */}
      <DevicePreviewFrame page="kami-peduli" />
    </div>
  )
}
