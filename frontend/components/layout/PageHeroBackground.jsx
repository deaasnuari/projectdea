// Ini adalah pengulangan dari background hero di halaman utama — gambar
// masjid, gradasi warna teal/navy, dan pola geometris samar — dipakai
// sebagai background penuh untuk halaman-halaman lain (teks header dan
// kontennya sama-sama diletakkan di atasnya), supaya tampilan khas ini
// terasa konsisten di seluruh halaman, bukan cuma strip header lalu
// tiba-tiba berubah putih polos.
export default function PageHeroBackground({ children, className = '' }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-bg.png" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,46,60,0.92)] via-[rgba(10,126,126,0.75)] to-[rgba(10,46,60,0.85)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
          <defs>
            <pattern id="page-hero-lattice" width="72" height="72" patternUnits="userSpaceOnUse">
              <path
                d="M36 2 L44 20 L64 12 L52 30 L70 36 L52 42 L64 60 L44 52 L36 70 L28 52 L8 60 L20 42 L2 36 L20 30 L8 12 L28 20 Z"
                fill="none"
                stroke="#fff"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#page-hero-lattice)" />
        </svg>
      </div>

      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
