'use client'

import EditableRichText from './EditableRichText'
import { useEditMode } from './EditModeContext'
import { useTextElementsContext } from './TextElementsContext'
import { toast } from '@/components/ui/feedback'

// Jenis teks yang bisa ditambahkan admin. `style` = styling awal yang ikut
// disimpan (tetap bisa diubah lewat panel ✏️ seperti teks lainnya).
const KINDS = {
  heading: {
    label: 'Judul',
    content: 'Judul baru',
    style: { fontSize: '28px', fontWeight: '700' },
  },
  paragraph: {
    label: 'Paragraf',
    content: 'Teks baru — klik ✏️ untuk mengubah isi & tampilannya.',
    style: {},
  },
}

const PlusIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" width="12" height="12" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

// Slot "teks tambahan" di sebuah section. Admin (mode edit) bisa menambah
// judul/paragraf baru di sini; tiap teks jadi elemen text_elements biasa
// ber-key `<page>.<section>.custom.<id>-<h|p>` (h = judul, p = paragraf),
// jadi ikut alur yang sama: diedit lewat ✏️, digeser/diubah lebarnya, ditahan sampai "Simpan Semua", dan baru
// tampil ke publik setelah "Selesai Edit". Hapus = tombol "Hapus teks".
//
// `tone` = warna bawaan teks sesuai latar section ('light' / 'dark').
export default function CustomTexts({ section, tone = 'light', className = '' }) {
  const { editing } = useEditMode()
  const ctx = useTextElementsContext()
  const prefix = `${ctx.page}.${section}.custom.`
  const keys = ctx.keysWithPrefix(prefix)

  if (!editing && keys.length === 0) return null

  const onDark = tone === 'dark'

  const add = (kind) => {
    const k = KINDS[kind]
    // Cap waktu base36 → key unik & urut sesuai waktu dibuat.
    const id = Date.now().toString(36)
    const key = `${prefix}${id}-${kind === 'heading' ? 'h' : 'p'}`
    ctx.stage(key, { page: ctx.page, section, content: k.content, ...k.style })
    toast(`${k.label} ditambahkan — klik ✏️ untuk mengedit, lalu "Simpan Semua".`, { tone: 'info' })
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {keys.map((key) => {
        const isHeading = key.endsWith('-h')
        return (
          <EditableRichText
            key={key}
            elementKey={key}
            section={section}
            as={isHeading ? 'h3' : 'p'}
            className={`${isHeading ? 'font-heading leading-tight' : 'text-base leading-[1.6]'} ${
              onDark ? (isHeading ? 'text-white' : 'text-white/80') : isHeading ? 'text-navy' : 'text-gray-600'
            }`}
            label="teks tambahan"
            multiline
            removable
          />
        )
      })}

      {editing && (
        <div
          className={`flex flex-wrap items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-[11px] ${
            onDark ? 'border-white/30 text-white/60' : 'border-primary/40 text-gray-400'
          }`}
        >
          <span className="font-semibold uppercase tracking-[0.06em]">Tambah teks</span>
          {Object.entries(KINDS).map(([kind, k]) => (
            <button
              key={kind}
              type="button"
              onClick={() => add(kind)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-bold transition-colors ${
                onDark
                  ? 'border-white/40 text-white hover:bg-white/10'
                  : 'border-primary/50 text-primary hover:bg-primary/5'
              }`}
            >
              {PlusIcon}
              {k.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
