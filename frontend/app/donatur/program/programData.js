// Data program donasi. Dipisah dari komponen halaman (mengikuti pola
// blogData.js) supaya bisa dipakai bersama oleh halaman daftar program
// dan halaman detail program (app/donatur/program/[id]/page.js).

// Warna kartu program. Backend cuma menyimpan satu kata kunci `theme`
// (green|amber|indigo|emerald); kelas Tailwind-nya di-expand di sini
// lewat expandProgram() supaya class string tetap statis (aman untuk
// Tailwind JIT).
export const PROGRAM_THEMES = {
  green: {
    label: 'Hijau',
    blockBg: 'bg-green-50', badgeBg: 'bg-green-100', badgeText: 'text-green-700',
    barColor: 'bg-green-700', percentText: 'text-green-700',
    buttonBg: 'bg-green-100', buttonText: 'text-green-700', buttonHover: 'hover:bg-green-200',
  },
  amber: {
    label: 'Kuning',
    blockBg: 'bg-amber-50', badgeBg: 'bg-amber-100', badgeText: 'text-amber-700',
    barColor: 'bg-amber-600', percentText: 'text-amber-700',
    buttonBg: 'bg-amber-100', buttonText: 'text-amber-700', buttonHover: 'hover:bg-amber-200',
  },
  indigo: {
    label: 'Ungu',
    blockBg: 'bg-indigo-50', badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-700',
    barColor: 'bg-indigo-700', percentText: 'text-indigo-700',
    buttonBg: 'bg-indigo-100', buttonText: 'text-indigo-700', buttonHover: 'hover:bg-indigo-200',
  },
  emerald: {
    label: 'Hijau Toska',
    blockBg: 'bg-emerald-50', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700',
    barColor: 'bg-emerald-700', percentText: 'text-emerald-700',
    buttonBg: 'bg-emerald-100', buttonText: 'text-emerald-700', buttonHover: 'hover:bg-emerald-200',
  },
}

// Cari kata kunci theme dari kartu lama yang class-nya sudah ter-expand.
export function themeKeyOf(program) {
  if (program?.theme && PROGRAM_THEMES[program.theme]) return program.theme
  const hit = Object.keys(PROGRAM_THEMES).find((k) => PROGRAM_THEMES[k].badgeBg === program?.badgeBg)
  return hit || 'green'
}

// Lengkapi program dari API (punya `theme`, belum punya class warna) dengan
// kelas Tailwind-nya. Program lama yang sudah lengkap dibiarkan apa adanya.
export function expandProgram(p) {
  if (!p) return p
  // Fallback offline (PROGRAMS) memakai `id` sebagai slug.
  const base = p.slug ? p : { ...p, slug: p.id }
  if (base.blockBg && base.buttonHover) return base
  const t = PROGRAM_THEMES[base.theme] || PROGRAM_THEMES.green
  const { label, ...classes } = t
  return { ...base, ...classes, theme: PROGRAM_THEMES[base.theme] ? base.theme : 'green' }
}

