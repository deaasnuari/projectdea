import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import FeedbackHost from '@/components/ui/feedback'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

// Fraunces adalah font serif yang hangat dan lembut — dipakai untuk
// menggantikan font judul geometris generik (Poppins) yang juga dipakai
// banyak template lain, dan versi italic-nya memberi karakter khusus
// pada kata-kata penekanan di bagian hero.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata = {
  title: 'Lazis PLN Batam',
  description: 'Aplikasi Lazis PLN Batam - Lembaga Amil Zakat, Infaq dan Shadaqah PLN Batam',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        {children}
        <FeedbackHost />
      </body>
    </html>
  )
}
