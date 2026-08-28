import ContactSection from '@/app/donatur/kontak-kami/ContactSection'
import InlineEditProvider from '@/components/inline-edit/InlineEditProvider'

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
          untuk mengelola daftar info kontak.
        </p>
      </div>

      {/* Jarak atas hero dirapatkan untuk pratinjau admin (tanpa mengubah
          tampilan publik). */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm [&_#kontak-hero]:!pt-10 [&_#kontak-hero]:!pb-6">
        <InlineEditProvider defaultEditing>
          <ContactSection />
        </InlineEditProvider>
      </div>
    </div>
  )
}
