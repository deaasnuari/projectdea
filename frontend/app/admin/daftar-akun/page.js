'use client'

import { useState } from 'react'
import { labelClass } from '@/components/admin/adminFormStyles'
import { toast, confirmDialog } from '@/components/ui/feedback'
import {
  useAdminAccounts,
  registerAccount,
  deleteAccount,
  resetAccountPassword,
} from '@/services/adminAccounts'

const EMPTY = { username: '', nama: '', nik: '', email: '', password: '', konfirmasi: '' }

const field =
  'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15'

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

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

export default function AdminDaftarAkunPage() {
  const { accounts, loading, refresh } = useAdminAccounts()
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [resetId, setResetId] = useState(null)
  const [resetPw, setResetPw] = useState('')
  const [resetShow, setResetShow] = useState(false)

  const pwMismatch = form.konfirmasi.length > 0 && form.konfirmasi !== form.password

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (saving) return
    if (!form.username.trim()) return toast('Username wajib diisi.', { tone: 'error' })
    if (form.password.length < 6) return toast('Password minimal 6 karakter.', { tone: 'error' })
    if (form.password !== form.konfirmasi) return toast('Konfirmasi password tidak sama.', { tone: 'error' })

    setSaving(true)
    try {
      await registerAccount({
        username: form.username.trim(),
        name: form.nama.trim(),
        nik: form.nik.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      toast(`Akun "${form.username.trim()}" berhasil dibuat.`, { tone: 'success' })
      setForm(EMPTY)
      refresh()
    } catch (err) {
      toast(err.message || 'Gagal membuat akun', { tone: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (acc) => {
    const ok = await confirmDialog({
      title: 'Hapus akun?',
      message: `Akun "${acc.username}" tidak bisa dipakai login lagi.`,
      confirmLabel: 'Hapus',
    })
    if (!ok) return
    try {
      await deleteAccount(acc.id)
      toast('Akun dihapus.', { tone: 'success' })
      refresh()
    } catch (err) {
      toast(err.message || 'Gagal menghapus akun', { tone: 'error' })
    }
  }

  const openReset = (acc) => {
    setResetId(acc.id)
    setResetPw('')
  }

  const submitReset = async (acc) => {
    if (resetPw.length < 6) return toast('Password baru minimal 6 karakter.', { tone: 'error' })
    try {
      await resetAccountPassword(acc.id, resetPw)
      toast(`Password akun "${acc.username}" diganti.`, { tone: 'success' })
      setResetId(null)
      setResetPw('')
    } catch (err) {
      toast(err.message || 'Gagal mengganti password', { tone: 'error' })
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Akun</p>
      <h1 className="font-heading text-xl font-bold text-navy">Akun Admin</h1>
      <p className="mt-1 text-[13px] text-gray-500">
        Buat, lihat &amp; hapus akun yang bisa masuk ke panel admin. Password disimpan ter-enkripsi.
      </p>

      {/* ---- Form buat akun ---- */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/60 px-5 py-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold text-navy">Buat Akun Baru</p>
            <p className="text-[12px] text-gray-400">Username &amp; password dipakai untuk login.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 p-5">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Username</label>
              <input type="text" required placeholder="cth: fauzi" value={form.username} onChange={set('username')} className={field} autoComplete="off" />
            </div>
            <div>
              <label className={labelClass}>Nama Lengkap</label>
              <input type="text" placeholder="cth: Ahmad Fauzi" value={form.nama} onChange={set('nama')} className={field} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>NIK Karyawan</label>
              <input type="text" placeholder="cth: 8201234567" value={form.nik} onChange={set('nik')} className={field} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" placeholder="email@plnbatam.com" value={form.email} onChange={set('email')} className={field} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Min. 6 karakter"
                  value={form.password}
                  onChange={set('password')}
                  className={`${field} pr-9`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-navy"
                >
                  {showPw ? EyeOffIcon : EyeIcon}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  placeholder="Ulangi password"
                  value={form.konfirmasi}
                  onChange={set('konfirmasi')}
                  className={`${field} pr-9 ${pwMismatch ? '!border-coral focus:!ring-coral/15' : ''}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-navy"
                >
                  {showPw ? EyeOffIcon : EyeIcon}
                </button>
              </div>
              {pwMismatch ? (
                <p className="mt-1 text-[11px] font-semibold text-coral">Konfirmasi password tidak sama.</p>
              ) : form.konfirmasi.length > 0 ? (
                <p className="mt-1 text-[11px] font-semibold text-green-600">Password cocok.</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/60 px-5 py-3.5">
          <button
            type="button"
            onClick={() => setForm(EMPTY)}
            className="rounded-lg px-3 py-2 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-100"
          >
            Bersihkan
          </button>
          <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
            {saving ? 'Menyimpan…' : 'Buat Akun'}
          </button>
        </div>
      </form>

      {/* ---- Daftar akun ---- */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-3">
          <p className="text-sm font-bold text-navy">
            Akun Terdaftar <span className="text-gray-400">({accounts.length})</span>
          </p>
        </div>

        {loading ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">Memuat…</p>
        ) : accounts.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">
            Belum ada akun tambahan. Akun bawaan tetap bisa login.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {accounts.map((acc) => (
              <li key={acc.id} className="px-5 py-3.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy">@{acc.username}</p>
                    <p className="truncate text-xs text-gray-400">
                      {[acc.name, acc.email].filter(Boolean).join(' · ') || 'Tanpa detail'}
                      {acc.created_at ? ` · dibuat ${fmtDate(acc.created_at)}` : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => (resetId === acc.id ? setResetId(null) : openReset(acc))}
                      className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200"
                    >
                      Reset Password
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(acc)}
                      className="rounded-lg bg-coral/10 px-3 py-1.5 text-xs font-semibold text-coral transition-colors hover:bg-coral/20"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                {resetId === acc.id && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-3">
                    <div className="relative min-w-[180px] flex-1">
                      <input
                        type={resetShow ? 'text' : 'password'}
                        autoFocus
                        minLength={6}
                        placeholder="Password baru (min. 6 karakter)"
                        value={resetPw}
                        onChange={(e) => setResetPw(e.target.value)}
                        className={`${field} pr-9`}
                      />
                      <button
                        type="button"
                        onClick={() => setResetShow((v) => !v)}
                        aria-label={resetShow ? 'Sembunyikan password' : 'Tampilkan password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-navy"
                      >
                        {resetShow ? EyeOffIcon : EyeIcon}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => submitReset(acc)}
                      className="btn btn-primary py-2 text-xs"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetId(null)}
                      className="rounded-lg px-3 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
