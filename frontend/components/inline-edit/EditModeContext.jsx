'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { checkAdminSession, isAdminLoggedIn } from '@/services/adminAuth'

// Konteks kecil buat inline editing: apakah pengguna admin, dan apakah
// "mode edit" sedang aktif. Semua komponen Editable* baca dari sini.
// Pengunjung biasa: isAdmin = false → tidak ada pensil/outline/kontrol apa pun.
const EditModeContext = createContext({
  isAdmin: false,
  editing: false,
  setEditing: () => {},
})

export function EditModeProvider({ children, defaultEditing = false }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [editing, setEditing] = useState(defaultEditing)

  // Petunjuk sinkron dulu (biar tidak berkedip), lalu konfirmasi ke backend.
  useEffect(() => {
    setIsAdmin(isAdminLoggedIn())
    checkAdminSession().then(setIsAdmin)
  }, [])

  const value = useMemo(
    () => ({
      isAdmin,
      editing: isAdmin && editing,
      setEditing: (next) => setEditing(Boolean(next)),
    }),
    [isAdmin, editing],
  )

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>
}

export function useEditMode() {
  return useContext(EditModeContext)
}
