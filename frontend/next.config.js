/** @type {import('next').NextConfig} */
const nextConfig = {
  // Source map produksi — supaya Lighthouse tidak menandai "missing source maps".
  productionBrowserSourceMaps: true,
  // Izinkan dev server diakses lewat IP LAN (tes dari HP / alamat 192.168.x.x).
  // Tanpa ini Next memblokir resource dev (HMR/hydration) dari origin selain
  // localhost, sehingga halaman tampil kosong dan tidak interaktif.
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.*.*.*'],
}

module.exports = nextConfig
