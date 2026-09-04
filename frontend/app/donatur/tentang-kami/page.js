import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { TextElementsProvider } from '@/components/inline-edit/TextElementsContext'
import TentangSection from './TentangSection'
import SejarahSection from './SejarahSection'
import PencapaianSection from './PencapaianSection'
import NilaiSection from './NilaiSection'
import TimSection from './TimSection'
import GabungMisiSection from './GabungMisiSection'

export const metadata = {
  title: 'Tentang Kami — Lazis PLN Batam',
}

export default function TentangKamiPage() {
  return (
    <>
      <Navbar />
      <TextElementsProvider page="tentang-kami">
        <TentangSection />
        <SejarahSection />
        <PencapaianSection />
        <NilaiSection />
        <TimSection />
      </TextElementsProvider>
      <GabungMisiSection />
      <Footer />
    </>
  )
}
