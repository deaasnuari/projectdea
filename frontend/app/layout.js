import { Inter, Fraunces } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

// Fraunces is a warm, soft-serif display face — it replaces the generic
// geometric-sans headings (Poppins) that every third template also uses,
// and its italic gives the accent words in the hero real character.
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
      <body>{children}</body>
    </html>
  )
}
