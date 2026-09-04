'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import { useBlogPosts } from './useBlogPosts'
import { formatBlogDate } from '@/services/blog'

export default function BlogPage() {
  const { posts, loading } = useBlogPosts()

  // Sampai 3 artikel: grid biasa. Lebih dari itu: baris yang digeser ke
  // samping (scroll-snap) supaya halaman tidak makin panjang ke bawah —
  // pola yang sama seperti galeri di "Kami Peduli".
  const slideMode = posts.length > 3

  const renderCard = (post) => (
    <article
      key={post.slug}
      className={`card ${
        slideMode
          ? 'w-full shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]'
          : ''
      }`}
    >
      <Link href={`/donatur/blog/${post.slug}`} className="block aspect-[3/2] overflow-hidden">
        <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
      </Link>
      <div className="p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
            {post.badge}
          </span>
          <span className="text-xs text-gray-500">{formatBlogDate(post.date)}</span>
        </div>
        <h2 className="mb-2 font-heading text-lg font-bold leading-snug text-navy">
          <Link href={`/donatur/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-500">{post.desc}</p>
        <div className="flex items-center justify-end text-xs text-gray-500">
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
  )

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

          {posts.length === 0 ? (
            // Diam saja selagi memuat pertama kali — tanpa spinner/skeleton,
            // biar tidak ada kesan "loading" di antara kartu.
            <div aria-hidden className="min-h-[40vh]">
              {!loading && (
                <p className="text-sm text-white/70">Belum ada artikel.</p>
              )}
            </div>
          ) : slideMode ? (
            <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
              {posts.map(renderCard)}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6 sm:gap-8 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
              {posts.map(renderCard)}
            </div>
          )}
        </div>
      </PageHeroBackground>
      <Footer />
    </>
  )
}
