'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { checkAdminSession, isAdminLoggedIn } from '@/services/adminAuth'
import { useDevice } from './responsive'

// Konteks kecil buat inline editing: apakah pengguna admin, dan apakah
// "mode edit" sedang aktif. Semua komponen Editable* baca dari sini.
// Pengunjung biasa: isAdmin = false → tidak ada pensil/outline/kontrol apa pun.
//
// Di pratinjau admin (iframe DevicePreviewFrame), ukuran Tablet & HP hanya
// untuk MELIHAT hasil responsif (`viewOnly`): konten diedit sekali di Desktop,
// datanya satu untuk semua perangkat. `editing` (efektif) jadi false di sana,
// sedangkan `editingOn` tetap menyimpan status mode edit sesungguhnya supaya
// kembali ke Desktop langsung bisa lanjut mengedit.
const EditModeContext = createContext({
  isAdmin: false,
  editing: false,
  editingOn: false,
  viewOnly: false,
  setEditing: () => {},
})

export function EditModeProvider({ children, defaultEditing = false }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [editing, setEditing] = useState(defaultEditing)
  const [embedded, setEmbedded] = useState(false)
  const device = useDevice()

  // Petunjuk sinkron dulu (biar tidak berkedip), lalu konfirmasi ke backend.
  useEffect(() => {
    setIsAdmin(isAdminLoggedIn())
    checkAdminSession().then(setIsAdmin)
    setEmbedded(window.parent !== window)
  }, [])

  const viewOnly = embedded && device !== 'desktop'

  const value = useMemo(
    () => ({
      isAdmin,
      editing: isAdmin && editing && !viewOnly,
      editingOn: isAdmin && editing,
      viewOnly,
      setEditing: (next) => setEditing(Boolean(next)),
    }),
    [isAdmin, editing, viewOnly],
  )

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>
}

export function useEditMode() {
  return useContext(EditModeContext)
}
