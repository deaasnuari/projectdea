import { getTextElementsSSR } from '@/services/textElementsServer'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { TextElementsProvider } from '@/components/inline-edit/TextElementsContext'
import HeroSection from './sections/HeroSection'
import DonorStatsSection from './sections/DonorStatsSection'
import ProgramKamiSection from './sections/ProgramKamiSection'
import ZakatCalculatorSection from './sections/ZakatCalculatorSection'
import KonsultasiSection from './sections/KonsultasiSection'

export default async function DonaturLandingPage() {
  const initialRows = await getTextElementsSSR('kami-peduli')
  return (
    <>
      <Navbar />
      <TextElementsProvider page="kami-peduli" initialRows={initialRows || undefined}>
        <main>
          <HeroSection />
          <DonorStatsSection />
          <ProgramKamiSection />
          <ZakatCalculatorSection />
          <KonsultasiSection />
        </main>
      </TextElementsProvider>
      <Footer />
    </>
  )
}
