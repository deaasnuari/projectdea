'use client'

import { EditModeProvider } from './EditModeContext'

// Pembungkus client untuk halaman server: menyediakan konteks mode edit.
// Section di dalamnya tetap bisa berupa komponen biasa; yang butuh inline
// editing tinggal pakai useEditMode / Editable*.
//
// Tombol "Edit Konten" + bar "Simpan Semua" dirender oleh
// <TextElementsProvider> (lihat TextElementsContext.jsx) supaya cuma ada
// SATU toolbar mengambang, bukan dua yang tumpang tindih.
export default function InlineEditProvider({ children, defaultEditing = false }) {
  return <EditModeProvider defaultEditing={defaultEditing}>{children}</EditModeProvider>
}
