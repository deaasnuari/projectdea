// Template halaman berbasis "bagian" (blok) untuk menu buatan admin.
// Satu halaman = daftar blok berurutan, disimpan di menu_pages.data.blocks:
//   { id, type, visible, props }
// Template (PRESET) hanyalah susunan blok awal yang sudah berisi contoh isi —
// admin tinggal mengganti, mematikan, mengurutkan, atau menambah bagian.

export const uid = () => Math.random().toString(36).slice(2, 9)

const items = (n, make) => Array.from({ length: n }, () => make())

// Definisi tiap jenis bagian: label/ikon untuk editor + props awal.
export const BLOCK_TYPES = {
  hero: {
    label: 'Banner Utama',
    icon: '🏞️',
    desc: 'Judul besar dengan latar gambar & tombol.',
    make: () => ({ eyebrow: '', title: 'Judul Halaman', subtitle: '', image: '', ctaLabel: '', ctaHref: '' }),
  },
  text: {
    label: 'Teks',
    icon: '📝',
    desc: 'Judul bagian + paragraf (bisa tebal, daftar, tautan).',
    make: () => ({ heading: '', html: '' }),
  },
  image: {
    label: 'Gambar',
    icon: '🖼️',
    desc: 'Satu gambar lebar dengan keterangan.',
    make: () => ({ src: '', caption: '' }),
  },
  features: {
    label: 'Kartu Poin',
    icon: '🧩',
    desc: '3–4 kartu berikon (keunggulan, nilai, manfaat).',
    make: () => ({
      heading: '',
      items: items(3, () => ({ icon: '✨', title: '', desc: '' })),
    }),
  },
  stats: {
    label: 'Angka / Statistik',
    icon: '📊',
    desc: 'Deretan angka besar (donatur, dana, penerima).',
    make: () => ({ items: items(3, () => ({ value: '', label: '' })) }),
  },
  steps: {
    label: 'Alur / Langkah',
    icon: '🪜',
    desc: 'Langkah bernomor, mis. cara berdonasi.',
    make: () => ({ heading: '', items: items(3, () => ({ title: '', desc: '' })) }),
  },
  gallery: {
    label: 'Galeri Foto',
    icon: '📷',
    desc: 'Kumpulan foto dokumentasi.',
    make: () => ({ heading: 'Dokumentasi', images: [] }),
  },
  faq: {
    label: 'Tanya Jawab (FAQ)',
    icon: '❓',
    desc: 'Daftar pertanyaan yang bisa dibuka-tutup.',
    make: () => ({ heading: 'Pertanyaan yang Sering Diajukan', items: items(2, () => ({ q: '', a: '' })) }),
  },
  donate: {
    label: 'Ajakan Donasi + Rekening',
    icon: '💛',
    desc: 'Tombol Donasi & daftar rekening transfer.',
    make: () => ({
      heading: 'Salurkan Kebaikan Anda',
      text: 'Setiap rupiah disalurkan langsung kepada penerima manfaat dengan laporan yang transparan.',
      buttonLabel: 'Donasi Sekarang',
      banks: [],
    }),
  },
  cta: {
    label: 'Ajakan (Tombol)',
    icon: '👉',
    desc: 'Kotak ajakan dengan satu tombol tautan.',
    make: () => ({ heading: '', text: '', buttonLabel: '', buttonHref: '' }),
  },
}

export const newBlock = (type, overrides = {}) => ({
  id: uid(),
  type,
  visible: true,
  props: { ...BLOCK_TYPES[type].make(), ...overrides },
})

const B = newBlock

