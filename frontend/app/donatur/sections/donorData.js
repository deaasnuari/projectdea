'use client'

// Section "Jumlah Donatur". Sumber kebenaran ada di backend (tabel `donor_info`,
// satu baris). Hook + klien API-nya di services/donorInfo.js — file ini hanya
// meneruskan hook supaya import lama jalan.

export { useDonorContent, DONOR_STAT_METRICS } from '@/services/donorInfo'
