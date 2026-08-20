export const POSTS = [
  {
    slug: 'fiqih-zakat-dasar-hukum-dan-jenisnya',
    image: '/images/program-1.png',
    badge: 'Kursus Zakat',
    date: '12 Jan 2025',
    readTime: '5 menit baca',
    title: 'Fiqih Zakat: Dasar Hukum dan Jenisnya',
    desc: 'Memahami dasar-dasar fiqih zakat, mulai dari pengertian, hukum, hingga jenis-jenis zakat yang wajib ditunaikan.',
    content: [
      'Zakat merupakan salah satu dari lima rukun Islam yang wajib ditunaikan oleh setiap muslim yang telah memenuhi syarat. Secara bahasa, zakat berarti "membersihkan" atau "menyucikan", sedangkan secara istilah zakat adalah sejumlah harta tertentu yang wajib dikeluarkan oleh seorang muslim untuk diberikan kepada golongan yang berhak menerimanya sesuai ketentuan syariat.',
      'Kewajiban zakat ditetapkan berdasarkan Al-Qur\'an, hadits, dan ijma\' ulama. Allah SWT berfirman dalam QS. At-Taubah ayat 103 yang memerintahkan untuk mengambil zakat dari harta orang-orang mukmin guna membersihkan dan menyucikan mereka.',
      'Secara umum, zakat terbagi menjadi dua jenis utama. Pertama, zakat fitrah, yaitu zakat yang wajib dikeluarkan oleh setiap individu muslim menjelang Idul Fitri sebagai bentuk penyucian diri setelah menjalankan ibadah puasa Ramadhan. Kedua, zakat maal (zakat harta), yang mencakup zakat penghasilan/profesi, zakat perniagaan, zakat emas dan perak, zakat pertanian, hingga zakat perusahaan.',
      'Bagi karyawan PLN Batam, jenis zakat yang paling relevan adalah zakat profesi, yaitu zakat yang dikenakan atas penghasilan tetap yang diperoleh dari pekerjaan, dengan kadar 2,5% setelah mencapai nisab. Memahami dasar hukum ini penting agar setiap karyawan dapat menunaikan kewajibannya dengan benar dan penuh keyakinan.',
      'Lazis PLN Batam hadir untuk memudahkan proses ini melalui program pemotongan zakat penghasilan langsung dari gaji, sehingga karyawan dapat menunaikan zakat secara rutin dan tepat waktu setiap bulannya.',
    ],
  },
  {
    slug: 'penyaluran-zakat-triwulan-iv-2024-pln-batam',
    image: '/images/program-2.png',
    badge: 'Blog',
    date: '5 Jan 2025',
    readTime: '4 menit baca',
    title: 'Penyaluran Zakat Triwulan IV 2024 PLN Batam',
    desc: 'Laporan lengkap penyaluran dana zakat, infaq, dan shadaqah karyawan PLN Batam periode Oktober–Desember 2024.',
    content: [
      'Sepanjang periode Oktober hingga Desember 2024, Lazis PLN Batam telah menyalurkan dana zakat, infaq, dan shadaqah yang dihimpun dari para karyawan PLN Batam kepada berbagai program pemberdayaan dan bantuan sosial di sekitar wilayah operasional perusahaan.',
      'Penyaluran pada triwulan ini difokuskan pada empat program utama: bantuan pendidikan berupa beasiswa bagi anak yatim dan dhuafa, program bedah rumah tidak layak huni, penyediaan akses air bersih di pulau-pulau kecil Kepulauan Riau, serta bantuan langsung tunai bagi mustahik yang terdampak kondisi ekonomi.',
      'Total dana yang tersalurkan pada periode ini mencapai lebih dari Rp1,3 miliar, dengan penerima manfaat tersebar di Batam, Belakang Padang, dan beberapa wilayah kepulauan sekitarnya. Seluruh proses penyaluran dilakukan secara transparan dan dapat dipertanggungjawabkan sesuai prinsip syariah.',
      'Lazis PLN Batam mengucapkan terima kasih kepada seluruh karyawan PLN Batam yang telah konsisten menunaikan zakat, infaq, dan shadaqah melalui program pemotongan gaji maupun donasi langsung. Kepercayaan ini menjadi amanah besar yang terus dijaga melalui laporan berkala dan audit rutin.',
      'Ke depan, Lazis PLN Batam berkomitmen untuk terus memperluas jangkauan penyaluran serta meningkatkan kualitas program pemberdayaan agar manfaatnya dapat dirasakan secara berkelanjutan oleh masyarakat yang membutuhkan.',
    ],
  },
  {
    slug: 'zakat-profesi-cara-hitung-dan-waktu-bayar',
    image: '/images/program-3.png',
    badge: 'Kursus Zakat',
    date: '28 Des 2024',
    readTime: '6 menit baca',
    title: 'Zakat Profesi: Cara Hitung dan Waktu Bayar',
    desc: 'Panduan praktis menghitung dan menunaikan zakat profesi bagi karyawan berpenghasilan tetap sesuai fatwa MUI.',
    content: [
      'Zakat profesi adalah zakat yang dikenakan atas penghasilan yang diperoleh seseorang dari pekerjaan atau keahliannya, baik sebagai karyawan, pegawai, maupun profesional lainnya. Ketentuan zakat profesi ini merujuk pada Fatwa MUI No. 3 Tahun 2003 tentang Zakat Penghasilan.',
      'Nisab zakat profesi disetarakan dengan nisab zakat pertanian, yaitu senilai 653 kg gabah atau setara 524 kg beras. Jika penghasilan seseorang dalam satu tahun (atau setara per bulan) telah mencapai nilai nisab tersebut, maka wajib dikeluarkan zakatnya sebesar 2,5%.',
      'Cara menghitungnya cukup sederhana: kalikan total penghasilan bulanan (gaji pokok ditambah tunjangan tetap) dengan 2,5%. Sebagai contoh, jika penghasilan bulanan seorang karyawan adalah Rp10.000.000 dan telah mencapai nisab, maka zakat yang wajib dikeluarkan adalah Rp250.000 per bulan.',
      'Terkait waktu pembayaran, zakat profesi dapat ditunaikan setiap kali menerima penghasilan (bulanan) atau diakumulasikan dan dibayarkan sekali dalam setahun (haul). Sebagian besar ulama kontemporer membolehkan pembayaran bulanan karena lebih memudahkan dan meringankan, sebagaimana yang diterapkan dalam program pemotongan zakat gaji karyawan PLN Batam.',
      'Dengan memahami cara hitung dan waktu pembayaran ini, karyawan PLN Batam dapat menunaikan zakat profesinya secara tertib, tepat nisab, dan tepat kadar, sehingga hartanya senantiasa bersih dan berkah.',
    ],
  },
]

export function getPostBySlug(slug) {
  return POSTS.find((post) => post.slug === slug)
}
