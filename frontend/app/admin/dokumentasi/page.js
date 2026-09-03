'use client'

import { useState } from 'react'
import AdminModal from '@/components/admin/AdminModal'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import { useDocVideos, useDocPhotos } from '@/services/docMedia'
import { youtubeThumb, youtubeWatchUrl, youtubeId } from '@/services/youtube'
import { uploadImage } from '@/services/imageFile'
import { toDateInputValue, formatDateID as fmtDateID } from '@/services/dateText'

const EMPTY_VIDEO = { id: null, image: '', badge: '', title: '', desc: '', videoUrl: '', date: '' }
const EMPTY_FOTO = { id: null, image: '', caption: '' }

const IconPlus = (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
  </svg>
)

// Halaman admin CRUD "Bukti Nyata" (video YouTube) & "Galeri Foto" di Kami
// Peduli. Tersimpan di tabel `doc_videos` & `doc_photos`. Teks judul/hero
// section tetap diedit inline di /admin/konten-kami-peduli.
export default function AdminDokumentasiPage() {
  const { videos, error: vErr, saveVideo, removeVideo } = useDocVideos()
  const { photos: galeri, error: gErr, savePhoto, removePhoto } = useDocPhotos()

  const [videoModal, setVideoModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)
  const [videoForm, setVideoForm] = useState(EMPTY_VIDEO)
  const [videoBusy, setVideoBusy] = useState(false)
  const [videoErr, setVideoErr] = useState('')

  const [fotoModal, setFotoModal] = useState(false)
  const [editingFoto, setEditingFoto] = useState(null)
  const [fotoForm, setFotoForm] = useState(EMPTY_FOTO)
  const [fotoBusy, setFotoBusy] = useState(false)
  const [fotoErr, setFotoErr] = useState('')

  // ---- Video ----
  const openAddVideo = () => {
    setEditingVideo(null)
    setVideoForm(EMPTY_VIDEO)
    setVideoErr('')
    setVideoModal(true)
  }
  const openEditVideo = (v) => {
    setEditingVideo(v)
    setVideoErr('')
    setVideoForm({
      id: v.id,
      image: v.image || '',
      badge: v.badge || '',
      title: v.title || '',
      desc: v.desc || '',
      videoUrl: v.videoUrl || '',
      date: toDateInputValue(v.date),
    })
    setVideoModal(true)
  }
  const submitVideo = async (e) => {
    e.preventDefault()
    const url = videoForm.videoUrl.trim()
    if (!url || !videoForm.title.trim() || videoBusy) return
    if (!youtubeId(url)) {
      setVideoErr('Link YouTube tidak dikenali.')
      return
    }
    setVideoBusy(true)
    setVideoErr('')
    try {
      // Thumbnail otomatis dari YouTube; "URL Thumbnail" hanya untuk menimpa.
      await saveVideo({
        id: editingVideo?.id ?? null,
        title: videoForm.title.trim(),
        videoUrl: youtubeWatchUrl(url),
        image: videoForm.image.trim() || youtubeThumb(url),
        badge: videoForm.badge.trim(),
        desc: videoForm.desc.trim(),
        date: videoForm.date.trim(),
      })
      setVideoModal(false)
    } catch (err) {
      setVideoErr(err.message || 'Gagal menyimpan video')
    } finally {
      setVideoBusy(false)
    }
  }
  const deleteVideo = async (v) => {
    if (!window.confirm(`Hapus video "${v.title}"?`)) return
    try {
      await removeVideo(v)
    } catch (err) {
      window.alert(err.message || 'Gagal menghapus video')
    }
  }

  // ---- Foto galeri ----
  const openAddFoto = () => {
    setEditingFoto(null)
    setFotoForm(EMPTY_FOTO)
    setFotoErr('')
    setFotoModal(true)
  }
  const openEditFoto = (f) => {
    setEditingFoto(f)
    setFotoForm({ id: f.id, image: f.image || '', caption: f.caption || '' })
    setFotoErr('')
    setFotoModal(true)
  }
  const handleFotoFile = async (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    setFotoBusy(true)
    setFotoErr('')
    try {
      const url = await uploadImage(file)
      setFotoForm((f) => ({ ...f, image: url }))
    } catch (err) {
      setFotoErr(err.message || 'Gagal mengunggah gambar')
    } finally {
      setFotoBusy(false)
    }
  }
  const submitFoto = async (e) => {
    e.preventDefault()
    if (!fotoForm.image || !fotoForm.caption.trim() || fotoBusy) {
      if (!fotoForm.image || !fotoForm.caption.trim()) setFotoErr('Pilih foto dan isi keterangan dulu.')
      return
    }
    setFotoBusy(true)
    setFotoErr('')
    try {
      await savePhoto({
        id: editingFoto?.id ?? null,
        image: fotoForm.image,
        caption: fotoForm.caption.trim(),
      })
      setFotoModal(false)
    } catch (err) {
      setFotoErr(err.message || 'Gagal menyimpan foto')
    } finally {
      setFotoBusy(false)
    }
  }
  const deleteFoto = async (f) => {
    if (!window.confirm(`Hapus foto "${f.caption}"?`)) return
    try {
      await removePhoto(f)
    } catch (err) {
      window.alert(err.message || 'Gagal menghapus foto')
    }
  }

  // Lebih dari 4 item → tampilkan sebagai baris geser (scroll-snap), bukan
  // grid yang makin memanjang ke bawah.
  const slideVideos = videos.length > 4
  const slidePhotos = galeri.length > 4
  const slideRow = 'no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2'

  const renderVideoCard = (v) => (
    <div key={v.id} className={`card ${slideVideos ? 'w-[min(340px,75vw)] shrink-0 snap-start' : ''}`}>
      <div className="relative aspect-video overflow-hidden">
        {v.image && <img src={v.image} alt={v.title} className="h-full w-full object-cover" />}
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
      </div>
      <div className="p-5">
        {v.date && <p className="mb-1 text-xs font-medium text-gray-400">{fmtDateID(v.date)}</p>}
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
  )

  const renderPhotoCard = (f) => (
    <div key={f.id} className={`card p-3 ${slidePhotos ? 'w-[170px] shrink-0 snap-start' : ''}`}>
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
  )

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Kelola Konten</p>
        <h1 className="font-heading text-xl font-bold text-navy">Kelola Dokumentasi</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-gray-500">
          Video "Bukti Nyata" & foto galeri "Dokumentasi" yang tampil di halaman Kami Peduli.
        </p>
      </div>

      {(vErr || gErr) && (
        <p className="mb-4 rounded-lg bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
          Gagal memuat data: {vErr || gErr}. Pastikan backend jalan di :3001.
        </p>
      )}

      {/* ============ Video ============ */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-lg font-bold text-navy">
          Video Dokumentasi <span className="text-sm font-medium text-gray-400">({videos.length})</span>
        </h2>
        <button type="button" onClick={openAddVideo} className="btn btn-primary shrink-0 self-start sm:self-auto">
          {IconPlus}
          Tambah Video
        </button>
      </div>

      {videos.length === 0 ? (
        <p className="mb-12 rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-400">
          Belum ada video. Klik "Tambah Video".
        </p>
      ) : slideVideos ? (
        <div className={`mb-12 ${slideRow}`}>{videos.map(renderVideoCard)}</div>
      ) : (
        <div className="mb-12 grid grid-cols-2 gap-6 max-[768px]:grid-cols-1">{videos.map(renderVideoCard)}</div>
      )}

      {/* ============ Galeri ============ */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-lg font-bold text-navy">
          Galeri Foto <span className="text-sm font-medium text-gray-400">({galeri.length})</span>
        </h2>
        <button type="button" onClick={openAddFoto} className="btn btn-primary shrink-0 self-start sm:self-auto">
          {IconPlus}
          Tambah Foto
        </button>
      </div>

      {galeri.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-400">
          Belum ada foto. Klik "Tambah Foto".
        </p>
      ) : slidePhotos ? (
        <div className={slideRow}>{galeri.map(renderPhotoCard)}</div>
      ) : (
        <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
          {galeri.map(renderPhotoCard)}
        </div>
      )}

      {/* ---- Modal video ---- */}
      <AdminModal open={videoModal} onClose={() => setVideoModal(false)} title={editingVideo ? 'Edit Video' : 'Tambah Video'}>
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
              <label className={labelClass}>Tanggal Dibuat</label>
              <input
                type="date"
                value={videoForm.date}
                onChange={(e) => setVideoForm((f) => ({ ...f, date: e.target.value }))}
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
          {videoErr && <p className="text-xs font-semibold text-coral">{videoErr}</p>}
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
              disabled={videoBusy}
              className="flex flex-[1.4] items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {videoBusy ? 'Menyimpan…' : editingVideo ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* ---- Modal foto ---- */}
      <AdminModal open={fotoModal} onClose={() => setFotoModal(false)} title={editingFoto ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}>
        <form onSubmit={submitFoto} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Foto *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoFile}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary-dark hover:file:cursor-pointer hover:file:bg-primary/20"
            />
            <p className="mt-1 text-xs text-gray-400">JPG/PNG — otomatis diperkecil & diunggah ke storage.</p>
            {fotoBusy && <p className="mt-1 text-xs text-primary">Memproses…</p>}
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
          {fotoErr && <p className="text-xs font-semibold text-coral">{fotoErr}</p>}
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
              {fotoBusy ? 'Menyimpan…' : editingFoto ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  )
}
