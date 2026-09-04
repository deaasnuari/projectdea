'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useEditMode } from './EditModeContext'
import { useTextElementsContext } from './TextElementsContext'
import { toast } from '@/components/ui/feedback'
import { FONT_FAMILY_OPTIONS, FONT_WEIGHT_OPTIONS, TEXT_ALIGN_OPTIONS } from '@/services/textElements'

// Peta field DB (camelCase) → properti CSS. Diterapkan lewat
// element.style.setProperty(..., 'important') supaya menang atas kelas
// Tailwind seperti `!text-gold` / `text-white/80` / `italic`.
const CSS_MAP = {
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  fontStyle: 'font-style',
  textDecoration: 'text-decoration',
  textColor: 'color',
  textAlign: 'text-align',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
}

function applyImportant(el, src) {
  if (!el) return
  for (const [field, cssProp] of Object.entries(CSS_MAP)) {
    const v = src && src[field]
    if (v) el.style.setProperty(cssProp, v, 'important')
    else el.style.removeProperty(cssProp)
  }
}

const PencilIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
)

const EMPTY_DRAFT = {
  content: '',
  fontFamily: '',
  fontSize: '',
  fontWeight: '',
  fontStyle: '',
  textDecoration: '',
  textColor: '',
  textAlign: '',
  lineHeight: '',
  letterSpacing: '',
}

function rowToDraft(row, fallbackText) {
  return {
    content: row?.content ?? fallbackText ?? '',
    fontFamily: row?.fontFamily || '',
    fontSize: row?.fontSize || '',
    fontWeight: row?.fontWeight || '',
    fontStyle: row?.fontStyle || '',
    textDecoration: row?.textDecoration || '',
    textColor: row?.textColor || '',
    textAlign: row?.textAlign || '',
    lineHeight: row?.lineHeight || '',
    letterSpacing: row?.letterSpacing || '',
  }
}

