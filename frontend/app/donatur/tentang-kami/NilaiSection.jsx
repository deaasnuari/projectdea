'use client'

import EditableText from '@/components/inline-edit/EditableText'
import { useEditMode } from '@/components/inline-edit/EditModeContext'
import { AddItemButton, DeleteItemButton } from '@/components/inline-edit/EditControls'
import { useTentangContent, uid } from './tentangData'

const TITLE_MAIN_STYLE = { fontStyle: 'normal', color: 'inherit' }

// Ikon dipasangkan berdasarkan urutan; item tambahan pakai ikon terakhir.
const VALUE_ICONS = [
  (
    <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  (
    <svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  (
    <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  ),
  (
    <svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
]

export default function NilaiSection() {
  const { content, patch, patchListItem, addListItem, removeListItem } = useTentangContent()
  const { isAdmin } = useEditMode()
  const n = content.nilai

  return (
    <section className="bg-gray-50 py-12">
      <div className="container">
        <div className="mb-6 flex items-end justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start">
          <div>
            <EditableText
              as="p"
              className="section-label !mb-1 !text-xs"
              value={n.label}
              onSave={(v) => patch('nilai', { label: v })}
              label="label Prinsip Kerja"
            />
            <h2 className="section-title !text-xl">
              <EditableText
                as="span"
                style={TITLE_MAIN_STYLE}
                value={n.titleMain}
                onSave={(v) => patch('nilai', { titleMain: v })}
                label="judul Nilai-Nilai"
              />{' '}
              <EditableText
                as="span"
                value={n.titleHighlight}
                onSave={(v) => patch('nilai', { titleHighlight: v })}
                label="kata yang ditonjolkan"
              />
            </h2>
          </div>
          {isAdmin && (
            <AddItemButton
              label="Tambah nilai"
              onClick={() =>
                addListItem('values', { id: uid('v'), title: 'Nilai Baru', desc: 'Keterangan nilai baru.' })
              }
            />
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
          {content.values.map((v, i) => (
            <div key={v.id} className="card p-4">
              <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:h-[18px] [&_svg]:w-[18px]">
                {VALUE_ICONS[i] || VALUE_ICONS[VALUE_ICONS.length - 1]}
              </div>
              <EditableText
                as="h3"
                className="mb-1.5 font-heading text-sm font-bold text-navy"
                value={v.title}
                onSave={(val) => patchListItem('values', v.id, { title: val })}
                label="nama nilai"
              />
              <EditableText
                as="p"
                className="text-xs leading-relaxed text-gray-500"
                value={v.desc}
                onSave={(val) => patchListItem('values', v.id, { desc: val })}
                label="keterangan nilai"
                multiline
              />
              {isAdmin && (
                <DeleteItemButton
                  className="mt-2"
                  label="Hapus nilai ini"
                  onClick={() => removeListItem('values', v.id)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
