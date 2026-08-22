import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import { POSTS, getPostBySlug } from '../posts'

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Blog — Lazis PLN Batam' }
  return { title: `${post.title} — Lazis PLN Batam` }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const otherPosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <>
      <Navbar />
      <PageHeroBackground className="pb-24 pt-32">
        <div className="container">
          <div className="mx-auto max-w-[820px]">
            <Link
              href="/donatur/blog"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-gold"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Kembali ke Blog
            </Link>

            {/* Artikelnya ditempatkan dalam card tersendiri — bentuk sudut
                tajam / lengkung dalam yang sama seperti kartu konten di
                tempat lain, cuma dibuat lebih besar — supaya tidak
                mengambang polos di atas warna latar halaman. */}
            <article className="overflow-hidden rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-lg rounded-br-lg bg-white shadow-[0_24px_60px_-24px_rgba(6,30,40,0.4)]">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
              </div>

              <div className="px-6 py-10 sm:px-12 sm:py-14">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
                    {post.badge}
                  </span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                      <circle cx="10" cy="10" r="7.5" />
                      <path d="M10 6v4l2.5 2" />
                    </svg>
                    {post.readTime}
                  </span>
                </div>

                <h1 className="mb-8 font-heading text-4xl font-semibold leading-[1.2] text-navy max-[600px]:text-3xl">
                  {post.title}
                </h1>

                <div className="space-y-6 border-t border-gray-100 pt-8">
                  {post.content.map((paragraph, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? 'text-[1.05rem] leading-[1.9] text-gray-700 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-heading first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-primary'
                          : 'text-[1.05rem] leading-[1.9] text-gray-700'
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>

            {otherPosts.length > 0 && (
              <div className="mt-16">
                <p className="section-label !text-gold">Baca Juga</p>
                <h2 className="mb-6 font-heading text-xl font-semibold text-white">Artikel Lainnya</h2>
                <div className="grid grid-cols-2 gap-6 max-[600px]:grid-cols-1">
                  {otherPosts.map((p) => (
                    <Link key={p.slug} href={`/donatur/blog/${p.slug}`} className="card group block">
                      <div className="aspect-[3/2] overflow-hidden">
                        <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading text-base font-bold leading-snug text-navy group-hover:text-primary">
                          {p.title}
                        </h3>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">{p.date}</span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:text-primary-dark">
                            Baca
                            <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PageHeroBackground>
      <Footer />
    </>
  )
}
