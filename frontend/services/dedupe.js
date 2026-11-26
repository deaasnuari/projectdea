// Beberapa komponen di satu halaman memakai data yang sama. Request yang diminta
// pada saat yang sama (satu putaran efek / satu event) digabung jadi satu.
// Sengaja hanya selama satu putaran: permintaan berikutnya (mis. setelah admin
// menyimpan) selalu mengambil data baru, jadi tidak ada data basi.
const pending = new Map()

export function dedupe(key, run) {
  let request = pending.get(key)
  if (!request) {
    request = run()
    pending.set(key, request)
    setTimeout(() => pending.delete(key), 0)
  }
  return request
}
