import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AboutSection from './AboutSection'

export const metadata = {
  title: 'Tentang Kami — Lazis PLN Batam',
}

export default function TentangKamiPage() {
  return (
    <>
      <Navbar solid />
      <AboutSection />
      <Footer />
    </>
  )
}
