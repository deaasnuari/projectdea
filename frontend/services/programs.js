'use client'

import { useCallback, useEffect, useState } from 'react'
import { PROGRAMS, expandProgram } from '@/app/donatur/program/programData'

// Klien API "Daftar Program" — tabel `programs` di backend. GET publik,
// mutasi (POST/PUT/DELETE) butuh sesi admin.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// credentials disertakan supaya admin (punya cookie sesi) ikut menerima
// program yang "ditutup"; pengunjung biasa tetap hanya dapat yang aktif.
export async function fetchPrograms() {
  const res = await fetch(`${BASE}/api/programs`, { credentials: 'include', cache: 'no-store' })
  if (!res.ok) throw new Error(`GET programs → ${res.status}`)
  return (await res.json()).data
}

export async function fetchProgram(slug) {
  const res = await fetch(`${BASE}/api/programs/${encodeURIComponent(slug)}`, {
    credentials: 'include',
    cache: 'no-store',
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GET programs/${slug} → ${res.status}`)
  return res.json()
}

async function mutate(url, method, payload) {
  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: payload ? { 'Content-Type': 'application/json' } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `${method} ${url} → ${res.status}`)
  }
  return res.json()
}

export const createProgram = (payload) => mutate(`${BASE}/api/programs`, 'POST', payload)
export const updateProgram = (id, payload) => mutate(`${BASE}/api/programs/${id}`, 'PUT', payload)
export const deleteProgram = (id) => mutate(`${BASE}/api/programs/${id}`, 'DELETE')

const CHANGE_EVENT = 'programs:changed'
const CHANGE_KEY = 'lazispln_programs_rev'

function broadcastChange() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CHANGE_EVENT))
  try {
    localStorage.setItem(CHANGE_KEY, String(Date.now()))
  } catch {
    /* abaikan */
  }
}

// Dipanggil dari luar (mis. setelah verifikasi donasi) supaya daftar program
// yang sedang terbuka ikut menyegarkan collected/persentase-nya.
export const notifyProgramsChanged = broadcastChange

// Hook dipakai di halaman publik & admin. `PROGRAMS` = tampilan awal
// (offline fallback) sampai data API tiba. Setiap program di-expand
// warna theme-nya.
export function usePrograms() {
  const [programs, setPrograms] = useState(() => PROGRAMS.map(expandProgram))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchPrograms()
      .then((data) => {
        if (Array.isArray(data)) {
          setPrograms(data.map(expandProgram))
          setError('')
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refresh()
    const onChanged = () => refresh()
    const onStorage = (e) => {
      if (e.key === CHANGE_KEY) refresh()
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    window.addEventListener(CHANGE_EVENT, onChanged)
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onChanged)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChanged)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onChanged)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refresh])

  const saveProgram = useCallback(
    async (program) => {
      const saved = program.id ? await updateProgram(program.id, program) : await createProgram(program)
      broadcastChange()
      await refresh()
      return saved
    },
    [refresh],
  )

  const removeProgram = useCallback(
    async (program) => {
      const id = program && typeof program === 'object' ? program.id : program
      if (id == null) return
      await deleteProgram(id)
      broadcastChange()
      await refresh()
    },
    [refresh],
  )

  // Tutup / buka program (tampil-tidaknya di halaman donatur).
  const setProgramActive = useCallback(
    async (program, active) => {
      const id = program && typeof program === 'object' ? program.id : program
      if (id == null) return
      await updateProgram(id, { active })
      broadcastChange()
      await refresh()
    },
    [refresh],
  )

  // Ubah status program sekaligus: { active, donationOpen }.
  //  - active:false        → program hilang dari halaman donatur
  //  - donationOpen:false  → tetap tampil, tombol donasi dinonaktifkan
  const setProgramState = useCallback(
    async (program, patch) => {
      const id = program && typeof program === 'object' ? program.id : program
      if (id == null) return
      const body = {}
      if (typeof patch.active === 'boolean') body.active = patch.active
      if (typeof patch.donationOpen === 'boolean') body.donationOpen = patch.donationOpen
      await updateProgram(id, body)
      broadcastChange()
      await refresh()
    },
    [refresh],
  )

  return {
    programs,
    loading,
    error,
    refresh,
    saveProgram,
    removeProgram,
    setProgramActive,
    setProgramState,
  }
}
