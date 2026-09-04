'use client'

import { createContext, useContext, useMemo } from 'react'
import { useTextElements } from '@/services/textElements'

// Menyediakan isi + styling semua elemen teks sebuah halaman ke seluruh
// <EditableRichText> di bawahnya. Satu fetch per halaman, bukan per elemen.
const TextElementsContext = createContext({
  page: '',
  get: () => null,
  save: async () => {},
  reset: async () => {},
  loading: false,
})

export function TextElementsProvider({ page, children }) {
  const { map, loading, save, reset } = useTextElements(page)

  const value = useMemo(
    () => ({
      page,
      loading,
      get: (elementKey) => map.get(elementKey) || null,
      save,
      reset,
    }),
    [page, loading, map, save, reset],
  )

  return <TextElementsContext.Provider value={value}>{children}</TextElementsContext.Provider>
}

export function useTextElementsContext() {
  return useContext(TextElementsContext)
}
