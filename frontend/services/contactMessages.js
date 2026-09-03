'use client'

import { useCallback, useEffect, useState } from 'react'

// Pesan dari formulir "Kontak Kami". POST publik; list/ubah/hapus butuh admin.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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

  const refresh = useCallback(() => {
    setLoading(true)
    listMessages(status)
      .then((res) => {
        setMessages(res.data || [])
        setStats(res.stats || null)
        setError('')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [status])

  useEffect(() => {
    refresh()
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
