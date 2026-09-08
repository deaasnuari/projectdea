'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { notifyProgramsChanged } from '@/services/programs'
import { toast } from '@/components/ui/feedback'

// Selang cek donasi baru (ms) saat admin membuka halaman Riwayat Donasi.
const POLL_MS = 15000

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function createDonation(payload) {
  let res
  try {
    res = await fetch(`${BASE}/api/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // fetch gagal total (server mati / tidak bisa dihubungi / CORS)
    throw new Error(
      'Tidak bisa terhubung ke server donasi. Pastikan koneksi internet aktif dan coba lagi.',
    )
  }
  if (!res.ok) {
    if (res.status === 413) {
      throw new Error('Bukti transfer terlalu besar. Coba unggah foto yang lebih kecil.')
    }
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Gagal mengirim donasi (${res.status})`)
  }
  return res.json()
}

async function listDonations(status, source, jenis) {
  const p = new URLSearchParams()
  if (status && status !== 'semua') p.set('status', status)
  if (source && source !== 'semua') p.set('source', source)
  if (jenis && jenis !== 'semua') p.set('jenis', jenis)
  const qs = p.toString() ? `?${p}` : ''
  const res = await fetch(`${BASE}/api/donations${qs}`, { credentials: 'include', cache: 'no-store' })
  if (!res.ok) throw new Error(`GET donations → ${res.status}`)
  return (await res.json()).data
}

async function fetchJenisOptions() {
  const res = await fetch(`${BASE}/api/donations/jenis-options`, { credentials: 'include', cache: 'no-store' })
  if (!res.ok) return []
  return (await res.json()).data || []
}

export async function fetchStats() {
  const res = await fetch(`${BASE}/api/donations/stats`, { credentials: 'include', cache: 'no-store' })
  if (!res.ok) throw new Error(`GET stats → ${res.status}`)
  return res.json()
}

export async function setDonationStatus(id, status) {
  const res = await fetch(`${BASE}/api/donations/${id}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error(`PATCH status → ${res.status}`)
  return res.json()
}

export async function deleteDonation(id) {
  const res = await fetch(`${BASE}/api/donations/${id}`, { method: 'DELETE', credentials: 'include' })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `DELETE donation → ${res.status}`)
  }
  return res.json()
}

export const proofUrl = (id) => `${BASE}/api/donations/${id}/proof`

// Hook untuk halaman admin Riwayat Donasi.
export function useDonations(status = 'semua', source = 'semua', jenis = 'semua') {
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState(null)
  const [jenisOptions, setJenisOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Jumlah donasi total yang terakhir dilihat — untuk mendeteksi donasi baru.
  const lastTotalRef = useRef(null)
  // Cegah dua refresh jalan bersamaan (interval + focus + navigasi).
  const inFlightRef = useRef(false)

  const refresh = useCallback(
    ({ silent = false } = {}) => {
      if (silent && inFlightRef.current) return Promise.resolve()
      inFlightRef.current = true
      if (!silent) setLoading(true)
      return Promise.all([listDonations(status, source, jenis), fetchStats(), fetchJenisOptions()])
        .then(([r, s, j]) => {
          setRows(r)
          setStats(s)
          setJenisOptions(j)
          setError('')
          if (typeof s?.total === 'number') {
            const prev = lastTotalRef.current
            // Toast hanya untuk penyegaran diam-diam (bukan load pertama halaman).
            if (silent && prev != null && s.total > prev) {
              const baru = s.total - prev
              toast(
                `${baru} donasi baru masuk — ${s.menunggu ?? baru} menunggu verifikasi.`,
                { tone: 'success', duration: 6000 },
              )
            }
            lastTotalRef.current = s.total
          }
        })
        .then(() => true)
        .catch((e) => {
          setError(e.message)
          return false
        })
        .finally(() => {
          inFlightRef.current = false
          if (!silent) setLoading(false)
        })
    },
    [status, source, jenis],
  )

  useEffect(() => {
    let alive = true
    let retry
    refresh().then((ok) => {
      // Kalau load pertama gagal (server baru nyala / sesi belum kebaca),
      // coba lagi cepat sekali supaya daftar muncul tanpa perlu reload manual.
      if (alive && !ok) retry = setTimeout(() => alive && refresh(), 2000)
    })
    return () => {
      alive = false
      clearTimeout(retry)
    }
  }, [refresh])

  // Selalu segarkan daftar saat halaman aktif — berkala + tiap admin kembali
  // ke tab / halaman (focus, tab kelihatan lagi, restore dari bfcache).
  // Ini juga yang menyembuhkan kalau fetch pertama gagal sesaat, jadi admin
  // tidak perlu hard-reload (Ctrl+Shift+R) supaya donasinya muncul.
  useEffect(() => {
    const sync = () => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return
      refresh({ silent: true })
    }
    const timer = setInterval(sync, POLL_MS)
    window.addEventListener('focus', sync)
    window.addEventListener('pageshow', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', sync)
      window.removeEventListener('pageshow', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [refresh])

  const changeStatus = useCallback(
    async (id, next) => {
      await setDonationStatus(id, next)
      // Verifikasi/pembatalan donasi program mengubah collected program di backend.
      notifyProgramsChanged()
      refresh()
    },
    [refresh],
  )

  const removeDonation = useCallback(
    async (id) => {
      await deleteDonation(id)
      notifyProgramsChanged() // hapus donasi terverifikasi mengembalikan collected program
      refresh()
    },
    [refresh],
  )

  return { rows, stats, jenisOptions, loading, error, refresh, changeStatus, removeDonation }
}
