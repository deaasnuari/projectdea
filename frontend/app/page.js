import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ProgramSection from '@/components/sections/ProgramSection'
import ZakatCalculatorSection from '@/components/sections/ZakatCalculatorSection'
import FaqSection from '@/components/sections/FaqSection'

export default function DonaturLandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProgramSection />
      <ZakatCalculatorSection />
      <FaqSection />
      <Footer />
    </>
  )
}
