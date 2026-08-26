// Catatan: nama & jabatan di bawah ini masih data contoh (placeholder) —
// ganti TEAM dengan nama lengkap dan jabatan anggota tim LAZIS PLN Batam
// yang sebenarnya, beserta foto pada properti `photo` jika sudah tersedia.
const TEAM = [
  { name: 'Nama Lengkap', role: 'Ketua LAZIS PLN Batam' },
  { name: 'Nama Lengkap', role: 'Sekretaris' },
  { name: 'Nama Lengkap', role: 'Bendahara' },
  { name: 'Nama Lengkap', role: 'Koordinator Program' },
]

function AvatarPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.76-3.58-5-8-5z" />
    </svg>
  )
}

export default function TimSection() {
  return (
    <section className="bg-white py-12">
      <div className="container">
        <div className="mb-6 text-center">
          <p className="section-label !justify-center !text-xs">Kenali Tim Kami</p>
          <h2 className="section-title !text-xl">
            Tim yang <span>Berdedikasi</span>
          </h2>
          <p className="mx-auto mt-2 max-w-[480px] text-xs leading-relaxed text-gray-500">
            Kenali tim kami yang berdedikasi dalam memberikan layanan zakat, infaq, dan shadaqah yang amanah bagi
            karyawan PLN Batam dan masyarakat yang membutuhkan.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
          {TEAM.map((member) => (
            <div key={`${member.name}-${member.role}`} className="card p-4 text-center">
              <div className="mx-auto mb-2.5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:h-6 [&_svg]:w-6">
                <AvatarPlaceholder />
              </div>
              <h3 className="mb-0.5 font-heading text-sm font-bold text-navy">{member.name}</h3>
              <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
