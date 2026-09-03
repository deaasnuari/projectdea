'use client'

import { useCallback, useEffect, useState } from 'react'
import { notifyProgramsChanged } from '@/services/programs'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function createDonation(payload) {
  const res = await fetch(`${BASE}/api/donations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
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

async function fetchStats() {
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

  const refresh = useCallback(() => {
    setLoading(true)
    Promise.all([listDonations(status, source, jenis), fetchStats(), fetchJenisOptions()])
      .then(([r, s, j]) => {
        setRows(r)
        setStats(s)
        setJenisOptions(j)
        setError('')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [status, source, jenis])

  useEffect(() => {
    refresh()
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
