'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useEditMode } from './EditModeContext'

const PencilIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
)

// Teks yang bisa diedit langsung di tempatnya.
// - Pengunjung / mode edit non-aktif: render `as` + value, DOM sama persis.
// - Mode edit aktif: outline tipis + ikon pensil (tanpa menggeser layout).
// - Diklik: berubah jadi input/textarea di posisi yang sama + tombol
//   Simpan / Batal. Enter = simpan (Ctrl+Enter untuk multiline), Esc = batal.
export default function EditableText({
  value,
  onSave,
  as: As = 'span',
  multiline = false,
  className = '',
  style,
  label = 'teks ini',
  preserveWhitespace = false,
  placeholder = '',
}) {
  const { editing } = useEditMode()
  const [active, setActive] = useState(false)
  const [draft, setDraft] = useState(value)
  const fieldRef = useRef(null)

  const wsClass = preserveWhitespace ? ' whitespace-pre-line' : ''

  const autoGrow = () => {
    const el = fieldRef.current
    if (!el || !multiline) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useLayoutEffect(() => {
    if (active) autoGrow()
  }, [active, draft])

  useEffect(() => {
    if (active && fieldRef.current) {
      fieldRef.current.focus()
      fieldRef.current.select()
    }
  }, [active])

  // Kalau nilai dari luar berubah (mis. disimpan di tab lain), sinkronkan
  // selama tidak sedang diedit.
  useEffect(() => {
    if (!active) setDraft(value)
  }, [value, active])

  const start = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    setDraft(value)
    setActive(true)
  }

  const cancel = () => setActive(false)

  const commit = () => {
    const next = (draft ?? '').trim()
    if (next !== value.trim()) onSave(next)
    setActive(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
    } else if (e.key === 'Enter' && (!multiline || e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      commit()
    }
  }

  // --- Pengunjung biasa / mode edit mati: tidak ada jejak apa pun ---
  if (!editing) {
    return (
      <As className={className + wsClass} style={style}>
        {value}
      </As>
    )
  }

  // --- Mode edit aktif, sedang diedit ---
  if (active) {
    return (
      <As className={className + wsClass} style={style} onClick={(e) => e.preventDefault()}>
        <span className="inline-edit-box">
          {multiline ? (
            <textarea
              ref={fieldRef}
              className="inline-edit-field"
              rows={1}
              value={draft}
              placeholder={placeholder}
              onChange={(e) => setDraft(e.target.value)}
              onInput={autoGrow}
              onKeyDown={onKeyDown}
            />
          ) : (
            <input
              ref={fieldRef}
              type="text"
              className="inline-edit-field"
              style={{ width: `${Math.max((draft || '').length + 1, 4)}ch` }}
              value={draft}
              placeholder={placeholder}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
            />
          )}
          <span className="inline-edit-actions" contentEditable={false}>
            <span
              role="button"
              tabIndex={0}
              className="inline-edit-btn inline-edit-btn-cancel"
              onClick={(e) => {
                e.preventDefault()
                cancel()
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), cancel())}
            >
              Batal
            </span>
            <span
              role="button"
              tabIndex={0}
              className="inline-edit-btn inline-edit-btn-save"
              onClick={(e) => {
                e.preventDefault()
                commit()
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), commit())}
            >
              Simpan
            </span>
          </span>
        </span>
      </As>
    )
  }

  // --- Mode edit aktif, belum diedit: outline + pensil ---
  return (
    <As
      className={`${className}${wsClass} inline-editable`}
      style={style}
      onClick={start}
      title={`Edit ${label}`}
    >
      {value}
      <span
        role="button"
        tabIndex={0}
        aria-label={`Edit ${label}`}
        className="inline-edit-pencil"
        onClick={start}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && start(e)}
      >
        {PencilIcon}
      </span>
    </As>
  )
}
