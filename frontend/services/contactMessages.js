'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from '@/components/ui/feedback'

// Pesan dari formulir "Kontak Kami". POST publik; list/ubah/hapus butuh admin.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Selang cek pesan baru (ms) saat admin membuka halaman Pesan Masuk.
const POLL_MS = 15000

export async function sendContactMessage(payload) {
  const res = await fetch(`${BASE}/api/contact-messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Gagal mengirim pesan (${res.status})`)
  }
  return res.json()
}

async function listMessages(status) {
  const qs = status && status !== 'semua' ? `?status=${encodeURIComponent(status)}` : ''
  const res = await fetch(`${BASE}/api/contact-messages${qs}`, { credentials: 'include', cache: 'no-store' })
  if (!res.ok) throw new Error(`GET contact-messages → ${res.status}`)
  return res.json()
}

// Ringkasan jumlah pesan per status — dipakai badge sidebar & polling ringan.
export async function fetchMessageStats() {
  const res = await fetch(`${BASE}/api/contact-messages/stats`, { credentials: 'include', cache: 'no-store' })
  if (!res.ok) throw new Error(`GET contact-messages/stats → ${res.status}`)
  return res.json()
}

export async function setMessageStatus(id, status) {
  const res = await fetch(`${BASE}/api/contact-messages/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error(`PATCH status → ${res.status}`)
  return res.json()
}

export async function deleteMessage(id) {
  const res = await fetch(`${BASE}/api/contact-messages/${id}`, { method: 'DELETE', credentials: 'include' })
  if (!res.ok) throw new Error(`DELETE → ${res.status}`)
  return res.json()
}

export function useContactMessages(status = 'semua') {
  const [messages, setMessages] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Jumlah pesan total yang terakhir dilihat — untuk mendeteksi pesan baru.
  const lastTotalRef = useRef(null)
  // Cegah dua refresh jalan bersamaan (interval + focus + navigasi).
  const inFlightRef = useRef(false)

  const refresh = useCallback(
    ({ silent = false } = {}) => {
      if (silent && inFlightRef.current) return Promise.resolve()
      inFlightRef.current = true
      if (!silent) setLoading(true)
      return listMessages(status)
        .then((res) => {
          const s = res.stats || null
          setMessages(res.data || [])
          setStats(s)
          setError('')
          if (typeof s?.total === 'number') {
            const prev = lastTotalRef.current
            // Toast hanya untuk penyegaran diam-diam (bukan load pertama halaman).
            if (silent && prev != null && s.total > prev) {
              const baru = s.total - prev
              toast(
                `${baru} pesan baru masuk — ${s.baru ?? baru} belum dibaca.`,
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
    [status],
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
  // ke tab / halaman (focus, tab kelihatan lagi, restore dari bfcache), supaya
  // pesan baru muncul sendiri tanpa admin perlu reload halaman.
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
      await setMessageStatus(id, next)
      refresh()
    },
    [refresh],
  )

  const removeMessage = useCallback(
    async (id) => {
      await deleteMessage(id)
      refresh()
    },
    [refresh],
  )

  return { messages, stats, loading, error, refresh, changeStatus, removeMessage }
}
