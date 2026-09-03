'use client'

import { useCallback } from 'react'
import { useSiteContent } from '@/services/siteContent'
import { DEFAULT_KAMI_PEDULI_CONTENT } from './kamiPeduliData'

// Baca konten "Kami Peduli" dari backend + fungsi ubah. Dipakai bersama
// HeroSection, ProgramKamiSection, dan halaman admin Dokumentasi.
export function useKamiPeduliContent() {
  const [content, update] = useSiteContent('kami-peduli', DEFAULT_KAMI_PEDULI_CONTENT)

  const patchSection = useCallback(
    (section, patch) => update((c) => ({ ...c, [section]: { ...c[section], ...patch } })),
    [update],
  )

  const patchListItem = useCallback(
    (listKey, id, patch) =>
      update((c) => ({
        ...c,
        [listKey]: c[listKey].map((item) => (item.id === id ? { ...item, ...patch } : item)),
      })),
    [update],
  )

  const addListItem = useCallback(
    (listKey, item) => update((c) => ({ ...c, [listKey]: [...c[listKey], item] })),
    [update],
  )

  const removeListItem = useCallback(
    (listKey, id) => update((c) => ({ ...c, [listKey]: c[listKey].filter((item) => item.id !== id) })),
    [update],
  )

  const setTopField = useCallback((key, value) => update((c) => ({ ...c, [key]: value })), [update])

  // FAQ konsultasi (nested di dalam `konsultasi`).
  const patchFaq = useCallback(
    (id, patch) =>
      update((c) => ({
        ...c,
        konsultasi: {
          ...c.konsultasi,
          faqs: c.konsultasi.faqs.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        },
      })),
    [update],
  )
  const addFaq = useCallback(
    () =>
      update((c) => ({
        ...c,
        konsultasi: {
          ...c.konsultasi,
          faqs: [
            ...c.konsultasi.faqs,
            {
              id: `faq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              q: 'Pertanyaan baru?',
              a: 'Jawaban.',
            },
          ],
        },
      })),
    [update],
  )
  const removeFaq = useCallback(
    (id) =>
      update((c) => ({
        ...c,
        konsultasi: { ...c.konsultasi, faqs: c.konsultasi.faqs.filter((f) => f.id !== id) },
      })),
    [update],
  )

  return {
    content,
    patchSection,
    patchListItem,
    addListItem,
    removeListItem,
    setTopField,
    patchFaq,
    addFaq,
    removeFaq,
  }
}
