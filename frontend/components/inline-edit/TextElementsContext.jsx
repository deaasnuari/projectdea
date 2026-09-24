'use client'

import { createContext, useContext, useMemo } from 'react'
import { useTextElements } from '@/services/textElements'
import EditToolbar from './EditToolbar'

// Menyediakan isi + styling semua elemen teks sebuah halaman ke seluruh
// <EditableRichText> di bawahnya. Satu fetch per halaman, bukan per elemen.
//
// Perubahan TIDAK langsung dikirim ke server: komponen editor memanggil
// `stage()`/`stageReset()` untuk menahannya, lalu <EditToolbar> (dirender di
// sini juga, supaya cuma ada SATU bar mengambang) mengirim semuanya
// sekaligus lewat `saveAll()` saat admin klik "Simpan Semua".
const TextElementsContext = createContext({
  page: '',
  get: () => null,
  stage: () => {},
  stageReset: () => {},
  saveAll: async () => ({ okCount: 0, failedCount: 0 }),
  discardAll: () => {},
  publish: async () => ({ publishedCount: 0 }),
  pendingCount: 0,
  loading: false,
  // Default true: elemen di luar provider tidak perlu menunggu apa pun.
  ready: true,
})

export function TextElementsProvider({ page, children }) {
  const { loading, ready, get, stage, stageReset, saveAll, discardAll, publish, pendingCount } =
    useTextElements(page)

  const value = useMemo(
    () => ({
      page,
      loading,
      ready,
      get,
      stage,
      stageReset,
      saveAll,
      discardAll,
      publish,
      pendingCount,
    }),
    [page, loading, ready, get, stage, stageReset, saveAll, discardAll, publish, pendingCount],
  )

  return (
    <TextElementsContext.Provider value={value}>
      {children}
      <EditToolbar />
    </TextElementsContext.Provider>
  )
}

export function useTextElementsContext() {
  return useContext(TextElementsContext)
}
