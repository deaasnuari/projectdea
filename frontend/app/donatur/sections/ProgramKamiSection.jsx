const PROGRAMS = [
  {
    image: '/images/program-1.png',
    badge: 'Donasi',
    title: 'Penyaluran Bantuan ke Panti Asuhan',
    desc: 'Bantuan kebutuhan pokok dan pendidikan untuk anak-anak di panti asuhan se-Kota Batam.',
  },
  {
    image: '/images/program-2.png',
    badge: 'Pendidikan',
    title: 'Beasiswa Pendidikan Anak Dhuafa',
    desc: 'Program beasiswa untuk anak-anak kurang mampu agar tetap bisa melanjutkan pendidikan.',
  },
  {
    image: '/images/program-3.png',
    badge: 'Ramadhan',
    title: 'Program Buka Puasa Bersama',
    desc: 'Penyaluran paket buka puasa untuk masyarakat kurang mampu selama bulan Ramadhan.',
  },
  {
    image: '/images/program-4.png',
    badge: 'Kesehatan',
    title: 'Bakti Sosial Kesehatan Gratis',
    desc: 'Pemeriksaan kesehatan gratis dan pembagian obat-obatan untuk masyarakat yang membutuhkan.',
  },
]

export default function ProgramKamiSection() {
  return (
    <section id="programs" className="bg-gray-50 py-24">
      <div className="container">
        {/* Judul bagian */}
        <div className="mb-12 flex items-end justify-between gap-6 max-[768px]:flex-col max-[768px]:items-start">
          <div>
            <p className="section-label">Bukti Nyata</p>
            <h2 className="section-title">
              Program yang <span>Tersalurkan</span>
            </h2>
          </div>
          <a href="#" className="btn btn-coral shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M8 5v14l11-7z" />
            </svg>
            Lihat Semua Video
          </a>
        </div>

        {/* Grid video */}
        <div className="grid grid-cols-2 gap-8 max-[768px]:grid-cols-1">
          {PROGRAMS.map((program, i) => (
            <div
              key={program.title}
              className="card group animate-fade-in-up opacity-0"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-[1.08]"
                />
                <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-coral shadow-[0_4px_20px_rgba(231,76,60,0.4)] transition-all group-hover:scale-[1.15]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="ml-[3px] h-6 w-6 text-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  {program.badge}
                </span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-heading text-lg font-bold leading-[1.3] text-navy">{program.title}</h3>
                <p className="mb-4 text-sm leading-[1.6] text-gray-500">{program.desc}</p>
                <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2 hover:text-primary-dark">
                  Selengkapnya
                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
