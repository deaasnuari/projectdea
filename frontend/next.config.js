/** @type {import('next').NextConfig} */
const nextConfig = {
  // Source map produksi — supaya Lighthouse tidak menandai "missing source maps".
  productionBrowserSourceMaps: true,
  // Izinkan dev server diakses lewat IP LAN (tes dari HP / alamat 192.168.x.x).
  // Tanpa ini Next memblokir resource dev (HMR/hydration) dari origin selain
  // localhost, sehingga halaman tampil kosong dan tidak interaktif.
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.*.*.*'],
  poweredByHeader: false, // jangan umumkan "X-Powered-By: Next.js"

  // Build production: buang SEMUA console.log/warn/info/debug dari kode klien
  // (keamanan: tidak ada informasi internal yang tampil lewat DevTools).
  // Dikecualikan hanya console.error (kegagalan penting).
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },

  // Header keamanan untuk semua halaman. CSP sengaja HANYA berisi arahan yang
  // tidak mengganggu skrip inline Next.js (tanpa script-src): anti-clickjacking
  // (frame-ancestors 'self' — pratinjau admin memakai iframe dari situs sendiri),
  // tanpa plugin/object, <base> & form hanya ke situs sendiri.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'",
          },
          ...(process.env.NODE_ENV === 'production'
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=15552000; includeSubDomains' }]
            : []),
        ],
      },
    ]
  },
}

module.exports = nextConfig
