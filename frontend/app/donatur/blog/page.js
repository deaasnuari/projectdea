'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import { useBlogPosts } from './useBlogPosts'
import { formatBlogDate } from '@/services/blog'
import { TextElementsProvider } from '@/components/inline-edit/TextElementsContext'
import BlogHeroText from './BlogHeroText'
import CardCarousel, { CAROUSEL_ITEM } from '@/components/ui/CardCarousel'

export default function BlogPage() {
  const { posts: allPosts, loading } = useBlogPosts()
  // Artikel yang di-"Sembunyikan" di admin tidak tampil di halaman donatur.
  const visible = allPosts.filter((p) => p.active !== false)

  // Semua artikel dalam satu baris carousel geser: kartu sama besar & sejajar
  // (3 per layar di desktop, 2 di tablet, 1 di HP).
  const renderCard = (post, i) => (
    <article key={post.slug} className={`card flex flex-col overflow-hidden ${CAROUSEL_ITEM}`}>
      <Link href={`/donatur/blog/${post.slug}`} className="relative block aspect-[3/2] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
        />
        {i === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy shadow">
            Terbaru
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-2 text-xs text-gray-500">{formatBlogDate(post.date)}</span>
        <h2 className="mb-2 font-heading text-lg font-bold leading-snug text-navy">
          <Link href={`/donatur/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h2>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-500">{post.desc}</p>
        <Link
          href={`/donatur/blog/${post.slug}`}
          className="mt-auto inline-flex items-center gap-1 self-end text-xs font-semibold text-primary hover:text-primary-dark"
        >
          Baca
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
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

          {visible.length > 0 && <CardCarousel>{visible.map(renderCard)}</CardCarousel>}
        </div>
      </PageHeroBackground>
      <Footer />
    </>
  )
}
