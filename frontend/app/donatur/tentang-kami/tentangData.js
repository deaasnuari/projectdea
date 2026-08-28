'use client'

// Semua teks bagian "Tentang Kami" ada di SATU file ini (data default +
// baca/simpan + hook) — sengaja tidak dipecah-pecah. Admin mengeditnya
// langsung di halaman lewat inline editing (lihat components/inline-edit/*),
// mirip "Kami Peduli". Belum ada backend: perubahan disimpan di localStorage
// supaya tetap ada setelah refresh.

import { useCallback, useEffect, useState } from 'react'

export const TENTANG_STORAGE_KEY = 'lazis-pln-tentang-content'
export const TENTANG_UPDATED_EVENT = 'tentang-content-updated'

export const DEFAULT_TENTANG_CONTENT = {
  hero: {
    label: 'Tentang Kami',
    titleMain: 'LAZIS PT PLN Batam',
    titleHighlight: 'Amanah Sejak Berdiri',
    description:
      'Lembaga Zakat dan Shadaqah PT PLN Batam (LAZIS PLN Batam) adalah unit pengelola zakat internal yang bertugas mengumpulkan dan menyalurkan zakat, infaq, shadaqah dari karyawan PLN Batam kepada mustahik di wilayah Kepulauan Riau.',
  },
  keunggulan: [
    { id: 'k1', text: 'Terdaftar & terverifikasi BAZNAS Kota Batam' },
    { id: 'k2', text: 'Pengawasan Dewan Syariah bersertifikat' },
    { id: 'k3', text: 'Laporan keuangan diaudit setiap tahun' },
    { id: 'k4', text: 'Penyaluran langsung tanpa potongan biaya operasional' },
  ],
  visiMisi: {
    label: 'Arah Kami',
    titleMain: 'Visi &',
    titleHighlight: 'Misi',
    visiTitle: 'Visi',
    visiText:
      'Menjadi lembaga amil zakat internal yang amanah, profesional, dan berdampak nyata bagi kesejahteraan mustahik di wilayah Kepulauan Riau.',
    misiTitle: 'Misi',
  },
  misi: [
    {
      id: 'm1',
      text: 'Menghimpun zakat, infaq, dan shadaqah dari karyawan PLN Batam secara optimal dan berkelanjutan.',
    },
    {
      id: 'm2',
      text: 'Menyalurkan dana secara tepat sasaran, transparan, dan tepat waktu kepada mustahik.',
    },
    { id: 'm3', text: 'Mengelola dana sesuai syariat Islam di bawah pengawasan Dewan Syariah.' },
    {
      id: 'm4',
      text: 'Membangun program pemberdayaan yang memberi dampak jangka panjang bagi masyarakat.',
    },
  ],
  sejarah: {
    label: 'Perjalanan Kami',
    titleMain: 'Sejarah',
    titleHighlight: 'Kami',
  },
  milestones: [
    {
      id: 's1',
      label: 'Awal Berdiri',
      desc: 'LAZIS PLN Batam dibentuk sebagai unit pengelola zakat internal untuk memudahkan karyawan PLN Batam menunaikan zakat, infaq, dan shadaqah secara amanah.',
    },
    {
      id: 's2',
      label: 'Perluasan Program',
      desc: 'Program penyaluran diperluas ke berbagai bidang — pendidikan, kesehatan, dan bantuan sosial — agar manfaatnya menjangkau lebih banyak mustahik di Kepulauan Riau.',
    },
    {
      id: 's3',
      label: 'Digitalisasi Layanan',
      desc: 'Layanan donasi dan pelaporan mulai dikembangkan secara digital agar donatur dapat berdonasi dan memantau penyaluran dengan lebih mudah dan transparan.',
    },
    {
      id: 's4',
      label: 'Hari Ini',
      desc: 'LAZIS PLN Batam terus berkomitmen menghimpun dan menyalurkan dana zakat secara profesional, transparan, dan tepat sasaran bagi masyarakat yang membutuhkan.',
    },
  ],
  pencapaian: {
    label: 'Bukti Nyata',
    titleMain: 'Pencapaian',
    titleHighlight: 'Kami',
    text: 'Sejauh ini, LAZIS PLN Batam telah menghimpun Rp 3.8 M dana zakat, infaq, dan shadaqah dari 1.240+ donatur aktif, dan menyalurkannya kepada lebih dari 5.600+ penerima manfaat di Kepulauan Riau. Seluruh dana dikelola dengan transparansi penuh dan dapat dipertanggungjawabkan kepada setiap donatur.',
  },
  nilai: {
    label: 'Prinsip Kerja',
    titleMain: 'Nilai-Nilai',
    titleHighlight: 'Kami',
  },
  tim: {
    label: 'Kenali Tim Kami',
    titleMain: 'Tim yang',
    titleHighlight: 'Berdedikasi',
    description:
      'Kenali tim kami yang berdedikasi dalam memberikan layanan zakat, infaq, dan shadaqah yang amanah bagi karyawan PLN Batam dan masyarakat yang membutuhkan.',
  },
  values: [
    {
      id: 'v1',
      title: 'Amanah',
      desc: 'Mengelola setiap dana zakat, infaq, dan shadaqah dengan penuh tanggung jawab sesuai syariat dan kepercayaan donatur.',
    },
    {
      id: 'v2',
      title: 'Transparan',
      desc: 'Menyampaikan laporan penyaluran secara terbuka dan dapat dipertanggungjawabkan kepada seluruh donatur.',
    },
    {
      id: 'v3',
      title: 'Profesional',
      desc: 'Bekerja dengan standar layanan yang rapi, terukur, dan mengikuti tata kelola lembaga amil zakat yang baik.',
    },
    {
      id: 'v4',
      title: 'Peduli',
      desc: 'Hadir dan berpihak kepada mustahik dengan empati, agar bantuan yang disalurkan benar-benar tepat sasaran.',
    },
  ],
}

