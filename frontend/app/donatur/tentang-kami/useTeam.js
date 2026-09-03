'use client'

// Anggota tim kini punya tabel khusus `team_members` di backend dengan CRUD
// penuh. Hook + klien API-nya ada di services/team.js — file ini hanya
// meneruskannya supaya import lama tetap jalan.
export { useTeam } from '@/services/team'
