import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { TextElementsProvider } from '@/components/inline-edit/TextElementsContext'
import ProgramListSection from './ProgramListSection'

export const metadata = {
  title: 'Daftar Program — Lazis PLN Batam',
}

export default function ProgramPage() {
  return (
    <>
      <Navbar />
      <TextElementsProvider page="program">
        <ProgramListSection />
      </TextElementsProvider>
      <Footer />
    </>
  )
}
