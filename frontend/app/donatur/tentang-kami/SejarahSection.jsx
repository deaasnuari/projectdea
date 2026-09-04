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

  return (
    <section className="bg-white py-12">
      <div className="container">
        <div className="mb-6 flex items-end justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start">
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

        <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
          {content.milestones.map((m) => (
            <div key={m.id} className="relative border-t-2 border-gold pt-3">
              <EditableRichText
                elementKey={`tentang-kami.sejarah.milestone.${m.id}.label`}
                section="sejarah"
                as="h3"
                className="mb-1.5 font-heading text-xs font-bold uppercase tracking-[0.05em] text-primary"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
