'use client'

import { useEffect, useRef, useState } from 'react'
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
// Tombol "+ Tambah teks" berlabel, di dalam alur konten tepat di titik tempat
// teks baru akan masuk (hanya di mode edit — pengunjung tidak melihatnya).
// Klik → pilih Judul / Paragraf.
function AddTextChip({ onDark, onPick, className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={ref} className={`relative z-20 inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title="Tambah judul atau paragraf baru di sini"
        className={`inline-flex items-center gap-1.5 rounded-full border-2 border-dashed px-3.5 py-1.5 text-xs font-bold transition-colors ${
          onDark
            ? 'border-white/70 bg-white/10 text-white hover:bg-white/20'
            : 'border-primary/70 bg-primary/5 text-primary hover:bg-primary/10'
        }`}
      >
        {PlusIcon}
        Tambah teks
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1.5 flex w-36 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-[12px] font-semibold text-navy shadow-[0_10px_28px_-8px_rgba(6,30,40,0.45)]">
          <span className="px-3 pb-1 pt-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-gray-400">
            Tambah teks
          </span>
          {Object.entries(KINDS).map(([kind, k]) => (
            <button
              key={kind}
              type="button"
              onClick={() => {
                onPick(kind)
                setOpen(false)
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-left hover:bg-primary/10"
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

  const addControl = editing && <AddTextChip onDark={onDark} onPick={add} />

  // Belum ada teks tambahan → di halaman publik tidak ada apa-apa; di mode
  // edit hanya tombol "Tambah teks".
  if (keys.length === 0) {
    return (
      <div className={`relative ${className}`} data-flow-id={`${prefix}custom`}>
        {addControl}
      </div>
    )
  }

  return (
    <div className={`relative flex flex-col gap-3 ${className}`} data-flow-id={`${prefix}custom`}>
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
      {addControl}
    </div>
  )
}
