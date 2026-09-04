'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin, DEMO_ADMIN_CREDENTIALS } from '@/services/adminAuth'
import { changePassword } from '@/services/adminAccounts'
import { toast } from '@/components/ui/feedback'

const UserIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" />
  </svg>
)
const LockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </svg>
)
const EyeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const EyeOffIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6a3 3 0 004.2 4.2" />
    <path d="M9.9 5.2A9.6 9.6 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3.2 4.1M6.1 6.1A17 17 0 002 12s3.5 7 10 7a9.5 9.5 0 004-.9" />
  </svg>
)

const fieldWrap =
  'flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 transition-colors focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/15'
const fieldInput =
  'w-full bg-transparent py-2.5 text-sm text-navy outline-none placeholder:text-gray-400'
const labelText = 'mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-500'

export default function LoginForm() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'reset'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Form "lupa password" — set password baru langsung
  const [rsUser, setRsUser] = useState('')
  const [rsPw, setRsPw] = useState('')
  const [rsConfirm, setRsConfirm] = useState('')
  const [rsShow, setRsShow] = useState(false)
  const [rsBusy, setRsBusy] = useState(false)

  const goReset = () => {
    setError('')
    setMode('reset')
  }
  const goLogin = () => {
    setError('')
    setRsUser('')
    setRsPw('')
    setRsConfirm('')
    setMode('login')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setError('')

    if (!username.trim() || !password.trim()) {
      const msg = 'Isi username dan password dulu sebelum masuk.'
      setError(msg)
      toast(msg, { tone: 'error' })
      return
    }

    setLoading(true)
    const ok = await loginAdmin(username.trim(), password)
    setLoading(false)

    if (!ok) {
      const msg = 'Username atau password salah, atau server tidak dapat dihubungi.'
      setError(msg)
      toast(msg, { tone: 'error' })
      return
    }

    toast('Berhasil masuk. Mengalihkan ke panel admin…', { tone: 'success' })
    router.push('/admin')
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (rsBusy) return
    if (!rsUser.trim() || !rsPw.trim()) {
      toast('Isi username dan password baru.', { tone: 'error' })
      return
    }
    if (rsPw.length < 6) {
      toast('Password baru minimal 6 karakter.', { tone: 'error' })
      return
    }
    if (rsPw !== rsConfirm) {
      toast('Konfirmasi password baru tidak sama.', { tone: 'error' })
      return
    }
    setRsBusy(true)
    try {
      await changePassword({ username: rsUser.trim(), newPassword: rsPw })
      toast('Password berhasil diganti. Silakan masuk dengan password baru.', { tone: 'success' })
      setRsPw('')
      setRsConfirm('')
      setUsername(rsUser.trim())
      setMode('login')
    } catch (err) {
      toast(err.message || 'Gagal mengganti password', { tone: 'error' })
    } finally {
      setRsBusy(false)
    }
  }

  if (mode === 'reset') {
    return (
      <form onSubmit={handleReset} className="flex flex-col gap-3">
        <p className="text-[12px] leading-relaxed text-gray-500">
          Masukkan username akun lalu password baru. Password lama langsung diganti begitu disimpan.
        </p>

        <label className="block">
          <span className={labelText}>Username</span>
          <span className={fieldWrap}>
            <span className="text-gray-400">{UserIcon}</span>
            <input
              type="text"
              autoFocus
              placeholder="Username akun"
              value={rsUser}
              onChange={(e) => setRsUser(e.target.value)}
              className={fieldInput}
            />
          </span>
        </label>

        <label className="block">
          <span className={labelText}>Password Baru</span>
          <span className={fieldWrap}>
            <span className="text-gray-400">{LockIcon}</span>
            <input
              type={rsShow ? 'text' : 'password'}
              placeholder="Min. 6 karakter"
              value={rsPw}
              onChange={(e) => setRsPw(e.target.value)}
              className={fieldInput}
            />
            <button
              type="button"
              onClick={() => setRsShow((v) => !v)}
              aria-label={rsShow ? 'Sembunyikan password' : 'Tampilkan password'}
              className="shrink-0 text-gray-400 transition-colors hover:text-navy"
            >
              {rsShow ? EyeOffIcon : EyeIcon}
            </button>
          </span>
        </label>

        <label className="block">
          <span className={labelText}>Konfirmasi Password Baru</span>
          <span
            className={`${fieldWrap} ${
              rsConfirm && rsConfirm !== rsPw ? '!border-coral focus-within:!ring-coral/15' : ''
            }`}
          >
            <span className="text-gray-400">{LockIcon}</span>
            <input
              type={rsShow ? 'text' : 'password'}
              placeholder="Ulangi password baru"
              value={rsConfirm}
              onChange={(e) => setRsConfirm(e.target.value)}
              className={fieldInput}
            />
            <button
              type="button"
              onClick={() => setRsShow((v) => !v)}
              aria-label={rsShow ? 'Sembunyikan password' : 'Tampilkan password'}
              className="shrink-0 text-gray-400 transition-colors hover:text-navy"
            >
              {rsShow ? EyeOffIcon : EyeIcon}
            </button>
          </span>
          {rsConfirm && rsConfirm !== rsPw ? (
            <span className="mt-1 block text-[11px] font-semibold text-coral">
              Konfirmasi password tidak sama.
            </span>
          ) : rsConfirm && rsConfirm === rsPw ? (
            <span className="mt-1 block text-[11px] font-semibold text-green-600">Password cocok.</span>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={rsBusy}
          className="btn btn-primary mt-1 w-full justify-center py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {rsBusy ? 'Menyimpan…' : 'Simpan Password Baru'}
        </button>

        <button
          type="button"
          onClick={goLogin}
          className="text-center text-[12px] font-semibold text-gray-400 transition-colors hover:text-navy"
        >
          ← Kembali ke halaman masuk
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="block">
        <span className={labelText}>Username</span>
        <span className={fieldWrap}>
          <span className="text-gray-400">{UserIcon}</span>
          <input
            type="text"
            autoFocus
            autoComplete="username"
            placeholder="Username admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={fieldInput}
          />
        </span>
      </label>

      <label className="block">
        <span className={labelText}>Password</span>
        <span className={fieldWrap}>
          <span className="text-gray-400">{LockIcon}</span>
          <input
            type={showPw ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldInput}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}
            className="shrink-0 text-gray-400 transition-colors hover:text-navy"
          >
            {showPw ? EyeOffIcon : EyeIcon}
          </button>
        </span>
      </label>

      <button
        type="button"
        onClick={goReset}
        className="-mt-0.5 self-end text-[11px] font-semibold text-primary transition-colors hover:text-primary-dark"
      >
        Lupa password?
      </button>

      {error && (
        <p className="rounded-lg bg-coral/10 px-3 py-2 text-xs font-semibold text-coral">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full justify-center py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Memproses…' : 'Masuk'}
      </button>

      <p className="text-center text-[10px] text-gray-400">
        Demo: {DEMO_ADMIN_CREDENTIALS.username} / {DEMO_ADMIN_CREDENTIALS.password}
      </p>
    </form>
  )
}
