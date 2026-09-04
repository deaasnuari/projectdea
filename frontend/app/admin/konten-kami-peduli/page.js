import HeroSection from '@/app/donatur/sections/HeroSection'
import ProgramKamiSection from '@/app/donatur/sections/ProgramKamiSection'
import KonsultasiSection from '@/app/donatur/sections/KonsultasiSection'
import InlineEditProvider from '@/components/inline-edit/InlineEditProvider'
import { TextElementsProvider } from '@/components/inline-edit/TextElementsContext'

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
          Edit konten langsung pada pratinjau di bawah — klik ✏️ untuk mengubah teks &amp; tampilannya
          (font, ukuran, warna, dll). Perubahan tersimpan otomatis ke database. Video & galeri diatur di
          menu Dokumentasi.
        </p>
      </div>

      {/* Pratinjau halaman dibingkai dalam kartu. Hero aslinya setinggi 1
          layar penuh (min-h-screen, konten di bawah) — di pratinjau admin
          tidak perlu navbar, jadi tingginya dikecilkan & jarak atasnya
          dirapatkan (override lewat arbitrary variant, tanpa mengubah
          tampilan publik). */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm [&_#top]:!min-h-0 [&_#top_.container]:!pt-10 [&_#top_.container]:!pb-4">
        <InlineEditProvider defaultEditing>
          <TextElementsProvider page="kami-peduli">
            <HeroSection />
            <ProgramKamiSection />
            <KonsultasiSection />
          </TextElementsProvider>
        </InlineEditProvider>
      </div>
    </div>
  )
}
