'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useEditMode } from './EditModeContext'
import { useTextElementsContext } from './TextElementsContext'
import { useDevice } from './responsive'

// Blok (tombol / kartu) yang bisa dipindahkan admin di mode edit, lewat
// gagang ✥ di pojok kiri atas. Posisi ditahan lewat ctx.stage() seperti teks
// (offsetX = persen lebar `.container`, offsetY = px) dan baru tersimpan saat
// "Simpan Semua". Hanya digeser di pratinjau Desktop; di Tablet & HP posisi
// px tidak dipakai — blok ikut urutannya lewat useFlowOrder (data-flow-id).
export default function MovableBlock({
  elementKey,
  section = '',
  as: As = 'div',
  className = '',
  label = 'blok ini',
  children,
  ...rest
}) {
  const { editing } = useEditMode()
  const ctx = useTextElementsContext()
  const device = useDevice()
  const canArrange = editing && device === 'desktop'
  const row = ctx.get(elementKey)

  const ref = useRef(null)
  const dragRef = useRef(null)
  const [delta, setDelta] = useState({ x: 0, y: 0 })
  const [tick, setTick] = useState(0)

  const boxOf = () => ref.current?.closest('.container') || ref.current?.parentElement
  const boxWidth = () => boxOf()?.clientWidth || 0

  useEffect(() => {
    const box = boxOf()
    if (!box || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => setTick((t) => t + 1))
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  const rawX = row?.offsetX || ''
  const baseY = parseFloat(row?.offsetY) || 0

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const small = device !== 'desktop'
    const s = String(rawX).trim()
    const n = parseFloat(s)
    const baseX = Number.isFinite(n) ? (s.endsWith('%') ? (n / 100) * boxWidth() : n) : 0
    const x = small ? 0 : Math.round(baseX + delta.x)
    const y = small ? 0 : Math.round(baseY + delta.y)
    if (x || y || editing) {
      el.style.setProperty('position', 'relative')
      el.style.setProperty('left', `${x}px`)
      el.style.setProperty('top', `${y}px`)
      if (dragRef.current) el.style.setProperty('z-index', '20')
      else el.style.removeProperty('z-index')
    } else {
      el.style.removeProperty('position')
      el.style.removeProperty('left')
      el.style.removeProperty('top')
      el.style.removeProperty('z-index')
    }
  }, [rawX, baseY, delta.x, delta.y, editing, device, tick])

  const onDown = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: parseFloat(ref.current?.style.getPropertyValue('left')) || 0,
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* abaikan */
    }
  }
  const onMove = (e) => {
    const d = dragRef.current
    if (!d) return
    setDelta({ x: e.clientX - d.startX, y: e.clientY - d.startY })
  }
  const onUp = (e) => {
    const d = dragRef.current
    dragRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* abaikan */
    }
    if (!d) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    setDelta({ x: 0, y: 0 })
    if (Math.hypot(dx, dy) <= 3) return
    // Jaga blok tetap di dalam area konten.
    const box = boxOf()?.getBoundingClientRect()
    const r = ref.current?.getBoundingClientRect()
    let nx = d.baseX + dx
    if (box && r) {
      const left = r.left - d.baseX
      nx = Math.min(Math.max(nx, box.left - left), Math.max(box.left - left, box.right - left - r.width))
    }
    const ny = Math.round(baseY + dy)
    const w = boxWidth()
    ctx.stage(elementKey, {
      page: ctx.page,
      section,
      offsetX: Math.round(nx) && w ? `${+((nx / w) * 100).toFixed(2)}%` : '',
      offsetY: ny ? String(ny) : '',
    })
  }

  return (
    <As
      ref={ref}
      data-flow-id={elementKey}
      className={className}
      onClick={editing && As === 'a' ? (e) => e.preventDefault() : undefined}
      {...rest}
    >
      {children}
      {canArrange && (
        <span
          role="button"
          aria-label={`Pindahkan ${label}`}
          title={`Tarik untuk memindahkan ${label}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          style={{ touchAction: 'none' }}
          className="absolute -left-2.5 -top-2.5 z-10 flex h-6 w-6 cursor-move items-center justify-center rounded-full bg-gold text-navy shadow-md"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" />
          </svg>
        </span>
      )}
      {canArrange && (rawX || baseY) ? (
        <span
          role="button"
          aria-label={`Kembalikan ${label} ke posisi awal`}
          title="Kembalikan ke posisi awal"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            ctx.stage(elementKey, { page: ctx.page, section, offsetX: '', offsetY: '' })
          }}
          className="absolute -top-2.5 left-5 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white text-navy shadow-md hover:bg-gray-100"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 109-9 9 9 0 00-6.7 3L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </span>
      ) : null}
    </As>
  )
}
