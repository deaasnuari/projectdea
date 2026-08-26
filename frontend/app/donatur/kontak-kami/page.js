import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactSection from './ContactSection'

export const metadata = {
  title: 'Kontak Kami — Lazis PLN Batam',
}

export default function KontakKamiPage() {
  return (
    <>
      <Navbar />
      <ContactSection />
      <Footer />
    </>
  )
}
