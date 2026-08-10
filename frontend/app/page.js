import { redirect } from 'next/navigation'

// Landing page content now lives at /donatur — root just forwards there.
export default function RootRedirect() {
  redirect('/donatur')
}
