// Konten bagian "Kami Peduli" di beranda donatur (Hero + section id
// "programs" yang dituju link navbar "Kami Peduli"). Semua teks & gambar di
// sini bisa diubah admin lewat inline editing LANGSUNG di halaman publik
// (lihat components/inline-edit/*), bukan lewat halaman form terpisah.
//
// Mengikuti pola donorData.js: sumber kebenaran = DEFAULT_* di bawah,
// perubahan admin disimpan ke localStorage supaya tetap ada setelah
// refresh. Belum ada backend — begitu API tersedia, ganti get/save di
// bawah dengan fetch ke server (bentuk datanya dibuat supaya tinggal
// dikirim apa adanya).

export const KAMI_PEDULI_STORAGE_KEY = 'lazis-pln-kami-peduli-content'
export const KAMI_PEDULI_UPDATED_EVENT = 'kami-peduli-content-updated'

export const DEFAULT_KAMI_PEDULI_CONTENT = {
  hero: {
    label: 'Selamat datang di Lembaga Zakat dan Shadaqah PT PLN Batam',
    // Baris baru (\n) dirender jadi ganti baris di judul.
    titleBefore: 'Bergabunglah Bersama\nkami dalam Misi',
    titleHighlight: 'Kebaikan',
    description:
      'Kami berkomitmen untuk menyalurkan kebaikan bagi yang membutuhkan melalui program-program sosial transparan dan terpercaya.',
    ctaZakat: 'Tunaikan Zakat',
    ctaJelajahi: 'Jelajahi Kami',
    ctaInfaq: 'Infaq / Shodaqoh',
  },
  programHeading: {
    label: 'Bukti Nyata',
    titleMain: 'Program yang',
    titleHighlight: 'Tersalurkan',
    buttonLabel: 'Lihat Semua Video',
  },
  // Teks "Selengkapnya" di tiap video card — satu nilai, dipakai bersama.
  selengkapnyaLabel: 'Selengkapnya',
  // videoUrl / date / duration bersifat opsional. Kalau kosong, tampilan
  // publik persis seperti semula (tidak ada yang berubah). Diisi & dikelola
  // lewat halaman admin /admin/dokumentasi.
  videos: [
    {
      id: 'bantuan-panti-asuhan',
      image: '/images/program-1.png',
      badge: 'Donasi',
      title: 'Penyaluran Bantuan ke Panti Asuhan',
      desc: 'Bantuan kebutuhan pokok dan pendidikan untuk anak-anak di panti asuhan se-Kota Batam.',
      videoUrl: '',
      date: '',
      duration: '',
    },
    {
      id: 'beasiswa-anak-dhuafa',
      image: '/images/program-2.png',
      badge: 'Pendidikan',
      title: 'Beasiswa Pendidikan Anak Dhuafa',
      desc: 'Program beasiswa untuk anak-anak kurang mampu agar tetap bisa melanjutkan pendidikan.',
      videoUrl: '',
      date: '',
      duration: '',
    },
    {
      id: 'buka-puasa-bersama',
      image: '/images/program-3.png',
      badge: 'Ramadhan',
      title: 'Program Buka Puasa Bersama',
      desc: 'Penyaluran paket buka puasa untuk masyarakat kurang mampu selama bulan Ramadhan.',
      videoUrl: '',
      date: '',
      duration: '',
    },
    {
      id: 'baksos-kesehatan',
      image: '/images/program-4.png',
      badge: 'Kesehatan',
      title: 'Bakti Sosial Kesehatan Gratis',
      desc: 'Pemeriksaan kesehatan gratis dan pembagian obat-obatan untuk masyarakat yang membutuhkan.',
      videoUrl: '',
      date: '',
      duration: '',
    },
  ],
  galeriHeading: {
    label: 'Dokumentasi',
    titleMain: 'Galeri',
    titleHighlight: 'Penyaluran',
  },
  galeri: [
    { id: 'galeri-1', image: '/images/program-1.png', caption: 'Bantuan untuk Panti Asuhan' },
    { id: 'galeri-2', image: '/images/program-2.png', caption: 'Beasiswa Anak Dhuafa' },
    { id: 'galeri-3', image: '/images/program-3.png', caption: 'Paket Buka Puasa Bersama' },
    { id: 'galeri-4', image: '/images/program-4.png', caption: 'Baksos Kesehatan Gratis' },
    { id: 'galeri-5', image: '/images/1.jpeg', caption: 'Edukasi Zakat untuk Karyawan' },
    { id: 'galeri-6', image: '/images/2.jpg', caption: 'Penyaluran Zakat Triwulan' },
  ],
}

// Gabung data tersimpan dengan DEFAULT supaya field baru yang belum pernah
// disimpan tetap terisi (dan data lama tidak bikin error).
function mergeWithDefault(saved) {
  if (!saved || typeof saved !== 'object') return DEFAULT_KAMI_PEDULI_CONTENT

  const pickList = (savedList, defaultList) => {
    if (!Array.isArray(savedList)) return defaultList
    // Data tersimpan yang menentukan isi & urutan list (mendukung tambah,
    // hapus, ubah urutan oleh admin). Entri default cuma jadi cadangan
    // nilai field untuk item bawaan yang belum semua field-nya disimpan.
    return savedList
      .filter((s) => s && typeof s === 'object' && s.id)
      .map((s) => {
        const base = defaultList.find((d) => d.id === s.id)
        return base ? { ...base, ...s } : s
      })
  }

  return {
    hero: { ...DEFAULT_KAMI_PEDULI_CONTENT.hero, ...(saved.hero || {}) },
    programHeading: { ...DEFAULT_KAMI_PEDULI_CONTENT.programHeading, ...(saved.programHeading || {}) },
    selengkapnyaLabel:
      typeof saved.selengkapnyaLabel === 'string'
        ? saved.selengkapnyaLabel
        : DEFAULT_KAMI_PEDULI_CONTENT.selengkapnyaLabel,
    videos: pickList(saved.videos, DEFAULT_KAMI_PEDULI_CONTENT.videos),
    galeriHeading: { ...DEFAULT_KAMI_PEDULI_CONTENT.galeriHeading, ...(saved.galeriHeading || {}) },
    galeri: pickList(saved.galeri, DEFAULT_KAMI_PEDULI_CONTENT.galeri),
  }
}

export function getKamiPeduliContent() {
  if (typeof window === 'undefined') return DEFAULT_KAMI_PEDULI_CONTENT

  try {
    const saved = window.localStorage.getItem(KAMI_PEDULI_STORAGE_KEY)
    if (!saved) return DEFAULT_KAMI_PEDULI_CONTENT
    return mergeWithDefault(JSON.parse(saved))
  } catch {
    return DEFAULT_KAMI_PEDULI_CONTENT
  }
}

export function saveKamiPeduliContent(content) {
  if (typeof window === 'undefined') return
  // TODO(backend): kirim ke API di sini begitu server tersedia.
  window.localStorage.setItem(KAMI_PEDULI_STORAGE_KEY, JSON.stringify(content))
  window.dispatchEvent(new Event(KAMI_PEDULI_UPDATED_EVENT))
}
