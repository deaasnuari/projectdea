'use client'

// Jenis donasi & rekening bank untuk modal "Donasi via Transfer".
// Dua scope terpisah supaya rekening/jenis bisa dibedakan:
//   - 'tentang'  → tombol "Donasi via Transfer" di halaman Tentang Kami.
//   - 'program'  → tombol "Donasi" pada kartu program.
// Sekarang masing-masing punya tabel sendiri di backend:
//   jenis  → tabel donation_types  (services/donationTypes.js)
//   bank   → tabel bank_accounts   (services/bankAccounts.js)

import { useMemo } from 'react'
import { useBankAccounts } from '@/services/bankAccounts'
import { useDonationTypes } from '@/services/donationTypes'

// Dipakai sebagai nilai default awal di beberapa form (mis. form program).
export const DEFAULT_JENIS_DONASI = [
  { id: 'zakat-profesi', key: 'zakat-profesi', label: 'Zakat Profesi', programLabel: 'Zakat Profesi Karyawan' },
  { id: 'zakat-maal', key: 'zakat-maal', label: 'Zakat Maal', programLabel: 'Zakat Maal' },
  { id: 'infaq', key: 'infaq', label: 'Infaq', programLabel: 'Infaq' },
  { id: 'shadaqah', key: 'shadaqah', label: 'Shadaqah', programLabel: 'Shadaqah' },
  { id: 'fidyah', key: 'fidyah', label: 'Fidyah', programLabel: 'Fidyah' },
  { id: 'wakaf', key: 'wakaf', label: 'Wakaf', programLabel: 'Wakaf' },
]

export const DEFAULT_BANKS = [
  { id: 'bsi', name: 'BSI (Bank Syariah Indonesia)', short: 'BSI', noRek: '7123 456 789', badgeClass: 'bg-[#00754A]' },
  { id: 'mandiri', name: 'Bank Mandiri', short: 'MDR', noRek: '109 0001 23456', badgeClass: 'bg-[#003D79]' },
  { id: 'bri', name: 'BRI', short: 'BRI', noRek: '0026 01 099999 50 9', badgeClass: 'bg-[#00529C]' },
]

export function useDonationMethods(scope = 'tentang') {
  const { jenis, saveJenis, removeJenis } = useDonationTypes(scope)
  const { banks, saveBank, removeBank } = useBankAccounts(scope)

  return useMemo(
    () => ({
      jenisList: jenis,
      banks,
      saveJenis,
      removeJenis,
      saveBank,
      removeBank,
    }),
    [jenis, banks, saveJenis, removeJenis, saveBank, removeBank],
  )
}
