'use client'

import { useEffect, useRef, useState } from 'react'
import { DEVICES } from './responsive'
import { EDIT_BRIDGE_CMD, EDIT_BRIDGE_STATE } from './EditToolbar'
import { FRAME_HEIGHT_MSG } from './FrameHeightReporter'

const DeviceIcon = ({ id }) => {
  const paths = {
    desktop: ['M3 4h18v12H3z', 'M8 20h8', 'M12 16v4'],
    tablet: ['M5 2h14v20H5z', 'M11 18h2'],
    mobile: ['M7 2h10v20H7z', 'M11 18h2'],
  }[id]
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

// Pratinjau konten per perangkat: tombol Desktop / Tablet / HP mengubah lebar
// <iframe> berisi halaman yang bisa diedit, supaya admin bisa MELIHAT hasil
// responsifnya. Tidak ada pengaturan terpisah per perangkat — tablet & HP
// menyesuaikan otomatis dari yang ditata di Desktop (lihat EditableRichText).
//
// Tombol Edit Konten / Simpan Semua / Selesai Edit ada di bar atas ini
// (menempel saat di-scroll) — dijembatani ke EditToolbar di dalam iframe
// lewat postMessage, jadi admin tidak perlu scroll ke bawah pratinjau.
//
// Iframe dibuat setinggi isinya (dilaporkan FrameHeightReporter) — tidak ada
// scroll di dalam pratinjau, cukup scroll halaman admin seperti biasa.
//
// Ganti perangkat TIDAK memuat ulang iframe, jadi perubahan yang belum
// disimpan tetap aman. Kalau area lebih sempit dari lebar perangkat,
// pratinjau diperkecil (scale) supaya tetap muat.
export default function DevicePreviewFrame({ page }) {
  const [device, setDevice] = useState('desktop')
  const wrapRef = useRef(null)
  const frameRef = useRef(null)
  const [avail, setAvail] = useState(0)
  const [contentH, setContentH] = useState(800) // tinggi isi iframe (px, sebelum scale)
  const [edit, setEdit] = useState(null) // status dari EditToolbar di iframe

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => setAvail(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin) return
      if (e.source !== frameRef.current?.contentWindow) return
      if (e.data?.type === EDIT_BRIDGE_STATE) setEdit(e.data)
      if (e.data?.type === FRAME_HEIGHT_MSG && e.data.height > 0) setContentH(e.data.height)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const send = (action) =>
    frameRef.current?.contentWindow?.postMessage({ type: EDIT_BRIDGE_CMD, action }, window.location.origin)

  const d = DEVICES.find((x) => x.id === device)
  const width = device === 'desktop' ? Math.max(d.width, avail) : d.width
  const scale = avail ? Math.min(1, avail / width) : 1

  const editing = Boolean(edit?.editing)
  const hasPending = (edit?.pendingCount || 0) > 0

  return (
    <div>
      {/* Bar atas: pilihan perangkat + tombol edit. Menempel di bawah header
          admin (h-14 di layar lebar, ±61px di HP/iPad) saat di-scroll. */}
      <div className="sticky top-[61px] z-20 -mx-1 mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white/95 p-2 shadow-sm backdrop-blur min-[900px]:top-14">
        <span className="pl-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400">
          Pratinjau
        </span>
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          {DEVICES.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setDevice(x.id)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                device === x.id ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
              aria-pressed={device === x.id}
            >
              <DeviceIcon id={x.id} />
              {x.label}
            </button>
          ))}
        </div>

        {edit?.isAdmin && (
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            {hasPending ? (
              <span className="rounded-full bg-coral/10 px-3 py-1 text-[11px] font-bold text-coral">
                {edit.pendingCount} perubahan belum disimpan
              </span>
            ) : (
              editing && (
                <span className="text-[11px] font-semibold text-gray-500">
                  Mode edit — klik teks/gambar yang ingin diubah
                </span>
              )
            )}

            {hasPending && (
              <>
                <button
                  type="button"
                  onClick={() => send('discard')}
                  disabled={edit.busy}
                  className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Buang Semua
                </button>
                <button
                  type="button"
                  onClick={() => send('save')}
                  disabled={edit.busy}
                  className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-navy transition-colors hover:brightness-95 disabled:opacity-50"
                >
                  {edit.busy ? 'Menyimpan…' : 'Simpan Semua'}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => send('toggle')}
              disabled={edit.publishing}
              title={editing && hasPending ? 'Simpan atau buang perubahan dulu' : undefined}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white transition-colors ${
                editing ? 'bg-navy hover:bg-navy-dark' : 'bg-primary hover:bg-primary-dark'
              } ${editing && (hasPending || edit.publishing) ? 'cursor-not-allowed opacity-55' : ''}`}
            >
              {editing ? (
                <>
                  {!edit.publishing && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                  {edit.publishing ? 'Menerbitkan…' : 'Selesai Edit'}
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                  Edit Konten
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <p className="mb-3 text-xs text-gray-500">
        Cukup edit sekali di <b>Desktop</b> — tampilan tablet &amp; HP menyesuaikan otomatis. Pilih Tablet/HP
        hanya untuk melihat hasilnya.
      </p>

      <div ref={wrapRef} className="w-full">
        <div
          className="mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-[width] duration-300"
          style={{ width: Math.round(width * scale), height: Math.ceil(contentH * scale) }}
        >
          <iframe
            ref={frameRef}
            src={`/admin-pratinjau/${page}`}
            title="Pratinjau konten"
            onLoad={() => send('ping')}
            scrolling="no"
            className="block border-0"
            style={{
              width,
              height: contentH,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
      </div>
    </div>
  )
}
