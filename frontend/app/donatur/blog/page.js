import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import { POSTS } from './blogData'

export const metadata = {
  title: 'Blog — Lazis PLN Batam',
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <PageHeroBackground className="pb-24 pt-32">
        <div className="container">
          <p className="section-label !text-gold">Blog &amp; Kursus Kami</p>
          <h1 className="mb-12 font-heading text-4xl font-semibold leading-[1.15] text-white max-[600px]:text-3xl">
            Edukasi Zakat
            <br />
            <span className="italic text-gold">untuk Karyawan PLN Batam</span>
          </h1>

          <div className="grid grid-cols-3 gap-8 max-[900px]:grid-cols-1">
            {POSTS.map((post) => (
              <article
                key={post.slug}
                className="card"
              >
                <Link href={`/donatur/blog/${post.slug}`} className="block aspect-[3/2] overflow-hidden">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                </Link>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
                      {post.badge}
                    </span>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                  <h2 className="mb-2 font-heading text-lg font-bold leading-snug text-navy">
                    <Link href={`/donatur/blog/${post.slug}`} className="hover:text-primary">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mb-4 text-sm leading-relaxed text-gray-500">{post.desc}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                        <circle cx="10" cy="10" r="7.5" />
                        <path d="M10 6v4l2.5 2" />
                      </svg>
                      {post.readTime}
                    </span>
                    <Link
                      href={`/donatur/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-dark"
                    >
                      Baca
                      <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </PageHeroBackground>
      <Footer />
    </>
  )
}
