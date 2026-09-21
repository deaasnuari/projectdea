'use client'

import { useEffect } from 'react'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import { formatDateID } from '@/services/dateText'
import { normalizeHeroSize } from '@/services/heroSize'

// Template "Blog" — halaman artikel tunggal (judul, thumbnail, kategori,
// penulis, tanggal, isi rich text, SEO).
export default function BlogTemplateView({ menu, page, isPreview }) {
  const d = page?.data || {}
  const title = page?.title?.trim() || menu?.name || ''
  const heroSize = normalizeHeroSize(d.heroSize)
  const resized = heroSize < 100

  useEffect(() => {
    if (d.seoTitle) {
      const prev = document.title
      document.title = d.seoTitle
      return () => {
        document.title = prev
      }
    }
  }, [d.seoTitle])

  useEffect(() => {
    if (!d.seoDesc) return
    let tag = document.querySelector('meta[name="description"]')
    let created = false
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
      created = true
    }
    const prev = tag.getAttribute('content')
    tag.setAttribute('content', d.seoDesc)
    return () => {
      if (created) tag.remove()
      else if (prev != null) tag.setAttribute('content', prev)
    }
  }, [d.seoDesc])

  return (
    <PageHeroBackground className="pb-16 pt-24 sm:pb-24">
      <div className="container">
        <div className="mx-auto max-w-[820px]">
          {isPreview && (
            <span className="mb-4 inline-block rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy">
              Pratinjau — belum dipublikasikan
            </span>
          )}
          <article className="overflow-hidden rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-lg rounded-br-lg bg-white shadow-[0_24px_60px_-24px_rgba(6,30,40,0.4)]">
            {page?.heroImage && (
              <div className={resized ? 'flex justify-center px-6 pt-8 sm:px-12' : ''}>
                <img
                  src={page.heroImage}
                  alt={title}
                  style={{ width: `${heroSize}%` }}
                  className={`block h-auto ${resized ? 'rounded-lg' : ''}`}
                />
              </div>
            )}
            <div className="px-6 py-10 sm:px-12 sm:py-14">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                {d.category && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
                    {d.category}
                  </span>
                )}
                {d.date && <span className="text-xs text-gray-400">{formatDateID(d.date)}</span>}
                {d.author && <span className="text-xs text-gray-400">· oleh {d.author}</span>}
              </div>

              <h1 className="mb-8 font-heading text-4xl font-semibold leading-[1.2] text-navy max-[600px]:text-3xl">
                {title}
              </h1>

              {page?.bodyHtml ? (
                <div
                  className="rich-content border-t border-gray-100 pt-8"
                  dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
                />
              ) : (
                <p className="border-t border-gray-100 pt-8 text-sm text-gray-400">
                  Isi artikel belum diisi.
                </p>
              )}
            </div>
          </article>
        </div>
      </div>
    </PageHeroBackground>
  )
}
