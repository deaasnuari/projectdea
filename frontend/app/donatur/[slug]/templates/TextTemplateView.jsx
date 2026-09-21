'use client'

import PageHeroBackground from '@/components/layout/PageHeroBackground'
import { normalizeHeroSize } from '@/services/heroSize'

// Template "Teks Biasa" — judul + gambar utama (opsional) + isi rich text.
export default function TextTemplateView({ menu, page, isPreview }) {
  const title = page?.title?.trim() || menu?.name || ''
  return (
    <>
      <PageHeroBackground className="pb-10 pt-24">
        <div className="container">
          {isPreview && (
            <span className="mb-3 inline-block rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy">
              Pratinjau — belum dipublikasikan
            </span>
          )}
          <p className="section-label !text-gold">{menu?.name}</p>
          <h1 className="max-w-[720px] font-heading text-4xl font-semibold leading-[1.15] text-white max-[600px]:text-3xl">
            {title}
          </h1>
        </div>
      </PageHeroBackground>

      <section className="bg-gray-50 py-12">
        <div className="container">
          <article className="mx-auto max-w-[760px] rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(6,30,40,0.06)] ring-1 ring-black/[0.04] sm:p-10">
            {page?.heroImage ? (
              <img
                src={page.heroImage}
                alt={title}
                style={{ width: `${normalizeHeroSize(page.data?.heroSize)}%` }}
                className="mx-auto mb-6 block h-auto rounded-xl"
              />
            ) : null}
            {page?.bodyHtml ? (
              <div
                className="rich-content"
                dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
              />
            ) : (
              <p className="text-sm text-gray-400">Konten halaman ini belum diisi.</p>
            )}
          </article>
        </div>
      </section>
    </>
  )
}
