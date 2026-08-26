export default function PencapaianSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy to-primary-dark py-6">
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden="true">
        <defs>
          <pattern id="achievement-lattice" width="72" height="72" patternUnits="userSpaceOnUse">
            <path
              d="M36 2 L44 20 L64 12 L52 30 L70 36 L52 42 L64 60 L44 52 L36 70 L28 52 L8 60 L20 42 L2 36 L20 30 L8 12 L28 20 Z"
              fill="none"
              stroke="#fff"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#achievement-lattice)" />
      </svg>

      <div className="container relative z-[1] text-center">
        <p className="section-label !mb-1 !justify-center !text-[10px] !text-gold">Bukti Nyata</p>
        <h2 className="mb-2 font-heading text-base font-semibold leading-[1.15] text-white">
          Pencapaian <span className="italic text-gold">Kami</span>
        </h2>

        {/* Catatan: angka di paragraf ini masih placeholder — ganti dengan
            data pencapaian LAZIS PLN Batam yang sebenarnya. */}
        <p className="mx-auto max-w-[480px] text-[11px] leading-[1.6] text-white/80">
          Sejauh ini, LAZIS PLN Batam telah menghimpun <span className="font-bold text-gold">Rp 3.8 M</span> dana
          zakat, infaq, dan shadaqah dari <span className="font-bold text-gold">1.240+</span> donatur aktif, dan
          menyalurkannya kepada lebih dari <span className="font-bold text-gold">5.600+</span> penerima manfaat di
          Kepulauan Riau. Seluruh dana dikelola dengan{' '}
          <span className="font-bold text-gold">transparansi penuh</span> dan dapat dipertanggungjawabkan kepada
          setiap donatur.
        </p>
      </div>
    </section>
  )
}
