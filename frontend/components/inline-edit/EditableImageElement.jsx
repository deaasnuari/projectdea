'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useEditMode } from './EditModeContext'
import { useTextElementsContext } from './TextElementsContext'
import { uploadImage } from '@/services/imageFile'
import { toast } from '@/components/ui/feedback'

const PencilIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
)

// Gambar yang bisa diganti admin lewat ikon pensil → pilih file dari
// perangkat (bukan ketik URL). URL hasil upload disimpan di kolom `content`
// tabel text_elements, di-key `elementKey` (mis. "kami-peduli.hero.background").
// Kalau belum ada di DB → pakai `defaultSrc`.
//
// Kontrol (pensil/reset/status) di-portal ke <body> dan diposisikan lewat
// getBoundingClientRect() gambar — supaya tetap bisa diklik walau gambar ada
// di dalam wadah `overflow-hidden` atau di balik elemen lain yang stacking
// context-nya lebih tinggi (mis. background section dengan konten di atasnya).
export default function EditableImageElement({
  elementKey,
  section = '',
  defaultSrc = '',
  alt = '',
  className = '',
  label = 'gambar',
  // `priority` → gambar penting (mis. latar hero / LCP): dimuat segera &
  // diberi prioritas tinggi. Selain itu: lazy-load supaya tidak menahan.
  priority = false,
}) {
  const { editing } = useEditMode()
  const ctx = useTextElementsContext()
  const row = ctx.get(elementKey)
  const src = row?.content || defaultSrc

  const [busy, setBusy] = useState(false)
  const [rect, setRect] = useState(null)
  const imgRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!editing) return
    const update = () => {
      const r = imgRef.current?.getBoundingClientRect()
      if (r) setRect({ top: r.top, right: r.right, left: r.left, width: r.width, height: r.height })
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null
    if (ro && imgRef.current) ro.observe(imgRef.current)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
      ro?.disconnect()
    }
  }, [editing, src])

  const img = (
    <img
      ref={imgRef}
      // Selama isi DB belum ada, jangan unduh gambar bawaan dulu — nanti
      // malah tampil sekilas lalu diganti gambar editan.
      src={ctx.ready ? src : undefined}
      data-te-fade={ctx.ready ? 'in' : 'out'}
      alt={alt}
      className={className}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
    />
  )

  if (!editing) return img

  const pickFile = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    inputRef.current?.click()
  }

  const onFile = async (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      // File-nya sendiri harus diunggah dulu supaya ada URL untuk pratinjau —
      // tapi menghubungkan URL itu ke elemen ini (kolom `content`) ditahan
      // lewat ctx.stage(), baru masuk DB saat klik "Simpan Semua".
      const url = await uploadImage(file)
      ctx.stage(elementKey, { page: ctx.page, section, content: url })
      toast('Gambar diganti — klik "Simpan Semua" untuk menyimpan.', { tone: 'info' })
    } catch (err) {
      toast(err.message || 'Gagal mengganti gambar', { tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  const resetImg = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    ctx.stageReset(elementKey)
    toast('Reset ditahan — klik "Simpan Semua" untuk menyimpan.', { tone: 'info' })
  }

  return (
    <>
      {img}
      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />

      {rect &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            <div
              className="fixed z-[4000] flex -translate-x-full gap-1.5"
              style={{ top: rect.top + 10, left: rect.right - 10 }}
            >
              {row?.content && (
                <button
                  type="button"
                  onClick={resetImg}
                  title={`Kembalikan ${label} ke bawaan`}
                  className="flex h-[30px] items-center rounded-full bg-white/90 px-2.5 text-[11px] font-bold text-gray-600 shadow-[0_4px_12px_rgba(6,30,40,0.35)] hover:bg-white"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={pickFile}
                aria-label={`Ganti ${label}`}
                title={`Ganti ${label}`}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_12px_rgba(6,30,40,0.4)] hover:bg-primary-dark"
              >
                {PencilIcon}
              </button>
            </div>

            {busy && (
              <span
                className="fixed z-[4001] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-navy/85 px-3 py-1.5 text-xs font-semibold text-white"
                style={{ top: rect.top + rect.height / 2, left: rect.left + rect.width / 2 }}
              >
                Mengunggah…
              </span>
            )}
          </>,
          document.body,
        )}
    </>
  )
}
