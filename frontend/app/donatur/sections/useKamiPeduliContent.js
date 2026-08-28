'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_KAMI_PEDULI_CONTENT,
  KAMI_PEDULI_UPDATED_EVENT,
  getKamiPeduliContent,
  saveKamiPeduliContent,
} from './kamiPeduliData'

// Baca konten "Kami Peduli" + sediakan fungsi simpan (dipakai bersama
// HeroSection & ProgramKamiSection). Pola sama seperti DonorStatsSection:
// mulai dari DEFAULT (biar render pertama server & client cocok), lalu
// ambil versi tersimpan setelah mount, dan ikuti perubahan lewat event.
export function useKamiPeduliContent() {
  const [content, setContent] = useState(DEFAULT_KAMI_PEDULI_CONTENT)

  useEffect(() => {
    const refresh = () => setContent(getKamiPeduliContent())
    refresh()
    window.addEventListener(KAMI_PEDULI_UPDATED_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(KAMI_PEDULI_UPDATED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  // Ubah beberapa field dalam satu bagian objek (hero / programHeading / galeriHeading).
  const patchSection = useCallback((section, patch) => {
    const current = getKamiPeduliContent()
    saveKamiPeduliContent({ ...current, [section]: { ...current[section], ...patch } })
  }, [])

  // Ubah satu item dalam list (videos / galeri) berdasarkan id.
  const patchListItem = useCallback((listKey, id, patch) => {
    const current = getKamiPeduliContent()
    saveKamiPeduliContent({
      ...current,
      [listKey]: current[listKey].map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })
  }, [])

  // Tambah item baru ke akhir list (videos / galeri).
  const addListItem = useCallback((listKey, item) => {
    const current = getKamiPeduliContent()
    saveKamiPeduliContent({ ...current, [listKey]: [...current[listKey], item] })
  }, [])

  // Hapus satu item dari list berdasarkan id.
  const removeListItem = useCallback((listKey, id) => {
    const current = getKamiPeduliContent()
    saveKamiPeduliContent({
      ...current,
      [listKey]: current[listKey].filter((item) => item.id !== id),
    })
  }, [])

  // Ubah satu field di level atas (mis. selengkapnyaLabel).
  const setTopField = useCallback((key, value) => {
    const current = getKamiPeduliContent()
    saveKamiPeduliContent({ ...current, [key]: value })
  }, [])

  return { content, patchSection, patchListItem, addListItem, removeListItem, setTopField }
}