function mergeWithDefault(saved) {
  if (!saved || typeof saved !== 'object') return DEFAULT_TENTANG_CONTENT
  const d = DEFAULT_TENTANG_CONTENT

  const pickList = (savedList, defaultList) => {
    if (!Array.isArray(savedList)) return defaultList
    return savedList
      .filter((s) => s && typeof s === 'object' && s.id)
      .map((s) => {
        const base = defaultList.find((x) => x.id === s.id)
        return base ? { ...base, ...s } : s
      })
  }

  return {
    hero: { ...d.hero, ...(saved.hero || {}) },
    keunggulan: pickList(saved.keunggulan, d.keunggulan),
    visiMisi: { ...d.visiMisi, ...(saved.visiMisi || {}) },
    misi: pickList(saved.misi, d.misi),
    sejarah: { ...d.sejarah, ...(saved.sejarah || {}) },
    milestones: pickList(saved.milestones, d.milestones),
    pencapaian: { ...d.pencapaian, ...(saved.pencapaian || {}) },
    nilai: { ...d.nilai, ...(saved.nilai || {}) },
    values: pickList(saved.values, d.values),
    tim: { ...d.tim, ...(saved.tim || {}) },
  }
}

export function getTentangContent() {
  if (typeof window === 'undefined') return DEFAULT_TENTANG_CONTENT
  try {
    const saved = window.localStorage.getItem(TENTANG_STORAGE_KEY)
    if (!saved) return DEFAULT_TENTANG_CONTENT
    return mergeWithDefault(JSON.parse(saved))
  } catch {
    return DEFAULT_TENTANG_CONTENT
  }
}

export function saveTentangContent(content) {
  if (typeof window === 'undefined') return
  // TODO(backend): kirim ke API di sini begitu server tersedia.
  window.localStorage.setItem(TENTANG_STORAGE_KEY, JSON.stringify(content))
  window.dispatchEvent(new Event(TENTANG_UPDATED_EVENT))
}

// Hook: baca konten + fungsi ubah. Dipakai semua section Tentang Kami.
export function useTentangContent() {
  const [content, setContent] = useState(DEFAULT_TENTANG_CONTENT)

  useEffect(() => {
    const refresh = () => setContent(getTentangContent())
    refresh()
    window.addEventListener(TENTANG_UPDATED_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(TENTANG_UPDATED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const patch = useCallback((section, p) => {
    const cur = getTentangContent()
    saveTentangContent({ ...cur, [section]: { ...cur[section], ...p } })
  }, [])

  const patchListItem = useCallback((listKey, id, p) => {
    const cur = getTentangContent()
    saveTentangContent({
      ...cur,
      [listKey]: cur[listKey].map((it) => (it.id === id ? { ...it, ...p } : it)),
    })
  }, [])

  const addListItem = useCallback((listKey, item) => {
    const cur = getTentangContent()
    saveTentangContent({ ...cur, [listKey]: [...cur[listKey], item] })
  }, [])

  const removeListItem = useCallback((listKey, id) => {
    const cur = getTentangContent()
    saveTentangContent({ ...cur, [listKey]: cur[listKey].filter((it) => it.id !== id) })
  }, [])

  return { content, patch, patchListItem, addListItem, removeListItem }
}

export const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
