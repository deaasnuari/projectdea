import { getTextElementsSSR } from '@/services/textElementsServer'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { TextElementsProvider } from '@/components/inline-edit/TextElementsContext'
import ContactSection from './ContactSection'

export const metadata = {
  title: 'Kontak Kami — Lazis PLN Batam',
}

export default async function KontakKamiPage() {
  const initialRows = await getTextElementsSSR('kontak-kami')
  return (
    <>
      <Navbar />
      <TextElementsProvider page="kontak-kami" initialRows={initialRows || undefined}>
        <main>
          <ContactSection />
        </main>
      </TextElementsProvider>
      <Footer />
    </>
  )
}
