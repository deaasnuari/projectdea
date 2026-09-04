'use client'

import { usePageTypography, typographyVars } from '@/services/pageTypography'

// Membungkus section-section halaman "Kami Peduli" dengan pengaturan
// tipografi (jenis & ukuran font) yang diatur admin di
// /admin/konten-kami-peduli. Nilai bawaan = tampilan asli situs.
export default function KamiPeduliTypography({ children, className = '' }) {
  const { typo } = usePageTypography()
  return (
    <div className={`kp-typography ${className}`} style={typographyVars(typo)}>
      {children}
    </div>
  )
}
