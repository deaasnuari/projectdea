'use client'

import EditableRichText from '@/components/inline-edit/EditableRichText'
import { useEditMode } from '@/components/inline-edit/EditModeContext'
import { AddItemButton, DeleteItemButton } from '@/components/inline-edit/EditControls'
import { useTentangContent, uid } from './tentangData'

const TITLE_MAIN_STYLE = { fontStyle: 'normal', color: 'inherit' }

export default function SejarahSection() {
  const { content, addListItem, removeListItem } = useTentangContent()
  const { isAdmin } = useEditMode()
  const s = content.sejarah
  const milestones = content.milestones
  const last = milestones.length - 1

  return (
    <section className="bg-white py-14">
      <div className="container">
        <div className="mb-8 flex items-end justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start">
          <div>
            <EditableRichText
              elementKey="tentang-kami.sejarah.label"
              section="sejarah"
              as="p"
              className="section-label !mb-1 !text-xs"
              defaultText={s.label}
              label="label Perjalanan Kami"
            />
            <h2 className="section-title !text-xl">
              <EditableRichText
                elementKey="tentang-kami.sejarah.title"
                section="sejarah"
                as="span"
                style={TITLE_MAIN_STYLE}
                defaultText={s.titleMain}
                label="judul Sejarah"
              />{' '}
              <EditableRichText
                elementKey="tentang-kami.sejarah.highlight"
                section="sejarah"
                as="span"
                defaultText={s.titleHighlight}
                label="kata yang ditonjolkan"
              />
            </h2>
          </div>
          {isAdmin && (
            <AddItemButton
              label="Tambah milestone"
              onClick={() =>
                addListItem('milestones', { id: uid('s'), label: 'Judul Baru', desc: 'Keterangan milestone baru.' })
              }
            />
          )}
        </div>

        {/* Timeline: garis penghubung + penanda bernomor. Di layar lebar
            mendatar (garis di atas), di HP menurun (garis di kiri). */}
        <ol className="relative grid gap-y-8 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4">
          {/* garis mendatar — hanya di lg ke atas */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-[18px] hidden h-px bg-gradient-to-r from-gold/10 via-gold/50 to-gold/10 lg:block"
          />
          {milestones.map((m, i) => (
            <li key={m.id} className="relative pl-14 sm:pl-0 sm:pt-[3.25rem]">
              {/* garis menurun antar penanda — HP & tablet */}
              {i !== last && (
                <span
                  aria-hidden
                  className="absolute left-[17px] top-10 h-[calc(100%-1rem)] w-px bg-gold/25 sm:hidden"
                />
              )}
              <span className="absolute left-0 top-0 z-[1] flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold bg-white font-heading text-sm font-extrabold text-primary shadow-[0_4px_14px_rgba(232,185,48,0.3)]">
                {i + 1}
              </span>
              <EditableRichText
                elementKey={`tentang-kami.sejarah.milestone.${m.id}.label`}
                section="sejarah"
                as="h3"
                className="mb-1.5 font-heading text-[13px] font-bold uppercase tracking-[0.05em] text-navy"
                defaultText={m.label}
                label="judul milestone"
              />
              <EditableRichText
                elementKey={`tentang-kami.sejarah.milestone.${m.id}.desc`}
                section="sejarah"
                as="p"
                className="text-xs leading-relaxed text-gray-500"
                defaultText={m.desc}
                label="keterangan milestone"
                multiline
              />
              {isAdmin && (
                <DeleteItemButton
                  className="mt-2"
                  label="Hapus milestone ini"
                  onClick={() => removeListItem('milestones', m.id)}
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
