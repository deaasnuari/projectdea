import { getTextElementsSSR } from '@/services/textElementsServer'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { TextElementsProvider } from '@/components/inline-edit/TextElementsContext'
import ProgramListSection from './ProgramListSection'

export const metadata = {
  title: 'Daftar Program — Lazis PLN Batam',
}

export default async function ProgramPage() {
  const initialRows = await getTextElementsSSR('program')
  return (
    <>
      <Navbar />
      <TextElementsProvider page="program" initialRows={initialRows || undefined}>
        <main>
          <ProgramListSection />
        </main>
      </TextElementsProvider>
      <Footer />
    </>
  )
}
