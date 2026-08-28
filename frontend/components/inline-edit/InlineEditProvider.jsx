'use client'

import { EditModeProvider } from './EditModeContext'
import EditToolbar from './EditToolbar'

// Pembungkus client untuk halaman server: menyediakan konteks mode edit +
// menempatkan tombol "Edit Konten". Section di dalamnya tetap bisa berupa
// komponen biasa; yang butuh inline editing tinggal pakai useEditMode /
// Editable*.
export default function InlineEditProvider({ children, defaultEditing = false }) {
  return (
    <EditModeProvider defaultEditing={defaultEditing}>
      {children}
      <EditToolbar />
    </EditModeProvider>
  )
}
