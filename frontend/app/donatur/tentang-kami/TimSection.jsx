'use client'

import Link from 'next/link'
import EditableText from '@/components/inline-edit/EditableText'
import { useEditMode } from '@/components/inline-edit/EditModeContext'
import { useTentangContent } from './tentangData'
import { useTeam } from './useTeam'

const TITLE_MAIN_STYLE = { fontStyle: 'normal', color: 'inherit' }

function AvatarPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.76-3.58-5-8-5z" />
    </svg>
  )
}

export default function TimSection() {
  const { content, patch } = useTentangContent()
  const { team } = useTeam()
  const { isAdmin } = useEditMode()
  const t = content.tim

  return (
    <section className="bg-white py-12">
      <div className="container">
        <div className="mb-6 text-center">
          <EditableText
            as="p"
            className="section-label !justify-center !text-xs"
            value={t.label}
            onSave={(v) => patch('tim', { label: v })}
            label="label Kenali Tim Kami"
          />
          <h2 className="section-title !text-xl">
            <EditableText
              as="span"
              style={TITLE_MAIN_STYLE}
              value={t.titleMain}
              onSave={(v) => patch('tim', { titleMain: v })}
              label="judul Tim"
            />{' '}
            <EditableText
              as="span"
              value={t.titleHighlight}
              onSave={(v) => patch('tim', { titleHighlight: v })}
              label="kata yang ditonjolkan"
            />
          </h2>
          <EditableText
            as="p"
            className="mx-auto mt-2 max-w-[480px] text-xs leading-relaxed text-gray-500"
            value={t.description}
            onSave={(v) => patch('tim', { description: v })}
            label="paragraf Tim"
            multiline
          />

          {/* Anggota tim dikelola di halaman admin "Tim" (menu sidebar). */}
          {isAdmin && (
            <div className="mt-3">
              <Link
                href="/admin/tim"
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/50 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:border-primary hover:bg-primary/5"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13" aria-hidden="true">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Tambah / kelola anggota tim
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
          {team.map((member) => (
            <div key={member.id} className="card p-4 text-center">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="mx-auto mb-2.5 h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto mb-2.5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:h-6 [&_svg]:w-6">
                  <AvatarPlaceholder />
                </div>
              )}
              <h3 className="mb-0.5 font-heading text-sm font-bold text-navy">{member.name}</h3>
              <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