export const PROGRAMS = [
  {
    id: 'zakat-profesi-karyawan',
    jenisId: 'zakat-profesi',
    badge: 'Zakat Profesi',
    icon: '⚡',
    title: 'Zakat Profesi Karyawan',
    desc: 'Pemotongan zakat penghasilan 2,5% dari gaji karyawan PLN Batam yang telah mencapai nisab.',
    harapan:
      'Menjadi harapan bersama bagi seluruh karyawan PLN Batam agar zakat penghasilan dapat ditunaikan secara rutin, mudah, dan tepat waktu setiap bulan, tanpa mengurangi keberkahan rezeki yang diterima.',
    deskripsiLengkap: [
      'Program Zakat Profesi Karyawan memfasilitasi karyawan PLN Batam yang penghasilannya telah mencapai nisab untuk menunaikan zakat sebesar 2,5% langsung melalui pemotongan gaji bulanan.',
      'Dengan sistem ini, karyawan tidak perlu menghitung dan menyetorkan zakat secara manual setiap bulan — seluruh proses dikelola oleh LAZIS PLN Batam secara amanah dan sesuai syariat.',
      'Dana yang terkumpul kemudian disalurkan kepada delapan golongan mustahik (asnaf) yang berhak menerima zakat, dengan prioritas pada fakir miskin, anak yatim, dan masyarakat prasejahtera di sekitar wilayah operasional PLN Batam.',
    ],
    manfaat: [
      'Meringankan beban ekonomi mustahik melalui bantuan tunai dan program pemberdayaan rutin.',
      'Membantu pemerataan kesejahteraan masyarakat di sekitar wilayah operasional PLN Batam.',
      'Menumbuhkan budaya berzakat yang konsisten di kalangan karyawan setiap bulannya.',
      'Memberi rasa aman bagi keluarga mustahik melalui penyaluran yang terjadwal dan transparan.',
    ],
    collected: 2100000,
    target: 3000000,
    donors: 874,
    blockBg: 'bg-green-50',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    barColor: 'bg-green-700',
    percentText: 'text-green-700',
    buttonBg: 'bg-green-100',
    buttonText: 'text-green-700',
    buttonHover: 'hover:bg-green-200',
  },
  {
    id: 'bedah-rumah-dhuafa',
    jenisId: 'shadaqah',
    badge: 'Shadaqah',
    icon: '🏠',
    title: 'Bedah Rumah Dhuafa',
    desc: 'Renovasi hunian tidak layak bagi keluarga prasejahtera di sekitar wilayah operasional PLN Batam.',
    harapan:
      'Menjadi harapan bersama bagi keluarga prasejahtera untuk memiliki tempat tinggal yang layak, aman, dan sehat bagi seluruh anggota keluarganya.',
    deskripsiLengkap: [
      'Program Bedah Rumah Dhuafa hadir untuk merenovasi rumah-rumah tidak layak huni milik keluarga prasejahtera di sekitar wilayah operasional PLN Batam.',
      'Setiap rumah yang menjadi sasaran program dinilai berdasarkan kondisi struktur bangunan, kelayakan sanitasi, dan tingkat kebutuhan ekonomi keluarga penghuninya.',
      'Proses renovasi melibatkan tim LAZIS PLN Batam bersama relawan setempat, mulai dari perbaikan atap dan dinding hingga penyediaan fasilitas sanitasi yang layak.',
    ],
    manfaat: [
      'Menyediakan tempat tinggal yang lebih layak, aman, dan sehat bagi keluarga penerima manfaat.',
      'Mengurangi risiko kesehatan akibat kondisi rumah yang tidak layak huni.',
      'Meningkatkan rasa aman dan kualitas hidup keluarga prasejahtera.',
      'Menghadirkan kepedulian nyata dari karyawan PLN Batam kepada masyarakat sekitar.',
    ],
    collected: 1300000,
    target: 2000000,
    donors: 312,
    blockBg: 'bg-amber-50',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    barColor: 'bg-amber-600',
    percentText: 'text-amber-700',
    buttonBg: 'bg-amber-100',
    buttonText: 'text-amber-700',
    buttonHover: 'hover:bg-amber-200',
  },
  {
    id: 'beasiswa-anak-yatim',
    jenisId: 'infaq',
    badge: 'Infaq',
    icon: '📚',
    title: 'Beasiswa Anak Yatim',
    desc: 'Dukungan pendidikan bagi anak-anak yatim dan kurang mampu di Batam, Belakang Padang, dan sekitarnya.',
    harapan:
      'Menjadi harapan bersama agar anak-anak yatim dan kurang mampu tetap dapat melanjutkan pendidikan tanpa terhambat oleh keterbatasan biaya.',
    deskripsiLengkap: [
      'Program Beasiswa Anak Yatim menyalurkan bantuan biaya pendidikan bagi anak-anak yatim dan dhuafa di Batam, Belakang Padang, dan wilayah Kepulauan Riau lainnya.',
      'Bantuan yang diberikan mencakup biaya sekolah, perlengkapan belajar, hingga pendampingan agar anak-anak penerima manfaat tetap semangat menempuh pendidikan.',
      'Seleksi penerima beasiswa dilakukan melalui verifikasi data langsung ke lapangan, bekerja sama dengan sekolah dan panti asuhan mitra LAZIS PLN Batam.',
    ],
    manfaat: [
      'Membuka akses pendidikan yang layak bagi anak yatim dan kurang mampu.',
      'Mengurangi angka putus sekolah akibat keterbatasan biaya pendidikan.',
      'Membentuk generasi muda yang berdaya dan mandiri di masa depan.',
      'Memberi harapan dan semangat baru bagi anak-anak penerima manfaat.',
    ],
    collected: 640000,
    target: 1000000,
    donors: 528,
    blockBg: 'bg-indigo-50',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-700',
    barColor: 'bg-indigo-700',
    percentText: 'text-indigo-700',
    buttonBg: 'bg-indigo-100',
    buttonText: 'text-indigo-700',
    buttonHover: 'hover:bg-indigo-200',
  },
  {
    id: 'air-bersih-pulau-terpencil',
    jenisId: 'wakaf',
    badge: 'Shadaqah Jariyah',
    icon: '💧',
    title: 'Air Bersih Pulau Terpencil',
    desc: 'Penyediaan akses air bersih bagi masyarakat pulau-pulau kecil di Kepulauan Riau yang belum terjangkau.',
    harapan:
      'Menjadi harapan bersama bagi masyarakat di pulau-pulau kecil Kepulauan Riau untuk mendapatkan akses air bersih yang layak dan berkelanjutan.',
    deskripsiLengkap: [
      'Program Air Bersih Pulau Terpencil membangun sarana penampungan dan penyaluran air bersih di pulau-pulau kecil Kepulauan Riau yang belum terjangkau layanan air bersih memadai.',
      'Sebagai bentuk shadaqah jariyah, fasilitas yang dibangun dirancang agar dapat terus dimanfaatkan masyarakat setempat dalam jangka panjang, dengan pengelolaan bersama warga sekitar.',
      'LAZIS PLN Batam bekerja sama dengan tokoh masyarakat setempat untuk memastikan lokasi dan desain fasilitas air bersih sesuai kebutuhan warga.',
    ],
    manfaat: [
      'Menyediakan akses air bersih yang layak bagi masyarakat pulau terpencil.',
      'Mengurangi risiko penyakit akibat penggunaan air yang tidak layak konsumsi.',
      'Memberikan manfaat jangka panjang sebagai shadaqah jariyah bagi donatur.',
      'Mendukung kemandirian masyarakat pulau kecil dalam memenuhi kebutuhan dasar air bersih.',
    ],
    collected: 540000,
    target: 1000000,
    donors: 196,
    blockBg: 'bg-emerald-50',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    barColor: 'bg-emerald-700',
    percentText: 'text-emerald-700',
    buttonBg: 'bg-emerald-100',
    buttonText: 'text-emerald-700',
    buttonHover: 'hover:bg-emerald-200',
  },
]
