import { notFound } from 'next/navigation'
import HeroSection from '@/app/donatur/sections/HeroSection'
import ProgramKamiSection from '@/app/donatur/sections/ProgramKamiSection'
import KonsultasiSection from '@/app/donatur/sections/KonsultasiSection'
import TentangSection from '@/app/donatur/tentang-kami/TentangSection'
import SejarahSection from '@/app/donatur/tentang-kami/SejarahSection'
import PencapaianSection from '@/app/donatur/tentang-kami/PencapaianSection'
import NilaiSection from '@/app/donatur/tentang-kami/NilaiSection'
import TimSection from '@/app/donatur/tentang-kami/TimSection'
import GabungMisiSection from '@/app/donatur/tentang-kami/GabungMisiSection'
import ContactSection from '@/app/donatur/kontak-kami/ContactSection'
import ProgramHeroText from '@/app/donatur/program/ProgramHeroText'
import BlogHeroText from '@/app/donatur/blog/BlogHeroText'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import AdminAuthGate from '@/components/admin/AdminAuthGate'
import InlineEditProvider from '@/components/inline-edit/InlineEditProvider'
import { TextElementsProvider } from '@/components/inline-edit/TextElementsContext'
import FrameHeightReporter from '@/components/inline-edit/FrameHeightReporter'

export const metadata = {
  title: 'Pratinjau Konten — Panel Admin',
}

// Daftar Program & Blog: cukup bagian header-nya (kartu program/artikel
// dikelola lewat form di halaman admin masing-masing).
function ProgramHeaderPreview() {
  return (
    <PageHeroBackground className="pb-2 pt-10">
      <div className="container">
        <ProgramHeroText />
      </div>
    </PageHeroBackground>
  )
}

function BlogHeaderPreview() {
  return (
    <PageHeroBackground className="pb-2 pt-10">
      <div className="container">
        <BlogHeroText />
      </div>
    </PageHeroBackground>
  )
}

// Isi pratinjau yang bisa diedit, dimuat di dalam <iframe> oleh halaman
// admin (lihat DevicePreviewFrame). Iframe dipakai supaya lebar Desktop /
// Tablet / HP benar-benar mengaktifkan tata letak responsif (media query)
// perangkat itu — admin melihat persis yang nanti dilihat pengunjung.
//
// `className` = penyesuaian khusus pratinjau: hero tidak perlu setinggi 1
// layar & jarak atasnya dirapatkan karena tidak ada navbar di sini.
const PAGES = {
  'kami-peduli': {
    className: '[&_#top]:!min-h-0 [&_#top_.container]:!pt-10 [&_#top_.container]:!pb-4',
    sections: [HeroSection, ProgramKamiSection, KonsultasiSection],
  },
  'tentang-kami': {
    className: '[&_#tentang-hero]:!pt-10 [&_#tentang-hero]:!pb-6',
    sections: [TentangSection, SejarahSection, PencapaianSection, NilaiSection, TimSection, GabungMisiSection],
  },
  'kontak-kami': {
    className: '[&_#kontak-hero]:!pt-10 [&_#kontak-hero]:!pb-6',
    sections: [ContactSection],
  },
  program: {
    className: '',
    sections: [ProgramHeaderPreview],
  },
  blog: {
    className: '',
    sections: [BlogHeaderPreview],
  },
}

export default async function AdminPratinjauPage({ params }) {
  const { page } = await params
  const cfg = PAGES[page]
  if (!cfg) notFound()

  return (
    <AdminAuthGate>
      {/* Tombol Edit Konten / Simpan Semua tidak tampil di sini — dijembatani
          ke bar atas halaman induk (lihat EditToolbar & DevicePreviewFrame). */}
      {/* Tinggi isi dilaporkan ke halaman induk → iframe setinggi isinya,
          jadi tidak ada scroll ganda (cukup scroll halaman admin). */}
      <FrameHeightReporter className={`bg-white ${cfg.className}`}>
        <InlineEditProvider>
          <TextElementsProvider page={page}>
            {cfg.sections.map((Section, i) => (
              <Section key={i} />
            ))}
          </TextElementsProvider>
        </InlineEditProvider>
      </FrameHeightReporter>
    </AdminAuthGate>
  )
}
