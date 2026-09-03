// Data awal untuk seed. Sama dengan DEFAULT_* di frontend — dipakai sekali
// saat DB masih kosong. Setelah itu DB jadi sumber kebenaran.

const kamiPeduli = {
  hero: {
    label: 'Selamat datang di Lembaga Zakat dan Shadaqah PT PLN Batam',
    titleBefore: 'Bergabunglah Bersama\nkami dalam Misi',
    titleHighlight: 'Kebaikan',
    description:
      'Kami berkomitmen untuk menyalurkan kebaikan bagi yang membutuhkan melalui program-program sosial transparan dan terpercaya.',
    ctaZakat: 'Tunaikan Zakat',
    ctaJelajahi: 'Jelajahi Kami',
  },
  features: [
    {
      id: 'kalkulator',
      title: 'Kalkulator Zakat',
      desc: 'Menghitung jumlah zakat yang harus dibayarkan sesuai dengan ketentuan syariah.',
    },
    {
      id: 'konsultasi',
      title: 'Konsultasi',
      desc: 'Layanan konsultasi zakat secara online. Tanya dan pahami lebih lanjut mengenai pentingnya zakat.',
    },
    {
      id: 'program',
      title: 'Program',
      desc: 'Berbagai program zakat yang efektif dan transparan untuk membantu masyarakat yang membutuhkan.',
    },
  ],
  programHeading: {
    label: 'Bukti Nyata',
    titleMain: 'Program yang',
    titleHighlight: 'Tersalurkan',
    buttonLabel: 'Lihat Semua Video',
  },
  selengkapnyaLabel: 'Selengkapnya',
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
  galeriHeading: { label: 'Dokumentasi', titleMain: 'Galeri', titleHighlight: 'Penyaluran' },
  galeri: [
    { id: 'galeri-1', image: '/images/program-1.png', caption: 'Bantuan untuk Panti Asuhan' },
    { id: 'galeri-2', image: '/images/program-2.png', caption: 'Beasiswa Anak Dhuafa' },
    { id: 'galeri-3', image: '/images/program-3.png', caption: 'Paket Buka Puasa Bersama' },
    { id: 'galeri-4', image: '/images/program-4.png', caption: 'Baksos Kesehatan Gratis' },
    { id: 'galeri-5', image: '/images/1.jpeg', caption: 'Edukasi Zakat untuk Karyawan' },
    { id: 'galeri-6', image: '/images/2.jpg', caption: 'Penyaluran Zakat Triwulan' },
  ],
  konsultasi: {
    label: 'Konsultasi',
    titleMain: 'Pertanyaan Seputar',
    titleHighlight: 'Zakat & Shadaqah',
    description:
      'Tim Lazis PLN Batam siap membantu Anda memahami kewajiban zakat dan cara penunaiannya.',
    phone: '(0778) 469 100 ext. 1234',
    email: 'lazis@plnbatam.com',
    address: 'Gedung PLN Batam, Lt. 2, Jl. Engku Putri No. 1',
    faqs: [
      {
        id: 'faq-1',
        q: 'Siapa saja yang wajib membayar zakat profesi?',
        a: 'Seluruh karyawan PLN Batam yang penghasilan bulanannya (gaji pokok + tunjangan tetap) telah mencapai nisab zakat profesi, yaitu setara 85 gram emas per tahun.',
      },
      {
        id: 'faq-2',
        q: 'Bagaimana cara membayar zakat melalui LAZIS PLN Batam?',
        a: 'Anda dapat mendaftar sebagai donatur, menghitung kewajiban zakat melalui kalkulator di halaman ini, lalu melakukan pembayaran melalui transfer ke rekening resmi atau potong gaji otomatis.',
      },
      {
        id: 'faq-3',
        q: 'Apakah pembayaran zakat mendapat bukti setor?',
        a: 'Ya. Setiap pembayaran akan mendapatkan bukti setor zakat resmi yang dapat diunduh melalui akun donatur Anda, sekaligus berlaku sebagai pengurang pajak penghasilan.',
      },
      {
        id: 'faq-4',
        q: 'Bagaimana transparansi penyaluran dana zakat?',
        a: 'Setiap program penyaluran didokumentasikan dan dipublikasikan secara berkala, termasuk laporan triwulanan yang dapat diakses oleh seluruh donatur pada bagian Program Kami.',
      },
    ],
  },
}

