'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Field, inputClass } from '@/components/auth/AuthCard'
import { loginAdmin, DEMO_ADMIN_CREDENTIALS } from '@/services/adminAuth'

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Catatan: belum ada backend, jadi ini cuma login demo (kredensial
    // ditulis langsung di kode) — sambungkan ke API auth kalau backend-nya
    // sudah siap. Lihat services/adminAuth.js.
    const ok = loginAdmin(username, password)
    if (!ok) {
      setError('Username atau password salah.')
      return
    }
    router.push('/admin')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Username" icon="user">
        <input
          type="text"
          required
          placeholder="Username admin"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Password" icon="lock">
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </Field>

      {error && <p className="mt-1 text-[11px] font-semibold text-coral">{error}</p>}

      <button type="submit" className="btn btn-primary mt-2 w-full justify-center py-2 text-xs">
        Masuk sebagai Admin
      </button>

      <p className="mt-3 text-center text-[10px] text-gray-400">
        Demo: {DEMO_ADMIN_CREDENTIALS.username} / {DEMO_ADMIN_CREDENTIALS.password}
      </p>

      <p className="mt-3 text-center text-xs text-gray-500">
        Belum punya akun?{' '}
        <Link href="/register" className="font-semibold text-primary hover:text-primary-dark">
          Daftar di sini
        </Link>
      </p>
    </form>
  )
}
