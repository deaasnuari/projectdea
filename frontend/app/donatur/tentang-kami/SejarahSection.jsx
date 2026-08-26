// Catatan: milestone di bawah ini masih narasi umum (placeholder) karena
// belum ada tahun/detail sejarah resmi yang diberikan — ganti isi MILESTONES
// dengan sejarah asli LAZIS PLN Batam kapan pun datanya sudah tersedia.
const MILESTONES = [
  {
    label: 'Awal Berdiri',
    desc: 'LAZIS PLN Batam dibentuk sebagai unit pengelola zakat internal untuk memudahkan karyawan PLN Batam menunaikan zakat, infaq, dan shadaqah secara amanah.',
  },
  {
    label: 'Perluasan Program',
    desc: 'Program penyaluran diperluas ke berbagai bidang — pendidikan, kesehatan, dan bantuan sosial — agar manfaatnya menjangkau lebih banyak mustahik di Kepulauan Riau.',
  },
  {
    label: 'Digitalisasi Layanan',
    desc: 'Layanan donasi dan pelaporan mulai dikembangkan secara digital agar donatur dapat berdonasi dan memantau penyaluran dengan lebih mudah dan transparan.',
  },
  {
    label: 'Hari Ini',
    desc: 'LAZIS PLN Batam terus berkomitmen menghimpun dan menyalurkan dana zakat secara profesional, transparan, dan tepat sasaran bagi masyarakat yang membutuhkan.',
  },
]

export default function SejarahSection() {
  return (
    <section className="bg-white py-12">
      <div className="container">
        <div className="mb-6">
          <p className="section-label !mb-1 !text-xs">Perjalanan Kami</p>
          <h2 className="section-title !text-xl">
            Sejarah <span>Kami</span>
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
          {MILESTONES.map((m) => (
            <div key={m.label} className="relative border-t-2 border-gold pt-3">
              <h3 className="mb-1.5 font-heading text-xs font-bold uppercase tracking-[0.05em] text-primary">
                {m.label}
              </h3>
              <p className="text-xs leading-relaxed text-gray-500">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
