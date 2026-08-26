const VALUES = [
  {
    title: 'Amanah',
    desc: 'Mengelola setiap dana zakat, infaq, dan shadaqah dengan penuh tanggung jawab sesuai syariat dan kepercayaan donatur.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Transparan',
    desc: 'Menyampaikan laporan penyaluran secara terbuka dan dapat dipertanggungjawabkan kepada seluruh donatur.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Profesional',
    desc: 'Bekerja dengan standar layanan yang rapi, terukur, dan mengikuti tata kelola lembaga amil zakat yang baik.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
      </svg>
    ),
  },
  {
    title: 'Peduli',
    desc: 'Hadir dan berpihak kepada mustahik dengan empati, agar bantuan yang disalurkan benar-benar tepat sasaran.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
]

export default function NilaiSection() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container">
        <div className="mb-6">
          <p className="section-label !mb-1 !text-xs">Prinsip Kerja</p>
          <h2 className="section-title !text-xl">
            Nilai-Nilai <span>Kami</span>
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
          {VALUES.map((v) => (
            <div key={v.title} className="card p-4">
              <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:h-[18px] [&_svg]:w-[18px]">
                {v.icon}
              </div>
              <h3 className="mb-1.5 font-heading text-sm font-bold text-navy">{v.title}</h3>
              <p className="text-xs leading-relaxed text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
