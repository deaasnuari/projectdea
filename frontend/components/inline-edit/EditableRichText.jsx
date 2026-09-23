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
  offsetX: '',
  offsetY: '',
  boxWidth: '',
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
    offsetX: row?.offsetX || '',
    offsetY: row?.offsetY || '',
    boxWidth: row?.boxWidth || '',
  }
}

const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
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
  const [anchor, setAnchor] = useState(null)
  const anchorRef = useRef(null)
  const panelRef = useRef(null)

  // Geser posisi teks (drag). `dragDelta` = pergeseran sementara selama tarik;
  // setelah dilepas, ditahan lewat `ctx.stage()` (belum masuk DB — baru
  // dikirim saat admin klik "Simpan Semua" di bar bawah halaman).
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 })
  const dragRef = useRef(null) // { startX, startY, baseX, baseY } saat sedang menyeret
  const movedRef = useRef(false) // true kalau tarikan terakhir benar-benar menggeser (bukan klik)

  // Ubah lebar kotak teks lewat tarik gagang di tepi kanan. Sama seperti
  // posisi — hasil tarikan cuma ditahan lewat ctx.stage(), bukan langsung disimpan.
  const [resizeW, setResizeW] = useState(null) // lebar sementara (px) selama menarik gagang
  const resizeRef = useRef(null) // { startX, baseW }

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

  // Geser posisi (position:relative + left/top, px) & atur panjang/lebar teks
  // (max-width). Sumber = draft saat editor terbuka, kalau tidak → nilai DB;
  // posisi ditambah `dragDelta` selama menyeret.
  const baseX = num(active ? draft.offsetX : row?.offsetX)
  const baseY = num(active ? draft.offsetY : row?.offsetY)
  // Lebar efektif: saat menarik gagang → resizeW; selain itu → draft/DB
  // (row sudah termasuk perubahan yang ditahan lewat ctx.stage()).
  const boxWidth = resizeW != null ? `${resizeW}px` : (active ? draft.boxWidth : row?.boxWidth) || ''
  useLayoutEffect(() => {
    const el = anchorRef.current
    if (!el) return
    const x = baseX + dragDelta.x
    const y = baseY + dragDelta.y
    // Mode edit selalu relative supaya gagang resize bisa ditempel.
    if (x || y || editing) {
      el.style.setProperty('position', 'relative', 'important')
      el.style.setProperty('left', `${x}px`, 'important')
      el.style.setProperty('top', `${y}px`, 'important')
    } else {
      el.style.removeProperty('position')
      el.style.removeProperty('left')
      el.style.removeProperty('top')
    }
    if (boxWidth) {
      // Pakai `width` (bukan max-width) supaya kotak bisa dilebarkan melebihi
      // panjang teksnya. `max-width:none` + `white-space` mengalahkan kelas
      // Tailwind seperti `max-w-[520px]` dan wrapping bawaan.
      el.style.setProperty('display', 'inline-block', 'important')
      el.style.setProperty('width', boxWidth, 'important')
      el.style.setProperty('max-width', 'none', 'important')
      el.style.setProperty('white-space', 'normal', 'important')
    } else {
      el.style.removeProperty('display')
      el.style.removeProperty('width')
      el.style.removeProperty('max-width')
      el.style.removeProperty('white-space')
    }
  }, [baseX, baseY, dragDelta.x, dragDelta.y, boxWidth, editing])

  // --- Resize: tarik gagang di tepi kanan untuk melebar/menyempitkan kotak ---
  const onResizePointerDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const cur = parseFloat(active ? draft.boxWidth : row?.boxWidth)
    const baseW = Number.isFinite(cur) ? cur : Math.round(anchorRef.current?.getBoundingClientRect().width || 240)
    resizeRef.current = { startX: e.clientX, baseW }
    setResizeW(baseW)
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* abaikan */
    }
  }
  const onResizePointerMove = (e) => {
    if (!resizeRef.current) return
    const w = Math.max(60, Math.round(resizeRef.current.baseW + (e.clientX - resizeRef.current.startX)))
    setResizeW(w)
  }
  const onResizePointerUp = async (e) => {
    const r = resizeRef.current
    resizeRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* abaikan */
    }
    if (!r) return
    const w = Math.max(60, Math.round(r.baseW + (e.clientX - r.startX)))
    setResizeW(null)
    if (active) {
      patch({ boxWidth: `${w}px` })
      return
    }
    // Tahan perubahan — baru dikirim ke database lewat bar "Simpan Semua".
    ctx.stage(elementKey, { page: ctx.page, section, boxWidth: `${w}px` })
  }

  // --- Drag untuk memindahkan teks (hanya mode edit, panel tertutup) ---
  const onDragPointerDown = (e) => {
    if (!editing || active || e.button !== 0) return
    if (e.target.closest?.('.inline-edit-pencil')) return
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX, baseY }
    movedRef.current = false
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* abaikan */
    }
  }
  const onDragPointerMove = (e) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    if (!movedRef.current && Math.hypot(dx, dy) > 3) movedRef.current = true
    if (movedRef.current) setDragDelta({ x: dx, y: dy })
  }
  const onDragPointerUp = async (e) => {
    const d = dragRef.current
    dragRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* abaikan */
    }
    if (!d || !movedRef.current) return
    const nx = Math.round(d.baseX + (e.clientX - d.startX))
    const ny = Math.round(d.baseY + (e.clientY - d.startY))
    setDragDelta({ x: 0, y: 0 })
    // Tahan perubahan — baru dikirim ke database lewat bar "Simpan Semua".
    ctx.stage(elementKey, {
      page: ctx.page,
      section,
      offsetX: nx ? String(nx) : '',
      offsetY: ny ? String(ny) : '',
    })
    // Klik yang menyusul setelah pointerup jangan sampai membuka editor.
    setTimeout(() => {
      movedRef.current = false
    }, 0)
  }

  const openEditor = (e) => {
    if (movedRef.current) {
      movedRef.current = false
      return
    }
    e?.preventDefault?.()
    e?.stopPropagation?.()
    setDraft(rowToDraft(row, defaultText))
    const r = anchorRef.current?.getBoundingClientRect()
    if (r) setAnchor({ top: r.bottom, left: r.left, width: r.width })
    setActive(true)
  }

  const close = () => setActive(false)

  const patch = (p) => setDraft((d) => ({ ...d, ...p }))

  const submit = () => {
    ctx.stage(elementKey, {
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
      offsetX: draft.offsetX,
      offsetY: draft.offsetY,
      boxWidth: draft.boxWidth,
    })
    setActive(false)
    toast('Perubahan ditahan — klik "Simpan Semua" untuk menyimpan.', { tone: 'info' })
  }

  const doReset = () => {
    ctx.stageReset(elementKey)
    setActive(false)
    toast('Reset ditahan — klik "Simpan Semua" untuk menyimpan.', { tone: 'info' })
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
        style={active ? style : { ...style, cursor: 'move', touchAction: 'none' }}
        onClick={openEditor}
        onPointerDown={onDragPointerDown}
        onPointerMove={onDragPointerMove}
        onPointerUp={onDragPointerUp}
        title={active ? `Edit ${label}` : `Klik untuk edit · tarik untuk memindahkan`}
      >
        {active ? draft.content || ' ' : content}
        <span
          role="button"
          tabIndex={0}
          aria-label={`Edit ${label}`}
          className="inline-edit-pencil"
          onClick={openEditor}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openEditor(e)}
        >
          {PencilIcon}
        </span>
        {/* Gagang ubah lebar — tarik ke kiri/kanan untuk besar-kecilkan kotak */}
        <span
          aria-label={`Ubah lebar ${label}`}
          className="inline-edit-resize"
          title="Tarik untuk mengubah lebar kotak"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
        />
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

            {/* Geser posisi (px) — atau tarik langsung teksnya di halaman */}
            <div className="flex items-center gap-2 border-b border-gray-100 p-2">
              <span className="text-[10px] font-semibold uppercase text-gray-400">Posisi</span>
              <label className="flex items-center gap-1 text-[10px] text-gray-400">
                X
                <input
                  type="number"
                  value={draft.offsetX === '' ? '' : parseFloat(draft.offsetX)}
                  onChange={(e) => patch({ offsetX: e.target.value === '' ? '' : e.target.value })}
                  placeholder="0"
                  className="w-14 rounded border border-gray-200 px-1.5 py-1 text-[11px] text-navy"
                />
              </label>
              <label className="flex items-center gap-1 text-[10px] text-gray-400">
                Y
                <input
                  type="number"
                  value={draft.offsetY === '' ? '' : parseFloat(draft.offsetY)}
                  onChange={(e) => patch({ offsetY: e.target.value === '' ? '' : e.target.value })}
                  placeholder="0"
                  className="w-14 rounded border border-gray-200 px-1.5 py-1 text-[11px] text-navy"
                />
              </label>
              {(draft.offsetX || draft.offsetY) && (
                <button
                  type="button"
                  onClick={() => patch({ offsetX: '', offsetY: '' })}
                  className="ml-auto rounded border border-gray-200 bg-white px-1.5 py-1 text-[10px] text-gray-500 hover:bg-gray-50"
                  title="Kembalikan ke posisi semula"
                >
                  Reset posisi
                </button>
              )}
            </div>

            {draft.boxWidth && (
              <div className="flex items-center gap-2 border-b border-gray-100 p-2">
                <span className="text-[10px] font-semibold uppercase text-gray-400">Lebar</span>
                <span className="text-[11px] text-navy">{draft.boxWidth}</span>
                <button
                  type="button"
                  onClick={() => patch({ boxWidth: '' })}
                  className="ml-auto rounded border border-gray-200 bg-white px-1.5 py-1 text-[10px] text-gray-500 hover:bg-gray-50"
                  title="Kembalikan ke lebar bawaan"
                >
                  Reset lebar
                </button>
              </div>
            )}

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
                disabled={!row}
                className="rounded px-2 py-1.5 text-[11px] font-bold text-gray-500 hover:bg-gray-200 disabled:opacity-40"
                title='Ditahan sampai klik "Simpan Semua"'
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
                  className="btn btn-primary px-4 py-1.5 text-xs"
                  title='Ditahan sampai klik "Simpan Semua"'
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
