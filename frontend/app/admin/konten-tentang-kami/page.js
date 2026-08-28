import TentangSection from '@/app/donatur/tentang-kami/TentangSection'
import SejarahSection from '@/app/donatur/tentang-kami/SejarahSection'
import PencapaianSection from '@/app/donatur/tentang-kami/PencapaianSection'
import NilaiSection from '@/app/donatur/tentang-kami/NilaiSection'
import TimSection from '@/app/donatur/tentang-kami/TimSection'
import InlineEditProvider from '@/components/inline-edit/InlineEditProvider'
import DonationMethodsManager from '@/components/donation/DonationMethodsManager'

export const metadata = {
  title: 'Konten Tentang Kami — Panel Admin',
}

//ini fungsi untuk menampilkan halaman admin untuk mengelola konten "Tentang Kami". Halaman ini men
export default function AdminKontenTentangKamiPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
        <h1 className="font-heading text-2xl font-bold text-navy">Konten "Tentang Kami"</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Edit konten langsung pada pratinjau di bawah. Klik ✏️ untuk mengubah teks, Tambah/Hapus
          untuk mengelola konten, dan gunakan menu Tim untuk mengatur anggota.
        </p>
      </div>

      {/* Pratinjau halaman dibingkai dalam kartu. Jarak atas hero dirapatkan
          untuk pratinjau admin (tanpa mengubah tampilan publik). */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm [&_#tentang-hero]:!pt-10 [&_#tentang-hero]:!pb-6">
        <InlineEditProvider defaultEditing>
          <TentangSection />
          <SejarahSection />
          <PencapaianSection />
          <NilaiSection />
          <TimSection />
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
