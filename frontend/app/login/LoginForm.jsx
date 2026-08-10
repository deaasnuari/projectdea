'use client'

import Link from 'next/link'
import { Field, inputClass } from '@/components/auth/AuthCard'

export default function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: wire up to the auth API once the backend is ready
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Username">
        <input type="text" required placeholder="Username admin" className={inputClass} />
      </Field>

      <Field label="Password">
        <input type="password" required placeholder="Password" className={inputClass} />
      </Field>

      <button type="submit" className="btn btn-primary mt-2 w-full justify-center">
        Masuk sebagai Admin
      </button>

      <p className="mt-5 text-center text-sm text-gray-500">
        Belum punya akun?{' '}
        <Link href="/register" className="font-semibold text-primary hover:text-primary-dark">
          Daftar di sini
        </Link>
      </p>
    </form>
  )
}
