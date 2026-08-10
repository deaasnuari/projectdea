import Link from 'next/link'

// Route structure placeholder — the admin dashboard itself hasn't been built
// yet. This exists so /admin resolves to something intentional instead of a
// blank page or a 404.
export default function AdminPlaceholder() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy px-6 text-center text-white">
      <span className="text-xs font-semibold uppercase tracking-[2px] text-gold">Lazis PLN Batam</span>
      <h1 className="font-heading text-3xl font-extrabold">Panel Admin Segera Hadir</h1>
      <p className="max-w-md text-white/70">
        Halaman ini masih dalam pengembangan. Silakan kembali ke beranda untuk sementara.
      </p>
      <Link href="/" className="btn btn-gold mt-2">
        Kembali ke Beranda
      </Link>
    </main>
  )
}
