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
// Tombol "+" bulat kecil di MARGIN KIRI konten (di luar area teks, seperti
// gagang tambah blok di editor dokumen) — sejajar dengan titik tempat teks
// baru akan masuk, jadi tidak menutupi judul/tombol/kartu mana pun. Klik →
// pilih Judul / Paragraf.
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
    <div ref={ref} className={`absolute right-full z-20 mr-0.5 -translate-y-1/2 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Tambah teks di sini"
        title="Tambah teks di sini"
        className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border border-dashed transition-opacity ${
          open ? 'opacity-100' : 'opacity-60 hover:opacity-100'
        } ${onDark ? 'border-white/60 bg-navy-dark/60 text-white' : 'border-primary/60 bg-white text-primary'}`}
      >
        {PlusIcon}
      </button>
      {open && (
        <div className="absolute left-full top-1/2 z-30 ml-1.5 flex w-36 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-[12px] font-semibold text-navy shadow-[0_10px_28px_-8px_rgba(6,30,40,0.45)]">
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

  // Kontrol tambah = overlay (absolute), BUKAN bagian dari alur halaman —
  // tidak mendorong tombol/kartu/judul. Layout mode edit = layout normal.
  // Posisinya di margin kiri, sejajar titik tempat teks baru akan masuk.
  const addControl = editing && (
    <AddTextChip onDark={onDark} onPick={add} className={keys.length === 0 ? 'top-0' : 'top-full'} />
  )

  // Belum ada teks tambahan → di halaman publik tidak ada apa-apa; di mode
  // edit cukup titik jangkar setinggi 0 (tanpa margin) untuk kontrol overlay.
  if (keys.length === 0) {
    return (
      <div className="relative h-0 w-full" data-flow-id={`${prefix}custom`}>
        {addControl}
      </div>
    )
  }

  return (
    <div className={`relative flex flex-col gap-3 ${className}`} data-flow-id={`${prefix}custom`}>
      {addControl}
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
    </div>
  )
}
