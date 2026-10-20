import { getTextElementsSSR } from '@/services/textElementsServer'
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

export default async function TentangKamiPage() {
  const initialRows = await getTextElementsSSR('tentang-kami')
  return (
    <>
      <Navbar />
      <TextElementsProvider page="tentang-kami" initialRows={initialRows || undefined}>
        <main>
          <TentangSection />
          <SejarahSection />
          <PencapaianSection />
          <NilaiSection />
          <TimSection />
          <GabungMisiSection />
        </main>
      </TextElementsProvider>
      <Footer />
    </>
  )
}
