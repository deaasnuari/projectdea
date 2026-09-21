'use client'

import { useRef } from 'react'
import { HERO_SIZE_MIN, HERO_SIZE_MAX } from '@/services/heroSize'

// Gambar dengan titik tarik di keempat pojok (seperti di Word). Gambar tampil
// utuh (tidak terpotong), proporsi selalu terjaga; ukuran disimpan sebagai
// persen lebar area konten.
const HANDLES = [
  { pos: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize', dir: -1 },
  { pos: 'right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize', dir: 1 },
  { pos: 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize', dir: -1 },
  { pos: 'right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize', dir: 1 },
]

export default function ResizableImage({ src, size, onChange }) {
  const canvasRef = useRef(null)
  const drag = useRef(null)

  const onDown = (e, dir) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = {
      x: e.clientX,
      dir,
      size,
      canvasW: canvasRef.current?.getBoundingClientRect().width || 1,
    }
  }
  const onMove = (e) => {
    const d = drag.current
    if (!d) return
    // gambar rata tengah: tiap sisi bergerak sejauh kursor, jadi lebar berubah 2× jarak tarik
    const next = d.size + ((e.clientX - d.x) * d.dir * 2 * 100) / d.canvasW
    onChange(Math.round(Math.min(HERO_SIZE_MAX, Math.max(HERO_SIZE_MIN, next))))
  }
  const onUp = () => {
    drag.current = null
  }

  return (
    <div>
      <div ref={canvasRef} className="max-w-2xl rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4">
        <div className="relative mx-auto select-none" style={{ width: `${size}%` }}>
          <img src={src} alt="" draggable={false} className="block h-auto w-full" />
          <div className="pointer-events-none absolute inset-0 ring-2 ring-primary" />
          {HANDLES.map((h, i) => (
            <span
              key={i}
              onPointerDown={(e) => onDown(e, h.dir)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              className={`absolute h-3.5 w-3.5 touch-none rounded-sm border-2 border-white bg-primary shadow ${h.pos}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className="text-gray-500">
          Tarik titik di pojok gambar untuk kecil/besarkan · <b className="text-primary-dark">{size}%</b>
        </span>
        <button
          type="button"
          onClick={() => onChange(HERO_SIZE_MAX)}
          className="rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary-dark hover:bg-primary/20"
        >
          Ukuran penuh
        </button>
      </div>
    </div>
  )
}