// Template siap pakai. `blocks` dibuat saat dipilih (fungsi) supaya id unik.
export const PRESETS = [
  {
    key: 'profil',
    label: 'Profil Lembaga',
    tone: 'bg-primary/10 text-primary-dark',
    desc: 'Perkenalan lembaga: banner, cerita, angka pencapaian, nilai-nilai, dan ajakan.',
    build: () => [
      B('hero', {
        eyebrow: 'Tentang Kami',
        title: 'Mengenal Lazis PLN Batam',
        subtitle: 'Lembaga zakat dan shadaqah karyawan yang amanah, transparan, dan dekat dengan masyarakat.',
      }),
      B('text', {
        heading: 'Siapa Kami',
        html: '<p>Tuliskan perkenalan singkat lembaga di sini: latar belakang berdiri, tujuan, dan siapa yang dilayani.</p>',
      }),
      B('stats', {
        items: [
          { value: '1.200+', label: 'Donatur' },
          { value: 'Rp 2 M', label: 'Dana tersalurkan' },
          { value: '35', label: 'Program berjalan' },
        ],
      }),
      B('features', {
        heading: 'Nilai-Nilai Kami',
        items: [
          { icon: '🤝', title: 'Amanah', desc: 'Dana dikelola jujur dan bertanggung jawab.' },
          { icon: '🔍', title: 'Transparan', desc: 'Laporan penyaluran terbuka untuk donatur.' },
          { icon: '🌱', title: 'Berdampak', desc: 'Program dirancang menolong secara nyata.' },
        ],
      }),
      B('cta', {
        heading: 'Ingin berkolaborasi?',
        text: 'Hubungi kami untuk bertanya atau bergabung dalam kebaikan.',
        buttonLabel: 'Hubungi Kami',
        buttonHref: '/donatur/kontak-kami',
      }),
    ],
  },
  {
    key: 'program-donasi',
    label: 'Program Donasi',
    tone: 'bg-amber-100 text-amber-700',
    desc: 'Halaman program lengkap: banner, latar belakang, alur, galeri, tombol donasi & rekening, FAQ.',
    build: () => [
      B('hero', {
        eyebrow: 'Program',
        title: 'Nama Program Anda',
        subtitle: 'Satu kalimat yang menjelaskan siapa yang dibantu dan apa dampaknya.',
        ctaLabel: 'Donasi Sekarang',
        ctaHref: '#donasi',
      }),
      B('stats', {
        items: [
          { value: 'Rp 50 Jt', label: 'Target dana' },
          { value: '120', label: 'Penerima manfaat' },
          { value: '30 hari', label: 'Durasi program' },
        ],
      }),
      B('text', {
        heading: 'Latar Belakang & Tujuan',
        html: '<p>Ceritakan kebutuhan yang ingin dijawab program ini dan apa yang ingin dicapai.</p>',
      }),
      B('steps', {
        heading: 'Bagaimana Donasi Anda Disalurkan',
        items: [
          { title: 'Donasi masuk', desc: 'Dana diterima lewat rekening resmi lembaga.' },
          { title: 'Verifikasi & pengadaan', desc: 'Tim memastikan kebutuhan dan menyiapkan bantuan.' },
          { title: 'Penyaluran & laporan', desc: 'Bantuan diserahkan dan didokumentasikan.' },
        ],
      }),
      B('gallery', { heading: 'Dokumentasi' }),
      B('donate'),
      B('faq', {
        items: [
          { q: 'Apakah donasi mendapat bukti?', a: 'Ya, bukti donasi dapat diminta setelah transfer terverifikasi.' },
          { q: 'Berapa minimal donasi?', a: 'Berapa pun nominalnya sangat berarti.' },
        ],
      }),
    ],
  },
  {
    key: 'artikel',
    label: 'Artikel / Berita',
    tone: 'bg-blue-100 text-blue-700',
    desc: 'Tulisan panjang yang nyaman dibaca: banner judul, gambar utama, isi, dan ajakan di akhir.',
    build: () => [
      B('hero', { eyebrow: 'Berita', title: 'Judul Artikel', subtitle: 'Ringkasan satu kalimat tentang isi artikel.' }),
      B('image'),
      B('text', { heading: '', html: '<p>Mulai menulis isi artikel di sini…</p>' }),
      B('cta', {
        heading: 'Bagikan kebaikan',
        text: 'Terima kasih sudah membaca. Yuk dukung program-program kami.',
        buttonLabel: 'Lihat Program',
        buttonHref: '/donatur/program',
      }),
    ],
  },
  {
    key: 'kampanye',
    label: 'Landing Kampanye',
    tone: 'bg-rose-100 text-rose-700',
    desc: 'Satu halaman ajakan: banner, alasan berdonasi, langkah mudah, donasi, dan tanya jawab.',
    build: () => [
      B('hero', {
        eyebrow: 'Kampanye',
        title: 'Ayo Berbagi Kebaikan',
        subtitle: 'Ajakan singkat yang membuat orang tergerak untuk ikut serta.',
        ctaLabel: 'Ikut Berdonasi',
        ctaHref: '#donasi',
      }),
      B('features', {
        heading: 'Mengapa Berdonasi di Sini',
        items: [
          { icon: '✅', title: 'Terpercaya', desc: 'Dikelola lembaga resmi karyawan PLN Batam.' },
          { icon: '⚡', title: 'Mudah', desc: 'Cukup transfer dan kirim konfirmasi.' },
          { icon: '📣', title: 'Dilaporkan', desc: 'Hasil penyaluran dibagikan ke donatur.' },
        ],
      }),
      B('steps', {
        heading: 'Cara Berdonasi',
        items: [
          { title: 'Pilih nominal', desc: 'Tentukan jumlah donasi Anda.' },
          { title: 'Transfer', desc: 'Transfer ke salah satu rekening resmi.' },
          { title: 'Konfirmasi', desc: 'Kirim bukti agar donasi diverifikasi.' },
        ],
      }),
      B('donate'),
      B('faq'),
    ],
  },
  {
    key: 'kosong',
    label: 'Halaman Kosong',
    tone: 'bg-gray-100 text-gray-600',
    desc: 'Mulai dari banner dan satu bagian teks, tambah sendiri bagian lain sesukamu.',
    build: () => [B('hero', { title: 'Judul Halaman' }), B('text', { html: '<p>Isi halaman…</p>' })],
  },
]

export const presetByKey = (k) => PRESETS.find((p) => p.key === k)
