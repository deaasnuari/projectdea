import { TextElementsProvider } from '@/components/inline-edit/TextElementsContext'
import FooterContent from './FooterContent'

// Footer publik. Isinya diambil dari text_elements page "footer" (diedit admin
// di /admin/konten-footer). `toolbar={false}`: tidak ada bar edit kedua di
// halaman publik — pengeditannya hanya lewat halaman admin.
export default function Footer() {
  return (
    <TextElementsProvider page="footer" toolbar={false}>
      <FooterContent />
    </TextElementsProvider>
  )
}
