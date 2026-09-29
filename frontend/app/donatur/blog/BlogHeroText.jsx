'use client'

import { useRef } from 'react'
import EditableRichText from '@/components/inline-edit/EditableRichText'
import CustomTexts from '@/components/inline-edit/CustomTexts'
import { useFlowOrder } from '@/components/inline-edit/useFlowOrder'

// Teks header halaman Blog — bisa diedit admin lewat pratinjau di
// /admin/blog (klik ✏️). Disimpan di text_elements, page "blog".
export default function BlogHeroText() {
  // Susunan hasil geser di Desktop ikut (sebagai urutan) di Tablet & HP.
  const flowRef = useRef(null)
  useFlowOrder(flowRef, 'hero')

  return (
    <div ref={flowRef} data-flow-group className="mb-12">
      <EditableRichText
        elementKey="blog.hero.label"
        section="hero"
        as="p"
        className="section-label !text-gold"
        defaultText="Blog & Kursus Kami"
        label="label Blog"
      />
      <h1 data-flow-split className="font-heading text-4xl font-semibold leading-[1.15] text-white max-[600px]:text-3xl">
        <EditableRichText
          elementKey="blog.hero.title"
          section="hero"
          as="span"
          defaultText="Edukasi Zakat"
          label="judul"
        />
        <br />
        <EditableRichText
          elementKey="blog.hero.highlight"
          section="hero"
          as="span"
          className="italic text-gold"
          defaultText="untuk Karyawan PLN Batam"
          label="judul (ditonjolkan)"
        />
      </h1>
      <CustomTexts section="hero" tone="dark" className="mt-4 max-w-[560px]" />
    </div>
  )
}
