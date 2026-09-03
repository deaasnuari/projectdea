'use client'

import { useCallback, useEffect, useState } from 'react'
import { TEAM } from '@/app/donatur/tentang-kami/timData'

// Klien API "Tim" — tabel `team_members` di backend. GET publik, mutasi
// (POST/PUT/DELETE) butuh sesi admin.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function fetchTeam() {
  const res = await fetch(`${BASE}/api/team`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET team → ${res.status}`)
  return (await res.json()).data
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

export const createMember = (payload) => mutate(`${BASE}/api/team`, 'POST', payload)
export const updateMember = (id, payload) => mutate(`${BASE}/api/team/${id}`, 'PUT', payload)
export const deleteMember = (id) => mutate(`${BASE}/api/team/${id}`, 'DELETE')

const CHANGE_EVENT = 'team:changed'
const CHANGE_KEY = 'lazispln_team_rev'

function broadcastChange() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CHANGE_EVENT))
  try {
    localStorage.setItem(CHANGE_KEY, String(Date.now()))
  } catch {
    /* abaikan */
  }
}

// `TEAM` = tampilan awal (offline fallback) sampai data API tiba.
export function useTeam() {
  const [team, setTeam] = useState(TEAM)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchTeam()
      .then((data) => {
        if (Array.isArray(data)) {
          setTeam(data)
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

  const saveMember = useCallback(
    async (member) => {
      const saved = member.id ? await updateMember(member.id, member) : await createMember(member)
      broadcastChange()
      await refresh()
      return saved
    },
    [refresh],
  )

  const removeMember = useCallback(
    async (member) => {
      const id = member && typeof member === 'object' ? member.id : member
      if (id == null) return
      await deleteMember(id)
      broadcastChange()
      await refresh()
    },
    [refresh],
  )

  return { team, loading, error, refresh, saveMember, removeMember }
}
