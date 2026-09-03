'use client'

// "Daftar Program" kini punya tabel khusus `programs` di backend dengan CRUD
// penuh. Hook + klien API-nya ada di services/programs.js — file ini hanya
// meneruskannya supaya import lama tetap jalan.
export { usePrograms, fetchProgram } from '@/services/programs'
