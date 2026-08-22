'use client'

import Link from 'next/link'
import { Field, inputClass } from '@/components/auth/AuthCard'

const UNIT_KERJA = ['Teknik', 'Niaga', 'Keuangan', 'SDM & Umum', 'Perencanaan', 'K3L']

export default function RegisterForm() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: sambungkan ke API auth kalau backend-nya sudah siap
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Nama Lengkap" icon="user">
        <input type="text" required placeholder="cth: Ahmad Fauzi" className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
        <Field label="NIK Karyawan" icon="hash">
          <input type="text" required placeholder="cth: 8201234567" className={inputClass} />
        </Field>
        <Field label="Unit Kerja" icon="briefcase">
          <select required defaultValue="" className={`${inputClass} appearance-none pr-8`}>
            <option value="" disabled>
              Pilih unit...
            </option>
            {UNIT_KERJA.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            width="12"
            height="12"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Field>
      </div>

      <Field label="Email" icon="mail">
        <input type="email" required placeholder="email@plnbatam.com" className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
        <Field label="Password" icon="lock">
          <input type="password" required minLength={6} placeholder="Min. 6 karakter" className={inputClass} />
        </Field>
        <Field label="Konfirmasi Password" icon="lock">
          <input type="password" required placeholder="Ulangi password" className={inputClass} />
        </Field>
      </div>

      <p className="auth-banner flex items-start gap-1.5 rounded-lg bg-primary/[0.07] text-[10px] leading-[1.4] text-primary-dark">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          width="13"
          height="13"
          className="auth-banner-icon mt-0.5 shrink-0"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
        Pendaftaran hanya untuk karyawan aktif PT PLN Batam. Data akan diverifikasi oleh admin sebelum akun diaktifkan.
      </p>

      <button type="submit" className="btn btn-primary w-full justify-center py-2 text-xs">
        Daftar Sekarang
      </button>

      <p className="auth-footer-link mt-5 text-center text-xs text-gray-500">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
          Masuk di sini
        </Link>
      </p>
    </form>
  )
}
