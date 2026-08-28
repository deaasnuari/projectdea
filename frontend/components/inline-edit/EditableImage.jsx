'use client'

import { useEffect, useRef, useState } from 'react'
import { useEditMode } from './EditModeContext'

const PencilIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
)

// Gambar yang bisa diganti langsung di tempatnya. Render <img> sama persis
// seperti sebelumnya; di mode edit muncul tombol pensil di pojok gambar,
// diklik → kolom kecil untuk mengganti URL gambar + Simpan / Batal.
// Wadah gambar di pemanggil sudah `relative`, jadi overlay pakai `absolute`.
export default function EditableImage({ src, alt = '', onSave, className = '', label = 'gambar' }) {
  const { editing } = useEditMode()
  const [active, setActive] = useState(false)
  const [draft, setDraft] = useState(src)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!active) setDraft(src)
  }, [src, active])

  useEffect(() => {
    if (active && inputRef.current) inputRef.current.focus()
  }, [active])

  const img = <img src={src} alt={alt} className={className} />

  if (!editing) return img

  const commit = () => {
    const next = (draft ?? '').trim()
    if (next && next !== src) onSave(next)
    setActive(false)
  }

  return (
    <>
      {img}
      {!active && (
        <button
          type="button"
          className="inline-edit-img-pencil"
          aria-label={`Ganti ${label}`}
          title={`Ganti ${label}`}
          onClick={(e) => {
            e.preventDefault()
            setDraft(src)
            setActive(true)
          }}
        >
          {PencilIcon}
        </button>
      )}
      {active && (
        <div className="inline-edit-img-pop" onClick={(e) => e.preventDefault()}>
          <label className="inline-edit-img-pop-label">URL {label}</label>
          <input
            ref={inputRef}
            type="text"
            className="inline-edit-img-pop-input"
            value={draft}
            placeholder="/images/contoh.png"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                commit()
              } else if (e.key === 'Escape') {
                e.preventDefault()
                setActive(false)
              }
            }}
          />
          <div className="inline-edit-img-pop-actions">
            <button type="button" className="inline-edit-btn inline-edit-btn-cancel" onClick={() => setActive(false)}>
              Batal
            </button>
            <button type="button" className="inline-edit-btn inline-edit-btn-save" onClick={commit}>
              Simpan
            </button>
          </div>
        </div>
      )}
    </>
  )
}
