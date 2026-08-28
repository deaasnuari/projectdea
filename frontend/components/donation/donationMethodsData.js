'use client'

// Jenis donasi & rekening bank untuk modal "Donasi via Transfer".
// Ada DUA set terpisah supaya rekening/jenis bisa dibedakan:
//   - scope 'tentang'  → dipakai tombol "Donasi via Transfer" di halaman
//                        Tentang Kami. Dikelola di /admin/konten-tentang-kami.
//   - scope 'program'  → dipakai tombol "Donasi" pada kartu program.
//                        Dikelola di /admin/program.
// Belum ada backend: perubahan disimpan di localStorage per scope.

import { useCallback, useEffect, useState } from 'react'

export const DONATION_METHODS_UPDATED_EVENT = 'donation-methods-updated'

const STORAGE_KEYS = {
  tentang: 'lazis-pln-donation-methods',
  program: 'lazis-pln-donation-methods-program',
}
const keyFor = (scope) => STORAGE_KEYS[scope] || STORAGE_KEYS.tentang
const eventFor = (scope) => `${DONATION_METHODS_UPDATED_EVENT}:${scope || 'tentang'}`

export const DEFAULT_JENIS_DONASI = [
  { id: 'zakat-profesi', label: 'Zakat Profesi', programLabel: 'Zakat Profesi Karyawan' },
  { id: 'zakat-maal', label: 'Zakat Maal', programLabel: 'Zakat Maal' },
  { id: 'infaq', label: 'Infaq', programLabel: 'Infaq' },
  { id: 'shadaqah', label: 'Shadaqah', programLabel: 'Shadaqah' },
  { id: 'fidyah', label: 'Fidyah', programLabel: 'Fidyah' },
  { id: 'wakaf', label: 'Wakaf', programLabel: 'Wakaf' },
]

export const DEFAULT_BANKS = [
  { id: 'bsi', name: 'BSI (Bank Syariah Indonesia)', short: 'BSI', noRek: '7123 456 789', badgeClass: 'bg-[#00754A]' },
  { id: 'mandiri', name: 'Bank Mandiri', short: 'MDR', noRek: '109 0001 23456', badgeClass: 'bg-[#003D79]' },
  { id: 'bri', name: 'BRI', short: 'BRI', noRek: '0026 01 099999 50 9', badgeClass: 'bg-[#00529C]' },
]

const DEFAULTS = { jenis: DEFAULT_JENIS_DONASI, banks: DEFAULT_BANKS }

function pickList(savedList, defaultList) {
  if (!Array.isArray(savedList)) return defaultList
  return savedList
    .filter((s) => s && typeof s === 'object' && s.id)
    .map((s) => {
      const base = defaultList.find((x) => x.id === s.id)
      return base ? { ...base, ...s } : s
    })
}

export function getDonationMethods(scope = 'tentang') {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const saved = window.localStorage.getItem(keyFor(scope))
    if (!saved) return DEFAULTS
    const parsed = JSON.parse(saved)
    return {
      jenis: pickList(parsed.jenis, DEFAULT_JENIS_DONASI),
      banks: pickList(parsed.banks, DEFAULT_BANKS),
    }
  } catch {
    return DEFAULTS
  }
}

const uid = (p) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

export function useDonationMethods(scope = 'tentang') {
  const [data, setData] = useState(DEFAULTS)

  useEffect(() => {
    const refresh = () => setData(getDonationMethods(scope))
    refresh()
    window.addEventListener(eventFor(scope), refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(eventFor(scope), refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [scope])

  const write = useCallback(
    (next) => {
      if (typeof window === 'undefined') return
      window.localStorage.setItem(keyFor(scope), JSON.stringify(next))
      window.dispatchEvent(new Event(eventFor(scope)))
    },
    [scope],
  )

  // Simpan jenis donasi: id sudah ada → ubah, belum → tambah.
  const saveJenis = useCallback(
    (item) => {
      const cur = getDonationMethods(scope)
      const exists = cur.jenis.some((j) => j.id === item.id)
      const jenis = exists
        ? cur.jenis.map((j) => (j.id === item.id ? { ...j, ...item } : j))
        : [...cur.jenis, { id: item.id || uid('jenis'), ...item }]
      write({ ...cur, jenis })
    },
    [scope, write],
  )
  const removeJenis = useCallback(
    (id) => {
      const cur = getDonationMethods(scope)
      write({ ...cur, jenis: cur.jenis.filter((j) => j.id !== id) })
    },
    [scope, write],
  )

  const saveBank = useCallback(
    (item) => {
      const cur = getDonationMethods(scope)
      const exists = cur.banks.some((b) => b.id === item.id)
      const banks = exists
        ? cur.banks.map((b) => (b.id === item.id ? { ...b, ...item } : b))
        : [...cur.banks, { id: item.id || uid('bank'), ...item }]
      write({ ...cur, banks })
    },
    [scope, write],
  )
  const removeBank = useCallback(
    (id) => {
      const cur = getDonationMethods(scope)
      write({ ...cur, banks: cur.banks.filter((b) => b.id !== id) })
    },
    [scope, write],
  )

  return { jenisList: data.jenis, banks: data.banks, saveJenis, removeJenis, saveBank, removeBank }
}
