'use client'

// Data awal + util halaman "Kontak Kami". Sumber kebenaran di backend
// (tabel `contact_page`, satu baris). Hook + klien API-nya di
// services/contactPage.js — file ini menyimpan default & util, lalu
// meneruskan hook supaya import lama tetap jalan.

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
    description: 'Punya pertanyaan atau keluhan? Sampaikan melalui formulir di bawah ini.',
    buttonLabel: 'Kirim Pesan',
  },
}

export const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

export { useKontakContent } from '@/services/contactPage'

// Link untuk item kontak (telepon → tel:, email → mailto:, whatsapp → wa.me).
export function kontakHref(item) {
  if (!item) return null
  if (item.type === 'telepon') {
    const digits = String(item.value || '').replace(/[^\d+]/g, '')
    return digits ? `tel:${digits}` : null
  }
  if (item.type === 'whatsapp') {
    const digits = String(item.value || '').replace(/\D/g, '')
    return digits ? `https://wa.me/${digits}` : null
  }
  if (item.type === 'email') {
    const v = String(item.value || '').trim()
    return v ? `mailto:${v}` : null
  }
  return null
}