const tentang = {
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
    { id: 'm1', text: 'Menghimpun zakat, infaq, dan shadaqah dari karyawan PLN Batam secara optimal dan berkelanjutan.' },
    { id: 'm2', text: 'Menyalurkan dana secara tepat sasaran, transparan, dan tepat waktu kepada mustahik.' },
    { id: 'm3', text: 'Mengelola dana sesuai syariat Islam di bawah pengawasan Dewan Syariah.' },
    { id: 'm4', text: 'Membangun program pemberdayaan yang memberi dampak jangka panjang bagi masyarakat.' },
  ],
  sejarah: { label: 'Perjalanan Kami', titleMain: 'Sejarah', titleHighlight: 'Kami' },
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
  nilai: { label: 'Prinsip Kerja', titleMain: 'Nilai-Nilai', titleHighlight: 'Kami' },
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

const kontak = {
  hero: {
    label: 'Kontak Kami',
    titleMain: 'Ada Pertanyaan?',
    titleHighlight: 'Hubungi Kami',
    description:
      'Tim LAZIS PLN Batam siap membantu seputar zakat, infaq, shadaqah, maupun kerja sama program. Silakan hubungi kami melalui kontak di bawah, atau kirim pesan langsung lewat formulir.',
  },
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

const donor = {
  title: 'Jumlah Donatur Saat Ini',
  description: 'Kepercayaan yang tumbuh dari kebaikan yang dilakukan bersama.',
  stats: [
    { value: 157, label: 'Donatur Zakat' },
    { value: 21, label: 'Donatur Infaq' },
    { value: 1, label: 'Donatur Orang Tua Asuh' },
  ],
}

const jenisDonasi = [
  { id: 'zakat-profesi', label: 'Zakat Profesi', programLabel: 'Zakat Profesi Karyawan' },
  { id: 'zakat-maal', label: 'Zakat Maal', programLabel: 'Zakat Maal' },
  { id: 'infaq', label: 'Infaq', programLabel: 'Infaq' },
  { id: 'shadaqah', label: 'Shadaqah', programLabel: 'Shadaqah' },
  { id: 'fidyah', label: 'Fidyah', programLabel: 'Fidyah' },
  { id: 'wakaf', label: 'Wakaf', programLabel: 'Wakaf' },
]
const banks = [
  { id: 'bsi', name: 'BSI (Bank Syariah Indonesia)', short: 'BSI', noRek: '7123 456 789', badgeClass: 'bg-[#00754A]' },
  { id: 'mandiri', name: 'Bank Mandiri', short: 'MDR', noRek: '109 0001 23456', badgeClass: 'bg-[#003D79]' },
  { id: 'bri', name: 'BRI', short: 'BRI', noRek: '0026 01 099999 50 9', badgeClass: 'bg-[#00529C]' },
]

// Dua scope terpisah: 'tentang' (tombol Donasi via Transfer) & 'program' (kartu program).
const donationMethods = {
  tentang: { jenis: jenisDonasi, banks },
  program: { jenis: jenisDonasi, banks },
}


const programs = [
  {
    "id": "zakat-profesi-karyawan",
    "jenisId": "zakat-profesi",
    "badge": "Zakat Profesi",
    "icon": "⚡",
    "title": "Zakat Profesi Karyawan",
    "desc": "Pemotongan zakat penghasilan 2,5% dari gaji karyawan PLN Batam yang telah mencapai nisab.",
    "harapan": "Menjadi harapan bersama bagi seluruh karyawan PLN Batam agar zakat penghasilan dapat ditunaikan secara rutin, mudah, dan tepat waktu setiap bulan, tanpa mengurangi keberkahan rezeki yang diterima.",
    "deskripsiLengkap": [
      "Program Zakat Profesi Karyawan memfasilitasi karyawan PLN Batam yang penghasilannya telah mencapai nisab untuk menunaikan zakat sebesar 2,5% langsung melalui pemotongan gaji bulanan.",
      "Dengan sistem ini, karyawan tidak perlu menghitung dan menyetorkan zakat secara manual setiap bulan — seluruh proses dikelola oleh LAZIS PLN Batam secara amanah dan sesuai syariat.",
      "Dana yang terkumpul kemudian disalurkan kepada delapan golongan mustahik (asnaf) yang berhak menerima zakat, dengan prioritas pada fakir miskin, anak yatim, dan masyarakat prasejahtera di sekitar wilayah operasional PLN Batam."
    ],
    "manfaat": [
      "Meringankan beban ekonomi mustahik melalui bantuan tunai dan program pemberdayaan rutin.",
      "Membantu pemerataan kesejahteraan masyarakat di sekitar wilayah operasional PLN Batam.",
      "Menumbuhkan budaya berzakat yang konsisten di kalangan karyawan setiap bulannya.",
      "Memberi rasa aman bagi keluarga mustahik melalui penyaluran yang terjadwal dan transparan."
    ],
    "collected": 2100000,
    "target": 3000000,
    "donors": 874,
    "blockBg": "bg-green-50",
    "badgeBg": "bg-green-100",
    "badgeText": "text-green-700",
    "barColor": "bg-green-700",
    "percentText": "text-green-700",
    "buttonBg": "bg-green-100",
    "buttonText": "text-green-700",
    "buttonHover": "hover:bg-green-200"
  },
  {
    "id": "bedah-rumah-dhuafa",
    "jenisId": "shadaqah",
    "badge": "Shadaqah",
    "icon": "🏠",
    "title": "Bedah Rumah Dhuafa",
    "desc": "Renovasi hunian tidak layak bagi keluarga prasejahtera di sekitar wilayah operasional PLN Batam.",
    "harapan": "Menjadi harapan bersama bagi keluarga prasejahtera untuk memiliki tempat tinggal yang layak, aman, dan sehat bagi seluruh anggota keluarganya.",
    "deskripsiLengkap": [
      "Program Bedah Rumah Dhuafa hadir untuk merenovasi rumah-rumah tidak layak huni milik keluarga prasejahtera di sekitar wilayah operasional PLN Batam.",
      "Setiap rumah yang menjadi sasaran program dinilai berdasarkan kondisi struktur bangunan, kelayakan sanitasi, dan tingkat kebutuhan ekonomi keluarga penghuninya.",
      "Proses renovasi melibatkan tim LAZIS PLN Batam bersama relawan setempat, mulai dari perbaikan atap dan dinding hingga penyediaan fasilitas sanitasi yang layak."
    ],
    "manfaat": [
      "Menyediakan tempat tinggal yang lebih layak, aman, dan sehat bagi keluarga penerima manfaat.",
      "Mengurangi risiko kesehatan akibat kondisi rumah yang tidak layak huni.",
      "Meningkatkan rasa aman dan kualitas hidup keluarga prasejahtera.",
      "Menghadirkan kepedulian nyata dari karyawan PLN Batam kepada masyarakat sekitar."
    ],
    "collected": 1300000,
    "target": 2000000,
    "donors": 312,
    "blockBg": "bg-amber-50",
    "badgeBg": "bg-amber-100",
    "badgeText": "text-amber-700",
    "barColor": "bg-amber-600",
    "percentText": "text-amber-700",
    "buttonBg": "bg-amber-100",
    "buttonText": "text-amber-700",
    "buttonHover": "hover:bg-amber-200"
  },
  {
    "id": "beasiswa-anak-yatim",
    "jenisId": "infaq",
    "badge": "Infaq",
    "icon": "📚",
    "title": "Beasiswa Anak Yatim",
    "desc": "Dukungan pendidikan bagi anak-anak yatim dan kurang mampu di Batam, Belakang Padang, dan sekitarnya.",
    "harapan": "Menjadi harapan bersama agar anak-anak yatim dan kurang mampu tetap dapat melanjutkan pendidikan tanpa terhambat oleh keterbatasan biaya.",
    "deskripsiLengkap": [
      "Program Beasiswa Anak Yatim menyalurkan bantuan biaya pendidikan bagi anak-anak yatim dan dhuafa di Batam, Belakang Padang, dan wilayah Kepulauan Riau lainnya.",
      "Bantuan yang diberikan mencakup biaya sekolah, perlengkapan belajar, hingga pendampingan agar anak-anak penerima manfaat tetap semangat menempuh pendidikan.",
      "Seleksi penerima beasiswa dilakukan melalui verifikasi data langsung ke lapangan, bekerja sama dengan sekolah dan panti asuhan mitra LAZIS PLN Batam."
    ],
    "manfaat": [
      "Membuka akses pendidikan yang layak bagi anak yatim dan kurang mampu.",
      "Mengurangi angka putus sekolah akibat keterbatasan biaya pendidikan.",
      "Membentuk generasi muda yang berdaya dan mandiri di masa depan.",
      "Memberi harapan dan semangat baru bagi anak-anak penerima manfaat."
    ],
    "collected": 640000,
    "target": 1000000,
    "donors": 528,
    "blockBg": "bg-indigo-50",
    "badgeBg": "bg-indigo-100",
    "badgeText": "text-indigo-700",
    "barColor": "bg-indigo-700",
    "percentText": "text-indigo-700",
    "buttonBg": "bg-indigo-100",
    "buttonText": "text-indigo-700",
    "buttonHover": "hover:bg-indigo-200"
  },
  {
    "id": "air-bersih-pulau-terpencil",
    "jenisId": "wakaf",
    "badge": "Shadaqah Jariyah",
    "icon": "💧",
    "title": "Air Bersih Pulau Terpencil",
    "desc": "Penyediaan akses air bersih bagi masyarakat pulau-pulau kecil di Kepulauan Riau yang belum terjangkau.",
    "harapan": "Menjadi harapan bersama bagi masyarakat di pulau-pulau kecil Kepulauan Riau untuk mendapatkan akses air bersih yang layak dan berkelanjutan.",
    "deskripsiLengkap": [
      "Program Air Bersih Pulau Terpencil membangun sarana penampungan dan penyaluran air bersih di pulau-pulau kecil Kepulauan Riau yang belum terjangkau layanan air bersih memadai.",
      "Sebagai bentuk shadaqah jariyah, fasilitas yang dibangun dirancang agar dapat terus dimanfaatkan masyarakat setempat dalam jangka panjang, dengan pengelolaan bersama warga sekitar.",
      "LAZIS PLN Batam bekerja sama dengan tokoh masyarakat setempat untuk memastikan lokasi dan desain fasilitas air bersih sesuai kebutuhan warga."
    ],
    "manfaat": [
      "Menyediakan akses air bersih yang layak bagi masyarakat pulau terpencil.",
      "Mengurangi risiko penyakit akibat penggunaan air yang tidak layak konsumsi.",
      "Memberikan manfaat jangka panjang sebagai shadaqah jariyah bagi donatur.",
      "Mendukung kemandirian masyarakat pulau kecil dalam memenuhi kebutuhan dasar air bersih."
    ],
    "collected": 540000,
    "target": 1000000,
    "donors": 196,
    "blockBg": "bg-emerald-50",
    "badgeBg": "bg-emerald-100",
    "badgeText": "text-emerald-700",
    "barColor": "bg-emerald-700",
    "percentText": "text-emerald-700",
    "buttonBg": "bg-emerald-100",
    "buttonText": "text-emerald-700",
    "buttonHover": "hover:bg-emerald-200"
  }
]

const blog = [
  {
    "slug": "fiqih-zakat-dasar-hukum-dan-jenisnya",
    "image": "/images/1.jpeg",
    "badge": "Kursus Zakat",
    "date": "12 Jan 2025",
    "title": "Fiqih Zakat: Dasar Hukum dan Jenisnya",
    "desc": "Memahami dasar-dasar fiqih zakat, mulai dari pengertian, hukum, hingga jenis-jenis zakat yang wajib ditunaikan.",
    "content": [
      "Zakat merupakan salah satu dari lima rukun Islam yang wajib ditunaikan oleh setiap muslim yang telah memenuhi syarat. Secara bahasa, zakat berarti \"membersihkan\" atau \"menyucikan\", sedangkan secara istilah zakat adalah sejumlah harta tertentu yang wajib dikeluarkan oleh seorang muslim untuk diberikan kepada golongan yang berhak menerimanya sesuai ketentuan syariat.",
      "Kewajiban zakat ditetapkan berdasarkan Al-Qur'an, hadits, dan ijma' ulama. Allah SWT berfirman dalam QS. At-Taubah ayat 103 yang memerintahkan untuk mengambil zakat dari harta orang-orang mukmin guna membersihkan dan menyucikan mereka.",
      "Secara umum, zakat terbagi menjadi dua jenis utama. Pertama, zakat fitrah, yaitu zakat yang wajib dikeluarkan oleh setiap individu muslim menjelang Idul Fitri sebagai bentuk penyucian diri setelah menjalankan ibadah puasa Ramadhan. Kedua, zakat maal (zakat harta), yang mencakup zakat penghasilan/profesi, zakat perniagaan, zakat emas dan perak, zakat pertanian, hingga zakat perusahaan.",
      "Bagi karyawan PLN Batam, jenis zakat yang paling relevan adalah zakat profesi, yaitu zakat yang dikenakan atas penghasilan tetap yang diperoleh dari pekerjaan, dengan kadar 2,5% setelah mencapai nisab. Memahami dasar hukum ini penting agar setiap karyawan dapat menunaikan kewajibannya dengan benar dan penuh keyakinan.",
      "Lazis PLN Batam hadir untuk memudahkan proses ini melalui program pemotongan zakat penghasilan langsung dari gaji, sehingga karyawan dapat menunaikan zakat secara rutin dan tepat waktu setiap bulannya."
    ]
  },
  {
    "slug": "penyaluran-zakat-triwulan-iv-2024-pln-batam",
    "image": "/images/2.jpg",
    "badge": "Blog",
    "date": "5 Jan 2025",
    "title": "Penyaluran Zakat Triwulan IV 2024 PLN Batam",
    "desc": "Laporan lengkap penyaluran dana zakat, infaq, dan shadaqah karyawan PLN Batam periode Oktober–Desember 2024.",
    "content": [
      "Sepanjang periode Oktober hingga Desember 2024, Lazis PLN Batam telah menyalurkan dana zakat, infaq, dan shadaqah yang dihimpun dari para karyawan PLN Batam kepada berbagai program pemberdayaan dan bantuan sosial di sekitar wilayah operasional perusahaan.",
      "Penyaluran pada triwulan ini difokuskan pada empat program utama: bantuan pendidikan berupa beasiswa bagi anak yatim dan dhuafa, program bedah rumah tidak layak huni, penyediaan akses air bersih di pulau-pulau kecil Kepulauan Riau, serta bantuan langsung tunai bagi mustahik yang terdampak kondisi ekonomi.",
      "Total dana yang tersalurkan pada periode ini mencapai lebih dari Rp1,3 miliar, dengan penerima manfaat tersebar di Batam, Belakang Padang, dan beberapa wilayah kepulauan sekitarnya. Seluruh proses penyaluran dilakukan secara transparan dan dapat dipertanggungjawabkan sesuai prinsip syariah.",
      "Lazis PLN Batam mengucapkan terima kasih kepada seluruh karyawan PLN Batam yang telah konsisten menunaikan zakat, infaq, dan shadaqah melalui program pemotongan gaji maupun donasi langsung. Kepercayaan ini menjadi amanah besar yang terus dijaga melalui laporan berkala dan audit rutin.",
      "Ke depan, Lazis PLN Batam berkomitmen untuk terus memperluas jangkauan penyaluran serta meningkatkan kualitas program pemberdayaan agar manfaatnya dapat dirasakan secara berkelanjutan oleh masyarakat yang membutuhkan."
    ]
  },
  {
    "slug": "zakat-profesi-cara-hitung-dan-waktu-bayar",
    "image": "/images/program-3.png",
    "badge": "Kursus Zakat",
    "date": "28 Des 2024",
    "title": "Zakat Profesi: Cara Hitung dan Waktu Bayar",
    "desc": "Panduan praktis menghitung dan menunaikan zakat profesi bagi karyawan berpenghasilan tetap sesuai fatwa MUI.",
    "content": [
      "Zakat profesi adalah zakat yang dikenakan atas penghasilan yang diperoleh seseorang dari pekerjaan atau keahliannya, baik sebagai karyawan, pegawai, maupun profesional lainnya. Ketentuan zakat profesi ini merujuk pada Fatwa MUI No. 3 Tahun 2003 tentang Zakat Penghasilan.",
      "Nisab zakat profesi disetarakan dengan nisab zakat pertanian, yaitu senilai 653 kg gabah atau setara 524 kg beras. Jika penghasilan seseorang dalam satu tahun (atau setara per bulan) telah mencapai nilai nisab tersebut, maka wajib dikeluarkan zakatnya sebesar 2,5%.",
      "Cara menghitungnya cukup sederhana: kalikan total penghasilan bulanan (gaji pokok ditambah tunjangan tetap) dengan 2,5%. Sebagai contoh, jika penghasilan bulanan seorang karyawan adalah Rp10.000.000 dan telah mencapai nisab, maka zakat yang wajib dikeluarkan adalah Rp250.000 per bulan.",
      "Terkait waktu pembayaran, zakat profesi dapat ditunaikan setiap kali menerima penghasilan (bulanan) atau diakumulasikan dan dibayarkan sekali dalam setahun (haul). Sebagian besar ulama kontemporer membolehkan pembayaran bulanan karena lebih memudahkan dan meringankan, sebagaimana yang diterapkan dalam program pemotongan zakat gaji karyawan PLN Batam.",
      "Dengan memahami cara hitung dan waktu pembayaran ini, karyawan PLN Batam dapat menunaikan zakat profesinya secara tertib, tepat nisab, dan tepat kadar, sehingga hartanya senantiasa bersih dan berkah."
    ]
  }
]

const tim = [
  {
    "id": "ketua",
    "name": "Nama Lengkap",
    "role": "Ketua LAZIS PLN Batam"
  },
  {
    "id": "sekretaris",
    "name": "Nama Lengkap",
    "role": "Sekretaris"
  },
  {
    "id": "bendahara",
    "name": "Nama Lengkap",
    "role": "Bendahara"
  },
  {
    "id": "koordinator-program",
    "name": "Nama Lengkap",
    "role": "Koordinator Program"
  }
]

// Catatan: seluruh konten kini punya tabel relasional/singleton sendiri
// (blog_posts, programs, bank_accounts, donation_types, team_members,
// doc_videos, doc_photos, donor_info, about_page, contact_page, home_page).
// site_content sudah tidak dipakai lagi. Objek-objek di bawah tetap diekspor
// sebagai data awal untuk seeding tabel masing-masing.
const ALL = {}

const CONTENT_KEYS = Object.keys(ALL)

module.exports = { kamiPeduli, tentang, kontak, donor, donationMethods, programs, blog, tim, ALL, CONTENT_KEYS }
