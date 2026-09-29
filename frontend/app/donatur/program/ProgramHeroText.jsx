'use client'

import { useRef } from 'react'
import EditableRichText from '@/components/inline-edit/EditableRichText'
import CustomTexts from '@/components/inline-edit/CustomTexts'
import { useFlowOrder } from '@/components/inline-edit/useFlowOrder'

// Teks header halaman Daftar Program — bisa diedit admin lewat pratinjau di
// /admin/program (klik ✏️). Disimpan di text_elements, page "program".
export default function ProgramHeroText() {
  // Susunan hasil geser di Desktop ikut (sebagai urutan) di Tablet & HP.
  const flowRef = useRef(null)
  useFlowOrder(flowRef, 'hero')

  return (
    <div ref={flowRef} data-flow-group className="mb-10 sm:mb-14">
      <EditableRichText
        elementKey="program.hero.label"
        section="hero"
        as="p"
        className="section-label !text-gold"
        defaultText="Daftar Program"
        label="label Daftar Program"
      />
      <h1 data-flow-split className="font-heading text-4xl font-semibold leading-[1.15] text-white max-[600px]:text-3xl">
        <EditableRichText
          elementKey="program.hero.title"
          section="hero"
          as="span"
          defaultText="Saluran Kebaikan"
          label="judul"
        />
        <br />
        <EditableRichText
          elementKey="program.hero.highlight"
          section="hero"
          as="span"
          className="italic text-gold"
          defaultText="dari Karyawan untuk Umat"
          label="judul (ditonjolkan)"
        />
      </h1>
      <EditableRichText
        elementKey="program.hero.description"
        section="hero"
        as="p"
        className="mt-4 max-w-[520px] text-sm leading-[1.7] text-white/70"
        defaultText="Pilih program yang ingin kamu dukung. Setiap rupiah disalurkan langsung kepada penerima manfaat dengan laporan yang transparan."
        label="paragraf pengantar"
        multiline
      />
      <CustomTexts section="hero" tone="dark" className="mt-4 max-w-[520px]" />
    </div>
  )
}
