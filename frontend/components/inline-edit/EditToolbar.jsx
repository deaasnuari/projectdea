'use client'

import { useEditMode } from './EditModeContext'

// Tombol mengambang kecil di pojok kanan bawah. Hanya tampil untuk admin.
// Klik: aktif/nonaktifkan mode edit. Saat mode edit mati, halaman ini
// persis seperti tampilan pengunjung.
export default function EditToolbar() {
  const { isAdmin, editing, setEditing } = useEditMode()

  if (!isAdmin) return null

  return (
    <div className="inline-edit-toolbar">
      {editing && <span className="inline-edit-toolbar-hint">Mode edit — klik teks/gambar yang ingin diubah</span>}
      <button
        type="button"
        className={`inline-edit-toolbar-btn${editing ? ' is-on' : ''}`}
        onClick={() => setEditing(!editing)}
      >
        {editing ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Selesai Edit
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            Edit Konten
          </>
        )}
      </button>
    </div>
  )
}