const AlignIcon = ({ kind }) => {
  const lines = {
    left: ['M3 5h18', 'M3 10h12', 'M3 15h18', 'M3 20h10'],
    center: ['M3 5h18', 'M6 10h12', 'M3 15h18', 'M7 20h10'],
    right: ['M3 5h18', 'M9 10h12', 'M3 15h18', 'M11 20h10'],
    justify: ['M3 5h18', 'M3 10h18', 'M3 15h18', 'M3 20h18'],
  }[kind]
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
      {lines.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}

// Teks yang bisa diedit + diatur tampilannya (font, ukuran, warna, tebal,
// miring, garis bawah, perataan, line-height, letter-spacing) secara visual.
// Isi + seluruh styling disimpan per `elementKey` di tabel text_elements.
// Kalau belum ada di DB → pakai `defaultText` + style bawaan className.
export default function EditableRichText({
  elementKey,
  section = '',
  as: As = 'span',
  defaultText = '',
  className = '',
  style,
  label = 'teks ini',
  multiline = false,
}) {
  const { editing } = useEditMode()
  const ctx = useTextElementsContext()
  const row = ctx.get(elementKey)

  const [active, setActive] = useState(false)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [busy, setBusy] = useState(false)
  const [anchor, setAnchor] = useState(null)
  const anchorRef = useRef(null)
  const panelRef = useRef(null)

  const content = row?.content ?? defaultText

  // Sumber style efektif: saat editor terbuka → draft (live preview), selain
  // itu → nilai tersimpan dari DB.
  const styleSrc = active ? draft : row || {}

  // Terapkan style ke node dengan !important, baik untuk pengunjung maupun
  // saat mode edit. removeProperty saat kosong → balik ke bawaan Tailwind.
  useLayoutEffect(() => {
    applyImportant(anchorRef.current, styleSrc)
  }, [
    styleSrc.fontFamily,
    styleSrc.fontSize,
    styleSrc.fontWeight,
    styleSrc.fontStyle,
    styleSrc.textDecoration,
    styleSrc.textColor,
    styleSrc.textAlign,
    styleSrc.lineHeight,
    styleSrc.letterSpacing,
    editing,
  ])

  const openEditor = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    setDraft(rowToDraft(row, defaultText))
    const r = anchorRef.current?.getBoundingClientRect()
    if (r) setAnchor({ top: r.bottom, left: r.left, width: r.width })
    setActive(true)
  }

  const close = () => setActive(false)

  const patch = (p) => setDraft((d) => ({ ...d, ...p }))

  const submit = async () => {
    setBusy(true)
    try {
      await ctx.save(elementKey, {
        page: ctx.page,
        section,
        content: draft.content,
        fontFamily: draft.fontFamily,
        fontSize: draft.fontSize,
        fontWeight: draft.fontWeight,
        fontStyle: draft.fontStyle,
        textDecoration: draft.textDecoration,
        textColor: draft.textColor,
        textAlign: draft.textAlign,
        lineHeight: draft.lineHeight,
        letterSpacing: draft.letterSpacing,
      })
      setActive(false)
      toast('Teks diperbarui.', { tone: 'success' })
    } catch (err) {
      toast(err.message || 'Gagal menyimpan teks', { tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  const doReset = async () => {
    setBusy(true)
    try {
      await ctx.reset(elementKey)
      setActive(false)
      toast('Teks dikembalikan ke tampilan bawaan.', { tone: 'success' })
    } catch (err) {
      toast(err.message || 'Gagal mereset', { tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (!active) return
    const onKey = (e) => e.key === 'Escape' && close()
    const onDown = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        close()
      }
    }
    const onScroll = () => {
      const r = anchorRef.current?.getBoundingClientRect()
      if (r) setAnchor({ top: r.bottom, left: r.left, width: r.width })
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [active])

  // --- Pengunjung / mode edit mati: render biasa; style diterapkan lewat ref ---
  if (!editing) {
    return (
      <As ref={anchorRef} className={className} style={style}>
        {content}
      </As>
    )
  }

  const sizeNum = parseInt(draft.fontSize, 10)

  return (
    <>
      <As
        ref={anchorRef}
        className={`${className} inline-editable`}
        style={style}
        onClick={openEditor}
        title={`Edit ${label}`}
      >
        {active ? draft.content || ' ' : content}
        <span
          role="button"
          tabIndex={0}
          aria-label={`Edit ${label}`}
          className="inline-edit-pencil"
          onClick={openEditor}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openEditor(e)}
        >
          {PencilIcon}
        </span>
      </As>

      {active &&
        anchor &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed z-[4000] w-[min(360px,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-gray-200 bg-white text-navy shadow-[0_24px_60px_-16px_rgba(6,30,40,0.5)]"
            style={{
              top: Math.min(anchor.top + 8, window.innerHeight - 340),
              left: Math.max(12, Math.min(anchor.left, window.innerWidth - 372)),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-100 bg-gray-50 p-2">
              <select
                value={draft.fontFamily}
                onChange={(e) => patch({ fontFamily: e.target.value })}
                className="h-7 max-w-[112px] rounded border border-gray-200 bg-white px-1 text-[11px]"
                title="Jenis font"
              >
                {FONT_FAMILY_OPTIONS.map((o) => (
                  <option key={o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <span className="flex h-7 items-center rounded border border-gray-200 bg-white px-1 text-[11px]">
                <input
                  type="number"
                  min="8"
                  max="200"
                  value={Number.isFinite(sizeNum) ? sizeNum : ''}
                  onChange={(e) => patch({ fontSize: e.target.value ? `${e.target.value}px` : '' })}
                  placeholder="ukuran"
                  className="w-11 bg-transparent text-right outline-none"
                  title="Ukuran font (px)"
                />
                <span className="pl-0.5 text-gray-400">px</span>
              </span>

              <select
                value={draft.fontWeight}
                onChange={(e) => patch({ fontWeight: e.target.value })}
                className="h-7 w-[74px] rounded border border-gray-200 bg-white px-1 text-[11px]"
                title="Ketebalan"
              >
                {FONT_WEIGHT_OPTIONS.map((o) => (
                  <option key={o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => patch({ fontWeight: draft.fontWeight === '700' ? '' : '700' })}
                className={`h-7 w-7 rounded border text-[13px] font-bold ${draft.fontWeight === '700' ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white'}`}
                title="Tebal"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => patch({ fontStyle: draft.fontStyle === 'italic' ? '' : 'italic' })}
                className={`h-7 w-7 rounded border text-[13px] italic ${draft.fontStyle === 'italic' ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white'}`}
                title="Miring"
              >
                I
              </button>
              <button
                type="button"
                onClick={() =>
                  patch({ textDecoration: draft.textDecoration === 'underline' ? '' : 'underline' })
                }
                className={`h-7 w-7 rounded border text-[13px] underline ${draft.textDecoration === 'underline' ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white'}`}
                title="Garis bawah"
              >
                U
              </button>

              <label
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-gray-200 bg-white"
                title="Warna teks"
              >
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(draft.textColor) ? draft.textColor : '#0a2e3c'}
                  onChange={(e) => patch({ textColor: e.target.value })}
                  className="h-4 w-4 cursor-pointer border-0 bg-transparent p-0"
                />
              </label>
              {draft.textColor && (
                <button
                  type="button"
                  onClick={() => patch({ textColor: '' })}
                  className="h-7 rounded border border-gray-200 bg-white px-1 text-[10px] text-gray-500"
                  title="Hapus warna"
                >
                  ✕warna
                </button>
              )}

              {TEXT_ALIGN_OPTIONS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => patch({ textAlign: draft.textAlign === a ? '' : a })}
                  className={`flex h-7 w-7 items-center justify-center rounded border ${draft.textAlign === a ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white'}`}
                  title={`Rata ${a}`}
                >
                  <AlignIcon kind={a} />
                </button>
              ))}
            </div>

            {/* Line height & letter spacing */}
            <div className="flex gap-2 border-b border-gray-100 p-2">
              <label className="flex flex-1 items-center gap-1 text-[10px] font-semibold uppercase text-gray-400">
                Line
                <input
                  type="text"
                  value={draft.lineHeight}
                  onChange={(e) => patch({ lineHeight: e.target.value })}
                  placeholder="1.4"
                  className="w-full rounded border border-gray-200 px-1.5 py-1 text-[11px] font-normal normal-case text-navy"
                />
              </label>
              <label className="flex flex-1 items-center gap-1 text-[10px] font-semibold uppercase text-gray-400">
                Spasi
                <input
                  type="text"
                  value={draft.letterSpacing}
                  onChange={(e) => patch({ letterSpacing: e.target.value })}
                  placeholder="0.02em"
                  className="w-full rounded border border-gray-200 px-1.5 py-1 text-[11px] font-normal normal-case text-navy"
                />
              </label>
            </div>

            {/* Isi teks */}
            <div className="p-2">
              <textarea
                autoFocus
                rows={multiline ? 3 : 2}
                value={draft.content}
                onChange={(e) => patch({ content: e.target.value })}
                className="w-full resize-y rounded border border-gray-200 p-2 text-sm text-navy outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-gray-100 bg-gray-50 p-2">
              <button
                type="button"
                onClick={doReset}
                disabled={busy || !row}
                className="rounded px-2 py-1.5 text-[11px] font-bold text-gray-500 hover:bg-gray-200 disabled:opacity-40"
              >
                Reset ke bawaan
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-white"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={busy}
                  className="btn btn-primary px-4 py-1.5 text-xs disabled:opacity-60"
                >
                  {busy ? 'Menyimpan…' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
