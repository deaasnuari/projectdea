import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from './sections/HeroSection'
import DonorStatsSection from './sections/DonorStatsSection'
import ProgramKamiSection from './sections/ProgramKamiSection'
import ZakatCalculatorSection from './sections/ZakatCalculatorSection'
import KonsultasiSection from './sections/KonsultasiSection'

export default function DonaturLandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <DonorStatsSection />
      <ProgramKamiSection />
      <ZakatCalculatorSection />
      <KonsultasiSection />
      <Footer />
    </>
  )
}
