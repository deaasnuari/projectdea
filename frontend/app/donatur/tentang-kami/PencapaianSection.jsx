'use client'

import EditableText from '@/components/inline-edit/EditableText'
import { useTentangContent } from './tentangData'

export default function PencapaianSection() {
  const { content, patch } = useTentangContent()
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
        <EditableText
          as="p"
          className="section-label !mb-1 !justify-center !text-[10px] !text-gold"
          value={p.label}
          onSave={(v) => patch('pencapaian', { label: v })}
          label="label Bukti Nyata"
        />
        <h2 className="mb-2 font-heading text-base font-semibold leading-[1.15] text-white">
          <EditableText
            as="span"
            value={p.titleMain}
            onSave={(v) => patch('pencapaian', { titleMain: v })}
            label="judul Pencapaian"
          />{' '}
          <EditableText
            as="span"
            className="italic text-gold"
            value={p.titleHighlight}
            onSave={(v) => patch('pencapaian', { titleHighlight: v })}
            label="kata yang ditonjolkan"
          />
        </h2>

        <EditableText
          as="p"
          className="mx-auto max-w-[480px] text-[11px] leading-[1.6] text-white/80"
          value={p.text}
          onSave={(v) => patch('pencapaian', { text: v })}
          label="paragraf pencapaian"
          multiline
        />
      </div>
    </section>
  )
}
