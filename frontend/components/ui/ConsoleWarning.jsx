'use client'

import { useEffect } from 'react'

// Peringatan keamanan di Console browser (muncul saat pengunjung membuka
// Inspect → Console): melawan penipuan "self-XSS", yaitu pengguna disuruh
// menempel kode ke Console oleh orang tak dikenal untuk mencuri sesi/akun.
export default function ConsoleWarning() {
  useEffect(() => {
    if (window.__lazisConsoleWarned) return // sekali per muat halaman penuh
    window.__lazisConsoleWarned = true
    const big = 'color:#c0392b;font-size:34px;font-weight:800;text-shadow:1px 1px 0 #fff'
    const mid = 'color:#0a2e3c;font-size:15px;font-weight:600;line-height:1.6'
    const small = 'color:#62707b;font-size:12px'
    console.log('%cBERHENTI!', big)
    console.log(
      '%cIni fitur browser untuk pengembang. Jika ada yang menyuruhmu menyalin dan menempel sesuatu di sini (mis. "untuk mendapatkan donasi/hadiah" atau "membuka akun admin"), itu PENIPUAN dan bisa memberi mereka akses ke akunmu.',
      mid,
    )
    console.log('%cLazis PLN Batam tidak pernah meminta kamu menjalankan kode di Console. Jangan pernah membagikan kata sandi, kode verifikasi, atau cookie sesi kepada siapa pun.', small)
    console.log('%cAktivitas admin pada sistem ini dicatat (login, perubahan data, alamat IP).', small)
  }, [])
  return null
}
