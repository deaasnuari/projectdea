'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import { useBlogPosts } from './useBlogPosts'
import { formatBlogDate } from '@/services/blog'
import { TextElementsProvider } from '@/components/inline-edit/TextElementsContext'
import BlogHeroText from './BlogHeroText'

export default function BlogPage() {
  const { posts: allPosts, loading } = useBlogPosts()
  // Artikel yang di-"Sembunyikan" di admin tidak tampil di halaman donatur.
  const visible = allPosts.filter((p) => p.active !== false)
  // Artikel pertama jadi sorotan besar (bila ada >1 artikel).
  const featured = visible.length > 1 ? visible[0] : null
  const posts = featured ? visible.slice(1) : visible

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
      <PageHeroBackground className="pb-16 pt-24 sm:pb-24">
        <div className="container">
          {/* Teks header — dikelola admin di /admin/blog */}
          <TextElementsProvider page="blog">
            <BlogHeroText />
          </TextElementsProvider>

          {visible.length === 0 ? (
            // Diam saja selagi memuat pertama kali — tanpa spinner/skeleton,
            // biar tidak ada kesan "loading" di antara kartu.
            <div aria-hidden className="min-h-[40vh]">
              {!loading && (
                <p className="text-sm text-white/70">Belum ada artikel.</p>
              )}
            </div>
          ) : null}

          {featured && (
            <article className="card mb-6 grid overflow-hidden md:min-h-[340px] md:grid-cols-[1.15fr_1fr]">
              <Link href={`/donatur/blog/${featured.slug}`} className="relative block aspect-[16/10] overflow-hidden md:aspect-auto">
                <img src={featured.image} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04] md:absolute md:inset-0" />
              </Link>
              <div className="flex flex-col justify-center p-6 md:p-6 lg:p-9">
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">Terbaru</span>
                  <span className="text-xs text-gray-500">{formatBlogDate(featured.date)}</span>
                </div>
                <h2 className="mb-3 font-heading text-2xl font-bold leading-snug text-navy lg:text-3xl">
                  <Link href={`/donatur/blog/${featured.slug}`} className="hover:text-primary">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mb-5 text-[15px] leading-relaxed text-gray-500">{featured.desc}</p>
                <Link
                  href={`/donatur/blog/${featured.slug}`}
                  className="btn btn-primary self-start"
                >
                  Baca Selengkapnya
                </Link>
              </div>
            </article>
          )}

          {visible.length === 0 ? null : posts.length === 0 ? null : slideMode ? (
            <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
              {posts.map(renderCard)}
            </div>
          ) : (
            <div className={`grid gap-6 sm:gap-8 max-[640px]:grid-cols-1 ${posts.length === 2 ? "grid-cols-2" : "grid-cols-3 max-[1000px]:grid-cols-2"}`}>
              {posts.map(renderCard)}
            </div>
          )}
        </div>
      </PageHeroBackground>
      <Footer />
    </>
  )
}
