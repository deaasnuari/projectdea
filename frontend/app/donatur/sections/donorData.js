'use client'

// Data awal section "Jumlah Donatur". Sumber kebenaran ada di backend
// (tabel `donor_info`, satu baris). Hook + klien API-nya di services/donorInfo.js
// — file ini hanya menyimpan default & meneruskan hook supaya import lama jalan.

export const DEFAULT_DONOR_CONTENT = {
  title: 'Jumlah Donatur Saat Ini',
  description: 'Kepercayaan yang tumbuh dari kebaikan yang dilakukan bersama.',
  stats: [
    { value: 157, label: 'Donatur Zakat' },
    { value: 21, label: 'Donatur Infaq' },
    { value: 1, label: 'Donatur Orang Tua Asuh' },
  ],
}

export { useDonorContent } from '@/services/donorInfo'
