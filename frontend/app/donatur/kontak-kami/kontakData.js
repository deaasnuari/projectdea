'use client'

// Semua teks halaman "Kontak Kami" ada di file ini (default + baca/simpan +
// hook). Admin mengeditnya langsung di halaman lewat inline editing, mirip
// "Tentang Kami". Belum ada backend: perubahan disimpan di localStorage.

import { useCallback, useEffect, useState } from 'react'

export const KONTAK_STORAGE_KEY = 'lazis-pln-kontak-content'
export const KONTAK_UPDATED_EVENT = 'kontak-content-updated'

export const DEFAULT_KONTAK_CONTENT = {
  hero: {
    label: 'Kontak Kami',
    titleMain: 'Ada Pertanyaan?',
    titleHighlight: 'Hubungi Kami',
    description:
      'Tim LAZIS PLN Batam siap membantu seputar zakat, infaq, shadaqah, maupun kerja sama program. Silakan hubungi kami melalui kontak di bawah, atau kirim pesan langsung lewat formulir.',
  },
  // type: 'alamat' | 'telepon' | 'email' | 'jam' (menentukan ikon & link).
  info: [
    { id: 'alamat', type: 'alamat', label: 'Alamat', value: 'Jl. PLN Batam, Kepulauan Riau, Indonesia' },
    { id: 'telepon', type: 'telepon', label: 'Telepon', value: '(0778) 123-456' },
    { id: 'email', type: 'email', label: 'Email', value: 'lazis@plnbatam.co.id' },
    { id: 'jam', type: 'jam', label: 'Jam Operasional', value: 'Senin – Jumat, 08.00 – 16.00 WIB' },
  ],
  form: {
    title: 'Kirim Pesan',
    description:
      'Isi formulir berikut, kami akan membuka aplikasi email kamu dengan pesan yang sudah terisi otomatis.',
    buttonLabel: 'Kirim Pesan',
  },
}

function mergeWithDefault(saved) {
  if (!saved || typeof saved !== 'object') return DEFAULT_KONTAK_CONTENT
  const d = DEFAULT_KONTAK_CONTENT

  let info = d.info
  if (Array.isArray(saved.info)) {
    info = saved.info
      .filter((s) => s && typeof s === 'object' && s.id)
      .map((s) => {
        const base = d.info.find((x) => x.id === s.id)
        return base ? { ...base, ...s } : { type: 'alamat', ...s }
      })
  }

  return {
    hero: { ...d.hero, ...(saved.hero || {}) },
    info,
    form: { ...d.form, ...(saved.form || {}) },
  }
}

export function getKontakContent() {
  if (typeof window === 'undefined') return DEFAULT_KONTAK_CONTENT
  try {
    const saved = window.localStorage.getItem(KONTAK_STORAGE_KEY)
    if (!saved) return DEFAULT_KONTAK_CONTENT
    return mergeWithDefault(JSON.parse(saved))
  } catch {
    return DEFAULT_KONTAK_CONTENT
  }
}

export function saveKontakContent(content) {
  if (typeof window === 'undefined') return
  // TODO(backend): kirim ke API di sini begitu server tersedia.
  window.localStorage.setItem(KONTAK_STORAGE_KEY, JSON.stringify(content))
  window.dispatchEvent(new Event(KONTAK_UPDATED_EVENT))
}

export const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

export function useKontakContent() {
  const [content, setContent] = useState(DEFAULT_KONTAK_CONTENT)

  useEffect(() => {
    const refresh = () => setContent(getKontakContent())
    refresh()
    window.addEventListener(KONTAK_UPDATED_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(KONTAK_UPDATED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const patch = useCallback((section, p) => {
    const cur = getKontakContent()
    saveKontakContent({ ...cur, [section]: { ...cur[section], ...p } })
  }, [])

  const patchInfo = useCallback((id, p) => {
    const cur = getKontakContent()
    saveKontakContent({ ...cur, info: cur.info.map((it) => (it.id === id ? { ...it, ...p } : it)) })
  }, [])

  const addInfo = useCallback(() => {
    const cur = getKontakContent()
    saveKontakContent({
      ...cur,
      info: [...cur.info, { id: uid('info'), type: 'alamat', label: 'Label Baru', value: 'Isi keterangan baru' }],
    })
  }, [])

  const removeInfo = useCallback((id) => {
    const cur = getKontakContent()
    saveKontakContent({ ...cur, info: cur.info.filter((it) => it.id !== id) })
  }, [])

  return { content, patch, patchInfo, addInfo, removeInfo }
}

// Link untuk item kontak (telepon → tel:, email → mailto:).
export function kontakHref(item) {
  if (!item) return null
  if (item.type === 'telepon') {
    const digits = String(item.value || '').replace(/[^\d+]/g, '')
    return digits ? `tel:${digits}` : null
  }
  if (item.type === 'email') {
    const v = String(item.value || '').trim()
    return v ? `mailto:${v}` : null
  }
  return null
}
