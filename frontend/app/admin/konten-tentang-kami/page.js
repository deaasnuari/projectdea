import TentangSection from '@/app/donatur/tentang-kami/TentangSection'
import SejarahSection from '@/app/donatur/tentang-kami/SejarahSection'
import PencapaianSection from '@/app/donatur/tentang-kami/PencapaianSection'
import NilaiSection from '@/app/donatur/tentang-kami/NilaiSection'
import TimSection from '@/app/donatur/tentang-kami/TimSection'
import GabungMisiSection from '@/app/donatur/tentang-kami/GabungMisiSection'
import InlineEditProvider from '@/components/inline-edit/InlineEditProvider'
import { TextElementsProvider } from '@/components/inline-edit/TextElementsContext'
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
          mengelola item. Perubahan tersimpan otomatis ke database. Daftar anggota tim diatur di menu Tim.
        </p>
      </div>

      {/* Pratinjau halaman dibingkai dalam kartu. Jarak atas hero dirapatkan
          untuk pratinjau admin (tanpa mengubah tampilan publik). */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm [&_#tentang-hero]:!pt-10 [&_#tentang-hero]:!pb-6">
        <InlineEditProvider defaultEditing>
          <TextElementsProvider page="tentang-kami">
            <TentangSection />
            <SejarahSection />
            <PencapaianSection />
            <NilaiSection />
            <TimSection />
            <GabungMisiSection />
          </TextElementsProvider>
        </InlineEditProvider>
      </div>

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
