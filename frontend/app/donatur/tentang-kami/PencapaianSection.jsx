'use client'

import EditableRichText from '@/components/inline-edit/EditableRichText'
import { useTentangContent } from './tentangData'

export default function PencapaianSection() {
  const { content } = useTentangContent()
  const p = content.pencapaian

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy to-primary-dark py-9">
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

      {/* garis emas tipis di tepi atas & bawah — memberi bingkai pada pita ini */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="container relative z-[1] flex flex-col items-center text-center">
        <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-gold/30 bg-gold/[0.12] text-gold">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" />
            <path d="M17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3" />
          </svg>
        </span>

        <EditableRichText
          elementKey="tentang-kami.pencapaian.label"
          section="pencapaian"
          as="p"
          className="section-label !mb-1.5 !justify-center !text-[10px] !text-gold"
          defaultText={p.label}
          label="label Bukti Nyata"
        />
        <h2 className="mb-2 font-heading text-lg font-semibold leading-[1.15] text-white sm:text-xl">
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

        <span aria-hidden className="mb-3 h-0.5 w-10 rounded-full bg-gold/70" />

        <EditableRichText
          elementKey="tentang-kami.pencapaian.text"
          section="pencapaian"
          as="p"
          className="mx-auto max-w-[560px] text-[12px] leading-[1.7] text-white/85"
          defaultText={p.text}
          label="paragraf pencapaian"
          multiline
        />
      </div>
    </section>
  )
}
