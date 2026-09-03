import { redirect } from 'next/navigation'

// Pintu masuk "tersembunyi" ke halaman login (tidak ada tombolnya di navbar).
// Ketik /masukpakeko di URL → diarahkan ke halaman login.
export default function MasukPakeKoPage() {
  redirect('/login')
}
