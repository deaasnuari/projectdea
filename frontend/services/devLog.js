// Log untuk pengembangan saja. Di build production `process.env.NODE_ENV`
// diganti "production" saat build, sehingga isi fungsi ini tidak pernah jalan
// dan tidak ada yang tercetak ke Console pengunjung. Jangan pernah mengirim
// token, data pengguna, atau respons API mentah ke sini.
export function devWarn(...args) {
  if (process.env.NODE_ENV !== 'production') console.warn(...args)
}
