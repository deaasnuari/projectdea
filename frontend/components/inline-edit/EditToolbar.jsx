'use client'

import { useState } from 'react'
import { useEditMode } from './EditModeContext'
import { useTextElementsContext } from './TextElementsContext'
import { toast, alertModal } from '@/components/ui/feedback'

// Satu bar mengambang di pojok kanan bawah — bukan dua terpisah. Isinya:
// status ("mode edit" atau "N perubahan belum disimpan"), tombol Buang
// Semua / Simpan Semua kalau ada perubahan tertahan, dan tombol
// aktif/nonaktifkan mode edit. Hanya tampil untuk admin.
export default function EditToolbar() {
  const { isAdmin, editing, setEditing } = useEditMode()
  const { pendingCount, saveAll, discardAll, publish } = useTextElementsContext()
  const [busy, setBusy] = useState(false)
  const [publishing, setPublishing] = useState(false)

  if (!isAdmin) return null

  const hasPending = pendingCount > 0

  const onSave = async () => {
    setBusy(true)
    try {
      const { okCount, failedCount } = await saveAll()
      if (failedCount === 0) {
        alertModal(`${okCount} perubahan tersimpan sebagai draf — BELUM tampil di halaman publik.`, {
          title: 'Tersimpan (draf)',
          tone: 'success',
          closeLabel: 'Oke, klik Selesai Edit untuk terbitkan',
        })
      } else {
        toast(`${okCount} tersimpan, ${failedCount} gagal — coba lagi.`, { tone: 'error' })
      }
    } catch (err) {
      toast(err.message || 'Gagal menyimpan perubahan', { tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  const onDiscard = () => {
    discardAll()
    toast('Semua perubahan yang belum disimpan dibuang.', { tone: 'info' })
  }

  // Tidak boleh keluar dari mode edit selama masih ada perubahan tertahan —
  // supaya tidak ada yang kelupaan disimpan/dibuang begitu saja. Kalau lolos
  // itu, "Selesai Edit" JUGA memublikasikan seluruh draf yang sudah disimpan
  // (via Simpan Semua) ke halaman publik — baru sekarang pengunjung melihatnya.
  const onToggleEditing = async () => {
    if (!editing) {
      setEditing(true)
      return
    }
    if (hasPending) {
      toast('Simpan atau buang perubahan dulu sebelum keluar dari mode edit.', { tone: 'error' })
      return
    }
    setPublishing(true)
    try {
      const { publishedCount } = await publish()
      setEditing(false)
      if (publishedCount > 0) {
        alertModal(`${publishedCount} perubahan sekarang sudah tampil di halaman publik.`, {
          title: 'Diterbitkan',
          tone: 'success',
        })
      }
    } catch (err) {
      toast(err.message || 'Gagal menerbitkan perubahan — tetap di mode edit.', { tone: 'error' })
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="inline-edit-toolbar">
      {hasPending ? (
        <span className="inline-edit-toolbar-hint inline-edit-toolbar-hint-warn">
          {pendingCount} perubahan belum disimpan
        </span>
      ) : (
        editing && (
          <span className="inline-edit-toolbar-hint">Mode edit — klik teks/gambar yang ingin diubah</span>
        )
      )}

      {hasPending && (
        <>
          <button
            type="button"
            className="inline-edit-btn inline-edit-btn-cancel"
            onClick={onDiscard}
            disabled={busy}
          >
            Buang Semua
          </button>
          <button
            type="button"
            className="inline-edit-btn inline-edit-btn-save"
            onClick={onSave}
            disabled={busy}
          >
            {busy ? 'Menyimpan…' : 'Simpan Semua'}
          </button>
        </>
      )}

      <button
        type="button"
        className={`inline-edit-toolbar-btn${editing ? ' is-on' : ''}${
          editing && (hasPending || publishing) ? ' is-disabled' : ''
        }`}
        onClick={onToggleEditing}
        disabled={publishing}
        title={editing && hasPending ? 'Simpan atau buang perubahan dulu' : undefined}
      >
        {editing ? (
          <>
            {!publishing && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
            {publishing ? 'Menerbitkan…' : 'Selesai Edit'}
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
