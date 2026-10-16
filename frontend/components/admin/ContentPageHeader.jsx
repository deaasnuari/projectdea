// Kepala halaman "Konten …" di panel admin: judul + 4 langkah alur edit yang
// sama di semua halaman konten (Edit → Ubah → Simpan → Terbitkan), supaya
// admin langsung paham urutannya dan bedanya "draf" vs "tampil ke publik".
const STEPS = [
  {
    title: 'Edit Konten',
    desc: 'Klik tombol Edit Konten di bar pratinjau untuk membuka mode edit.',
    tone: 'bg-primary text-white',
  },
  {
    title: 'Ubah di pratinjau',
    desc: 'Klik ✏️ untuk mengubah teks & gambar. Tarik teks, tombol, atau kartu untuk menata letak.',
    tone: 'bg-navy text-white',
  },
  {
    title: 'Simpan Semua',
    desc: 'Perubahan tersimpan sebagai draf — belum tampil ke publik.',
    tone: 'bg-gold text-navy',
  },
  {
    title: 'Selesai Edit',
    desc: 'Menerbitkan draf ke halaman donatur. Sebelum ini pengunjung belum melihat perubahan.',
    tone: 'bg-green-600 text-white',
  },
]

// `title`  : nama halaman (mis. Kami Peduli)
// `note`   : catatan khusus halaman ini (mis. "Video & galeri diatur di menu Dokumentasi")
export default function ContentPageHeader({ title, note }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
      <h1 className="font-heading text-xl font-bold text-navy">Konten &quot;{title}&quot;</h1>
      <p className="mt-1 max-w-2xl text-[13px] text-gray-500">
        Edit langsung pada pratinjau halaman di bawah. Satu konten dipakai di Desktop, Tablet &amp; HP —
        tampilan tablet &amp; HP menyesuaikan otomatis.
      </p>

      <ol className="mt-4 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
        {STEPS.map((s, i) => (
          <li key={s.title} className="card flex items-start gap-3 p-3.5">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${s.tone}`}
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-navy">{s.title}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-gray-500">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      {note && (
        <p className="mt-3 flex max-w-3xl items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-[12px] leading-snug text-primary-dark">
          <span aria-hidden="true">ℹ️</span>
          <span>{note}</span>
        </p>
      )}
    </div>
  )
}
