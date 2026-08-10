'use client'

import Link from 'next/link'
import { Field, inputClass } from '@/components/auth/AuthCard'

const UNIT_KERJA = ['Teknik', 'Niaga', 'Keuangan', 'SDM & Umum', 'Perencanaan', 'K3L']

export default function RegisterForm() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: wire up to the auth API once the backend is ready
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Nama Lengkap">
        <input type="text" required placeholder="cth: Ahmad Fauzi" className={inputClass} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="NIK Karyawan">
          <input type="text" required placeholder="cth: 8201234567" className={inputClass} />
        </Field>
        <Field label="Unit Kerja">
          <select required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Pilih unit...
            </option>
            {UNIT_KERJA.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Email">
        <input type="email" required placeholder="email@plnbatam.com" className={inputClass} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Password">
          <input type="password" required minLength={6} placeholder="Min. 6 karakter" className={inputClass} />
        </Field>
        <Field label="Konfirmasi Password">
          <input type="password" required placeholder="Ulangi password" className={inputClass} />
        </Field>
      </div>

      <p className="mb-6 flex items-start gap-2.5 rounded-lg bg-primary/[0.07] p-3.5 text-xs leading-[1.6] text-primary-dark">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          width="16"
          height="16"
          className="mt-0.5 shrink-0"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
        Pendaftaran hanya untuk karyawan aktif PT PLN Batam. Data akan diverifikasi oleh admin sebelum akun diaktifkan.
      </p>

      <button type="submit" className="btn btn-primary w-full justify-center">
        Daftar Sekarang
      </button>

      <p className="mt-5 text-center text-sm text-gray-500">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
          Masuk di sini
        </Link>
      </p>
    </form>
  )
}
