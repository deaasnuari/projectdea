import { redirect } from 'next/navigation'

// Konten landing page sekarang ada di /donatur — halaman root ini cuma
// meneruskan (redirect) ke sana.
export default function RootRedirect() {
  redirect('/donatur')
}
