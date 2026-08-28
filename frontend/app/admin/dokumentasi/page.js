'use client'

import { useState } from 'react'
import AdminModal from '@/components/admin/AdminModal'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import { useKamiPeduliContent } from '@/app/donatur/sections/useKamiPeduliContent'
import { youtubeThumb, youtubeWatchUrl, youtubeId } from '@/services/youtube'
import { fileToResizedDataUrl } from '@/services/imageFile'

const EMPTY_VIDEO = { image: '', badge: '', title: '', desc: '', videoUrl: '', date: '', duration: '' }
const EMPTY_FOTO = { image: '', caption: '' }

const slug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40)

const IconPlus = (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
  </svg>
)

// Halaman admin untuk mengelola bagian "Bukti Nyata" (daftar video) dan
// "Dokumentasi / Galeri" (daftar foto) di halaman Kami Peduli — pola CRUD
// (tambah / edit / hapus) lewat modal, seperti halaman admin lainnya.
// Perubahan disimpan (localStorage, pola donorData.js) dan langsung tampil
// di halaman publik. Teks judul/hero section tetap diedit inline di
// /admin/konten-kami-peduli.
export default function AdminDokumentasiPage() {
  const { content, addListItem, patchListItem, removeListItem } = useKamiPeduliContent()
  const videos = content.videos
  const galeri = content.galeri

  const [videoModal, setVideoModal] = useState(false)
  const [videoEditId, setVideoEditId] = useState(null)
  const [videoForm, setVideoForm] = useState(EMPTY_VIDEO)

  const [fotoModal, setFotoModal] = useState(false)
  const [fotoEditId, setFotoEditId] = useState(null)
  const [fotoForm, setFotoForm] = useState(EMPTY_FOTO)
  const [fotoBusy, setFotoBusy] = useState(false)
  const [fotoError, setFotoError] = useState('')

  // ---- Video ----
  const openAddVideo = () => {
    setVideoEditId(null)
    setVideoForm(EMPTY_VIDEO)
    setVideoModal(true)
  }
  const openEditVideo = (v) => {
    setVideoEditId(v.id)
    setVideoForm({
      image: v.image || '',
      badge: v.badge || '',
      title: v.title || '',
      desc: v.desc || '',
      videoUrl: v.videoUrl || '',
      date: v.date || '',
      duration: v.duration || '',
    })
    setVideoModal(true)
  }
  const submitVideo = (e) => {
    e.preventDefault()
    const url = videoForm.videoUrl.trim()
    if (!url || !videoForm.title.trim()) return
    if (!youtubeId(url)) return // link YouTube tidak dikenali (pesan tampil di form)
    // Thumbnail otomatis dari YouTube; kolom "URL Thumbnail" hanya untuk
    // menimpa kalau admin mau gambar sendiri.
    const payload = {
      ...videoForm,
      videoUrl: youtubeWatchUrl(url),
      image: videoForm.image.trim() || youtubeThumb(url),
    }
    if (videoEditId) {
      patchListItem('videos', videoEditId, payload)
    } else {
      addListItem('videos', { id: `${slug(videoForm.title) || 'video'}-${Date.now()}`, ...payload })
    }
    setVideoModal(false)
  }
  const deleteVideo = (v) => {
    if (window.confirm(`Hapus video "${v.title}"?`)) removeListItem('videos', v.id)
  }

  // ---- Foto galeri ----
  const openAddFoto = () => {
    setFotoEditId(null)
    setFotoForm(EMPTY_FOTO)
    setFotoError('')
    setFotoModal(true)
  }
  const openEditFoto = (f) => {
    setFotoEditId(f.id)
    setFotoForm({ image: f.image || '', caption: f.caption || '' })
    setFotoError('')
    setFotoModal(true)
  }
  // Pilih file gambar → diperkecil jadi data URL, disimpan di form.
  const handleFotoFile = async (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = '' // supaya memilih file yang sama lagi tetap memicu onChange
    if (!file) return
    setFotoBusy(true)
    setFotoError('')
    try {
      const dataUrl = await fileToResizedDataUrl(file)
      setFotoForm((f) => ({ ...f, image: dataUrl }))
    } catch (err) {
      setFotoError(err.message || 'Gagal memproses gambar')
    } finally {
      setFotoBusy(false)
    }
  }
  const submitFoto = (e) => {
    e.preventDefault()
    if (!fotoForm.image || !fotoForm.caption.trim()) {
      setFotoError('Pilih foto dan isi keterangan dulu.')
      return
    }
    try {
      if (fotoEditId) {
        patchListItem('galeri', fotoEditId, { ...fotoForm })
      } else {
        addListItem('galeri', { id: `${slug(fotoForm.caption) || 'galeri'}-${Date.now()}`, ...fotoForm })
      }
      setFotoModal(false)
    } catch (err) {
      // Umumnya QuotaExceededError — localStorage penuh oleh gambar.
      setFotoError(
        'Penyimpanan penuh. Foto yang tersimpan terlalu banyak/besar — hapus beberapa foto lama lalu coba lagi.',
      )
    }
  }
  const deleteFoto = (f) => {
    if (window.confirm(`Hapus foto "${f.caption}"?`)) removeListItem('galeri', f.id)
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
        <h1 className="font-heading text-2xl font-bold text-navy">Kelola Dokumentasi</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Video "Bukti Nyata" dan foto galeri "Dokumentasi" yang tampil di halaman Kami Peduli. Perubahan langsung tampil di halaman publik.
        </p>
      </div>

      {/* ============ Video ============ */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-heading text-lg font-bold text-navy">
          Video Dokumentasi <span className="text-sm font-medium text-gray-400">({videos.length})</span>
        </h2>
        <button type="button" onClick={openAddVideo} className="btn btn-primary shrink-0">
          {IconPlus}
          Tambah Video
        </button>
      </div>

      <div className="mb-12 grid grid-cols-2 gap-6 max-[768px]:grid-cols-1">
        {videos.map((v) => (
          <div key={v.id} className="card">
            <div className="relative aspect-video overflow-hidden">
              <img src={v.image} alt={v.title} className="h-full w-full object-cover" />
              <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-coral shadow-[0_4px_20px_rgba(231,76,60,0.4)]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-[3px] h-5 w-5 text-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              {v.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white">
                  {v.badge}
                </span>
              )}
              {v.duration && (
                <span className="absolute bottom-2 right-2 rounded bg-navy-dark/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {v.duration}
                </span>
              )}
            </div>
            <div className="p-5">
              {v.date && <p className="mb-1 text-xs font-medium text-gray-400">{v.date}</p>}
              <h3 className="mb-1 font-heading text-base font-bold leading-snug text-navy">{v.title}</h3>
              {v.desc && <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-gray-500">{v.desc}</p>}
              {v.videoUrl && (
                <p className="mb-3 truncate text-xs text-primary" title={v.videoUrl}>
                  {v.videoUrl}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditVideo(v)}
                  className="flex-1 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary-dark transition-colors hover:bg-primary/20"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteVideo(v)}
                  className="flex-1 rounded-lg bg-coral/10 px-3 py-2 text-xs font-semibold text-coral transition-colors hover:bg-coral/20"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-400">
            Belum ada video. Klik "Tambah Video".
          </p>
        )}
      </div>

      {/* ============ Galeri ============ */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-heading text-lg font-bold text-navy">
          Galeri Foto <span className="text-sm font-medium text-gray-400">({galeri.length})</span>
        </h2>
        <button type="button" onClick={openAddFoto} className="btn btn-primary shrink-0">
          {IconPlus}
          Tambah Foto
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
        {galeri.map((f) => (
          <div key={f.id} className="card p-3">
            <img src={f.image} alt={f.caption} className="mb-2 aspect-square w-full rounded-lg object-cover" />
            <p className="mb-2 line-clamp-2 text-xs font-semibold text-navy">{f.caption}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openEditFoto(f)}
                className="flex-1 rounded-lg bg-primary/10 px-2 py-1.5 text-xs font-semibold text-primary-dark transition-colors hover:bg-primary/20"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteFoto(f)}
                className="flex-1 rounded-lg bg-coral/10 px-2 py-1.5 text-xs font-semibold text-coral transition-colors hover:bg-coral/20"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {galeri.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-400">
            Belum ada foto. Klik "Tambah Foto".
          </p>
        )}
      </div>

      {/* ---- Modal video ---- */}
      <AdminModal
        open={videoModal}
        onClose={() => setVideoModal(false)}
        title={videoEditId ? 'Edit Video' : 'Tambah Video'}
      >
        <form onSubmit={submitVideo} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Link Video YouTube *</label>
            <input
              type="text"
              required
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoForm.videoUrl}
              onChange={(e) => setVideoForm((f) => ({ ...f, videoUrl: e.target.value }))}
              className={inputClass}
            />
            {videoForm.videoUrl.trim() && !youtubeId(videoForm.videoUrl) && (
              <p className="mt-1 text-xs text-coral">Link YouTube tidak dikenali. Contoh: https://www.youtube.com/watch?v=XXXXXXXXXXX</p>
            )}
          </div>

          {/* Pratinjau thumbnail (otomatis dari YouTube, atau dari URL manual) */}
          {(videoForm.image.trim() || youtubeThumb(videoForm.videoUrl)) && (
            <img
              src={videoForm.image.trim() || youtubeThumb(videoForm.videoUrl)}
              alt="Pratinjau thumbnail"
              className="aspect-video w-full rounded-lg bg-gray-100 object-cover"
            />
          )}

          <div>
            <label className={labelClass}>URL Thumbnail (opsional)</label>
            <input
              type="text"
              placeholder="Kosongkan = pakai thumbnail YouTube otomatis"
              value={videoForm.image}
              onChange={(e) => setVideoForm((f) => ({ ...f, image: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kategori</label>
              <input
                type="text"
                placeholder="Contoh: Pendidikan"
                value={videoForm.badge}
                onChange={(e) => setVideoForm((f) => ({ ...f, badge: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Durasi</label>
              <input
                type="text"
                placeholder="Contoh: 4:32"
                value={videoForm.duration}
                onChange={(e) => setVideoForm((f) => ({ ...f, duration: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Judul *</label>
            <input
              type="text"
              required
              value={videoForm.title}
              onChange={(e) => setVideoForm((f) => ({ ...f, title: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Deskripsi Singkat</label>
            <textarea
              rows={3}
              value={videoForm.desc}
              onChange={(e) => setVideoForm((f) => ({ ...f, desc: e.target.value }))}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Tanggal</label>
            <input
              type="text"
              placeholder="Contoh: Desember 2024"
              value={videoForm.date}
              onChange={(e) => setVideoForm((f) => ({ ...f, date: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setVideoModal(false)}
              className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex flex-[1.4] items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark"
            >
              {videoEditId ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* ---- Modal foto ---- */}
      <AdminModal
        open={fotoModal}
        onClose={() => setFotoModal(false)}
        title={fotoEditId ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}
      >
        <form onSubmit={submitFoto} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Foto *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoFile}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary-dark hover:file:cursor-pointer hover:file:bg-primary/20"
            />
            <p className="mt-1 text-xs text-gray-400">
              Pilih file gambar dari perangkat (JPG/PNG). Otomatis diperkecil sebelum disimpan.
            </p>
            {fotoBusy && <p className="mt-1 text-xs text-primary">Memproses gambar…</p>}
            {fotoForm.image && (
              <img
                src={fotoForm.image}
                alt="Pratinjau foto"
                className="mt-2 aspect-square w-32 rounded-lg border border-gray-100 object-cover"
              />
            )}
          </div>
          <div>
            <label className={labelClass}>Keterangan *</label>
            <input
              type="text"
              required
              value={fotoForm.caption}
              onChange={(e) => setFotoForm((f) => ({ ...f, caption: e.target.value }))}
              className={inputClass}
            />
          </div>
          {fotoError && <p className="text-xs font-semibold text-coral">{fotoError}</p>}
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setFotoModal(false)}
              className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={fotoBusy}
              className="flex flex-[1.4] items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {fotoBusy ? 'Memproses…' : fotoEditId ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  )
}
