// Data awal bagian "Kami Peduli" (Hero + section "programs"). Dipakai
// sebagai fallback kalau API belum bisa dihubungi. Sumber kebenaran ada di
// backend (key: "kami-peduli"), diakses lewat useKamiPeduliContent().

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
  },
  // Tiga kartu fitur di bawah hero. `id` tetap (kalkulator|konsultasi|program)
  // — ikon & tautannya di-hardcode di HeroSection; teksnya bisa diedit admin.
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
