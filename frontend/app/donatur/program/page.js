import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProgramListSection from './ProgramListSection'

export const metadata = {
  title: 'Daftar Program — Lazis PLN Batam',
}

export default function ProgramPage() {
  return (
    <>
      <Navbar />
      <ProgramListSection />
      <Footer />
    </>
  )
}
