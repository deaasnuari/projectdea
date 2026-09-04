'use client'

import EditableRichText from '@/components/inline-edit/EditableRichText'
import { useTentangContent } from './tentangData'

export default function PencapaianSection() {
  const { content } = useTentangContent()
  const p = content.pencapaian

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy to-primary-dark py-6">
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden="true">
        <defs>
          <pattern id="achievement-lattice" width="72" height="72" patternUnits="userSpaceOnUse">
            <path
              d="M36 2 L44 20 L64 12 L52 30 L70 36 L52 42 L64 60 L44 52 L36 70 L28 52 L8 60 L20 42 L2 36 L20 30 L8 12 L28 20 Z"
              fill="none"
              stroke="#fff"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#achievement-lattice)" />
      </svg>

      <div className="container relative z-[1] text-center">
        <EditableRichText
          elementKey="tentang-kami.pencapaian.label"
          section="pencapaian"
          as="p"
          className="section-label !mb-1 !justify-center !text-[10px] !text-gold"
          defaultText={p.label}
          label="label Bukti Nyata"
        />
        <h2 className="mb-2 font-heading text-base font-semibold leading-[1.15] text-white">
          <EditableRichText
            elementKey="tentang-kami.pencapaian.title"
            section="pencapaian"
            as="span"
            defaultText={p.titleMain}
            label="judul Pencapaian"
          />{' '}
          <EditableRichText
            elementKey="tentang-kami.pencapaian.highlight"
            section="pencapaian"
            as="span"
            className="italic text-gold"
            defaultText={p.titleHighlight}
            label="kata yang ditonjolkan"
          />
        </h2>

        <EditableRichText
          elementKey="tentang-kami.pencapaian.text"
          section="pencapaian"
          as="p"
          className="mx-auto max-w-[480px] text-[11px] leading-[1.6] text-white/80"
          defaultText={p.text}
          label="paragraf pencapaian"
          multiline
        />
      </div>
    </section>
  )
}
