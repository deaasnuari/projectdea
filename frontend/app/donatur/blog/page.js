import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Blog — Lazis PLN Batam',
}

const POSTS = [
  {
    image: '/images/program-1.png',
    badge: 'Kursus Zakat',
    date: '12 Jan 2025',
    title: 'Fiqih Zakat: Dasar Hukum dan Jenisnya',
    desc: 'Memahami dasar-dasar fiqih zakat, mulai dari pengertian, hukum, hingga jenis-jenis zakat yang wajib ditunaikan.',
   
  },
  {
    image: '/images/program-2.png',
    badge: 'Blog',
    date: '5 Jan 2025',
    title: 'Penyaluran Zakat Triwulan IV 2024 PLN Batam',
    desc: 'Laporan lengkap penyaluran dana zakat, infaq, dan shadaqah karyawan PLN Batam periode Oktober–Desember 2024.',
    
  },
  {
    image: '/images/program-3.png',
    badge: 'Kursus Zakat',
    date: '28 Des 2024',
    title: 'Zakat Profesi: Cara Hitung dan Waktu Bayar',
    desc: 'Panduan praktis menghitung dan menunaikan zakat profesi bagi karyawan berpenghasilan tetap sesuai fatwa MUI.',
    
  },
]

export default function BlogPage() {
  return (
    <>
      <Navbar solid />
      <main className="bg-primary/5 pb-24 pt-32">
        <div className="container">
          <p className="section-label">Blog &amp; Kursus Kami</p>
          <h1 className="section-title mb-12">
            Edukasi Zakat
            <br />
            <span>untuk Karyawan PLN Batam</span>
          </h1>

          <div className="grid grid-cols-3 gap-8 max-[900px]:grid-cols-1">
            {POSTS.map((post) => (
              <article
                key={post.title}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="aspect-[3/2] overflow-hidden">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
                      {post.badge}
                    </span>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                  <h2 className="mb-2 font-heading text-lg font-bold leading-snug text-navy">{post.title}</h2>
                  <p className="mb-4 text-sm leading-relaxed text-gray-500">{post.desc}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                        <circle cx="10" cy="10" r="7.5" />
                        <path d="M10 6v4l2.5 2" />
                      </svg>
                      {post.readTime}
                    </span>
                    <a href="#" className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-dark">
                      Baca
                      <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
