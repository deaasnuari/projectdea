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
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '64x64', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        {/* Font pilihan untuk editor teks visual admin (dipakai lewat
            konfigurasi per-elemen di tabel text_elements). Inter & Fraunces
            sudah dimuat via next/font di atas.

            Stylesheet ini di-inject lewat script setelah halaman selesai
            load supaya TIDAK menahan first paint di halaman publik. Sengaja
            TIDAK dirender sebagai <link> di JSX: kalau dirender lalu
            atributnya diubah oleh script, React akan protes "hydration
            mismatch" karena DOM (hasil script) beda dengan pohon server. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var h='https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&family=Merriweather:wght@300;400;700&family=Roboto+Slab:wght@300;400;600;700&family=Lobster&family=Pacifico&family=Irish+Grover&display=swap';" +
              "function add(){if(document.getElementById('lazis-extra-fonts'))return;var l=document.createElement('link');l.id='lazis-extra-fonts';l.rel='stylesheet';l.href=h;document.head.appendChild(l);}" +
              "if(document.readyState==='complete')add();else addEventListener('load',add);})();",
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&family=Merriweather:wght@300;400;700&family=Roboto+Slab:wght@300;400;600;700&family=Lobster&family=Pacifico&family=Irish+Grover&display=swap"
          />
        </noscript>
      </head>
      <body>
        {children}
        <FeedbackHost />
      </body>
    </html>
  )
}
