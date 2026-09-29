'use client'

import { useEffect, useLayoutEffect } from 'react'
import { useEditMode } from './EditModeContext'
import { useTextElementsContext } from './TextElementsContext'
import { useDevice } from './responsive'

// "Susunan urutan ikut" — posisi yang admin geser di Desktop dibawa ke
// Tablet & HP sebagai URUTAN (atas → bawah, kiri → kanan), bukan titik piksel,
// supaya di layar kecil tetap rapi & tidak pernah saling menimpa.
//
// Pemakaian di sebuah grup (mis. isi hero):
//   <div ref={ref} data-flow-group> … anak-anak ber-`data-flow-id` … </div>
//   useFlowOrder(ref, 'hero')
// - Elemen yang disusun: turunan ber-`data-flow-id` (EditableRichText otomatis
//   memakai elementKey-nya; tombol/kartu diberi id manual).
// - Pembungkus ber-`data-flow-split` (mis. <h1> berisi judul + kata sorot)
//   "dibuka" di layar kecil (display: contents) supaya isinya bisa diurutkan
//   sendiri-sendiri.
//
// Urutan disimpan sebagai elemen teks biasa `<page>.__layout.<grup>` (isi =
// JSON daftar id) — ikut alur draf: Simpan Semua → Selesai Edit, satu data
// untuk semua perangkat, tanpa kolom database baru.
export function flowKey(page, group) {
  return `${page}.__layout.${group}`
}

// Blok teratas saja: elemen ber-id yang ada DI DALAM blok lain (mis. teks di
// dalam tombol/kartu) ikut blok induknya, tidak diurutkan sendiri.
function itemsOf(group) {
  return [...group.querySelectorAll('[data-flow-id]')].filter((el) => {
    if (el.closest('[data-flow-group]') !== group) return false
    const outer = el.parentElement?.closest('[data-flow-id]')
    return !outer || !group.contains(outer)
  })
}

// Urutan tampil sebenarnya di layar (dipakai di Desktop).
function visualOrder(group) {
  const items = itemsOf(group)
    .map((el) => ({ id: el.getAttribute('data-flow-id'), r: el.getBoundingClientRect() }))
    .filter((x) => x.r.width > 0 || x.r.height > 0 || x.id.endsWith('.custom'))
  items.sort((a, b) => {
    const ca = a.r.top + a.r.height / 2
    const cb = b.r.top + b.r.height / 2
    // Sebaris (tengah vertikal berdekatan) → kiri dulu; selain itu → atas dulu.
    const sameRow = Math.abs(ca - cb) < Math.min(a.r.height || 1, b.r.height || 1) / 2
    return sameRow ? a.r.left - b.r.left : ca - cb
  })
  return items.map((x) => x.id)
}

function parseOrder(content) {
  try {
    const v = JSON.parse(content || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function useFlowOrder(ref, group) {
  const ctx = useTextElementsContext()
  const { editing } = useEditMode()
  const device = useDevice()
  const key = flowKey(ctx.page, group)
  const saved = parseOrder(ctx.get(key)?.content)
  const savedStr = JSON.stringify(saved)
  const small = device !== 'desktop'

  // Tablet & HP: susun ulang mengikuti urutan dari Desktop.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const items = itemsOf(el)
    const active = small && saved.length > 0
    if (!active) {
      el.removeAttribute('data-flow-active')
      items.forEach((it) => it.style.removeProperty('order'))
      return
    }
    el.setAttribute('data-flow-active', '')
    items.forEach((it, i) => {
      const idx = saved.indexOf(it.getAttribute('data-flow-id'))
      // Elemen baru yang belum tercatat → di akhir, urutan DOM.
      it.style.setProperty('order', String(idx >= 0 ? idx : 1000 + i))
    })
    // `editing`: masuk/keluar mode edit membuat ulang node teks → pasang lagi.
  }, [small, savedStr, editing]) // eslint-disable-line react-hooks/exhaustive-deps

  // Desktop + mode edit: setiap ada perubahan (geser/lebar/isi) catat ulang
  // urutan tampilnya; hanya ditahan (stage) kalau memang berubah.
  useEffect(() => {
    if (!editing || small) return
    const el = ref.current
    if (!el) return
    let raf2
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const now = visualOrder(el)
        const natural = itemsOf(el).map((it) => it.getAttribute('data-flow-id'))
        const base = saved.length ? saved : natural
        if (JSON.stringify(now) === JSON.stringify(base)) return
        ctx.stage(key, { page: ctx.page, section: group, content: JSON.stringify(now) })
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [editing, small, ctx.get]) // eslint-disable-line react-hooks/exhaustive-deps
}
