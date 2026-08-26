import Link from 'next/link'

export default function GabungMisiSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark py-10">
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden="true">
        <defs>
          <pattern id="join-mission-lattice" width="72" height="72" patternUnits="userSpaceOnUse">
            <path
              d="M36 2 L44 20 L64 12 L52 30 L70 36 L52 42 L64 60 L44 52 L36 70 L28 52 L8 60 L20 42 L2 36 L20 30 L8 12 L28 20 Z"
              fill="none"
              stroke="#fff"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#join-mission-lattice)" />
      </svg>

      <div className="container relative z-[1] text-center">
        <h2 className="mx-auto mb-2 max-w-[600px] font-heading text-lg font-bold text-white max-[600px]:text-base">
          Bergabung dalam <span className="italic text-gold">Misi Kami</span>
        </h2>
        <p className="mx-auto mb-4 max-w-[440px] text-xs leading-relaxed text-white/80">
          Setiap zakat, infaq, dan shadaqah yang kamu tunaikan bersama LAZIS PLN Batam turut menghadirkan
          kebaikan bagi mustahik di Kepulauan Riau. Ada pertanyaan? Tim kami siap membantu.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/donatur#zakat-calculator" className="btn btn-gold px-5 py-2 text-xs">
            Tunaikan Zakat
          </Link>
          <Link href="/donatur/kontak-kami" className="btn btn-outline px-5 py-2 text-xs">
            Hubungi Kami
            <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
