'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { uploadImage } from '@/services/imageFile'
import { fetchMenu, saveMenuPage } from '@/services/menus'
import { fetchBankAccounts } from '@/services/bankAccounts'
import { toast } from '@/components/ui/feedback'

const TEMPLATE_LABEL = { text: 'Teks Biasa', blog: 'Blog', program: 'Program' }

export default function EditMenuContentPage() {
  const { id } = useParams()

  const [menu, setMenu] = useState(null)
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const [title, setTitle] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [data, setData] = useState({}) // field khusus template (blog/program)
  const [imgBusy, setImgBusy] = useState(false)
  const [busy, setBusy] = useState(false)
  const [existingBanks, setExistingBanks] = useState([]) // rekening yang sudah ada di sistem

  const tt = menu?.templateType

  useEffect(() => {
    if (tt === 'program') fetchBankAccounts().then(setExistingBanks).catch(() => {})
  }, [tt])

  useEffect(() => {
    fetchMenu(id, { preview: true })
      .then(({ menu, page }) => {
        setMenu(menu)
        setPage(page)
        setTitle(page?.title || menu?.name || '')
        setHeroImage(page?.heroImage || '')
        setBodyHtml(page?.bodyHtml || '')
        setData(page?.data || {})
      })
      .catch((e) => setErr(e.message || 'Gagal memuat'))
      .finally(() => setLoading(false))
  }, [id])

  const setD = (patch) => setData((d) => ({ ...d, ...patch }))

  const persist = async (status) => {
    if (busy) return
    setBusy(true)
    try {
      const saved = await saveMenuPage(id, { title, heroImage, bodyHtml, data, status })
      setPage(saved)
      toast(status === 'published' ? 'Halaman dipublikasikan.' : 'Draft disimpan.', { tone: 'success' })
      return saved
    } catch (e) {
      toast(e.body?.error || e.message || 'Gagal menyimpan.', { tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  const onPreview = async () => {
    await persist(page?.status === 'published' ? 'published' : 'draft')
    window.open(`/donatur/${menu.slug}?preview=1`, '_blank', 'noopener')
  }

  const uploadTo = async (file, set) => {
    setImgBusy(true)
    try {
      set(await uploadImage(file))
    } catch (er) {
      toast(er.message || 'Gagal mengunggah', { tone: 'error' })
    } finally {
      setImgBusy(false)
    }
  }
  const onHeroFile = (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (f) uploadTo(f, setHeroImage)
  }
  const onGalleryFile = (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (f) uploadTo(f, (url) => setD({ gallery: [...(data.gallery || []), url] }))
  }
  const removeGalleryAt = (i) =>
    setD({ gallery: (data.gallery || []).filter((_, idx) => idx !== i) })

  // ---- rekening donasi per halaman program (data.banks) ----
  const banks = Array.isArray(data.banks) ? data.banks : []
  const setBanks = (list) => setD({ banks: list })
  const addBankRow = (preset = { name: '', noRek: '', owner: '' }) =>
    setBanks([...banks, { name: preset.name || '', noRek: preset.noRek || '', owner: preset.owner || '' }])
  const patchBankRow = (i, patch) => setBanks(banks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)))
  const removeBankRow = (i) => setBanks(banks.filter((_, idx) => idx !== i))

  if (loading) return <p className="py-16 text-center text-sm text-gray-400">Memuat editor…</p>
  if (err || !menu)
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-semibold text-coral">{err || 'Menu tidak ditemukan.'}</p>
        <Link href="/admin/manajemen-menu" className="mt-3 inline-block text-xs font-semibold text-primary">
          ← Kembali ke Manajemen Menu
        </Link>
      </div>
    )

  const fileInputClass =
    'block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary-dark hover:file:cursor-pointer hover:file:bg-primary/20'

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/admin/manajemen-menu" className="text-xs font-semibold text-primary hover:text-primary-dark">
            ← Manajemen Menu
          </Link>
          <h1 className="mt-1 font-heading text-xl font-bold text-navy">Edit Konten — {menu.name}</h1>
          <p className="mt-1 text-[13px] text-gray-500">
            Template: <b>{TEMPLATE_LABEL[tt] || tt}</b> · URL:{' '}
            <code className="text-primary-dark">/donatur/{menu.slug}</code> · Status:{' '}
            <span className={page?.status === 'published' ? 'font-semibold text-primary-dark' : 'font-semibold text-amber-600'}>
              {page?.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => persist('draft')}
            disabled={busy}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            Simpan Draft
          </button>
          <button
            type="button"
            onClick={onPreview}
            disabled={busy}
            className="rounded-xl border border-primary/30 px-4 py-2.5 text-sm font-bold text-primary-dark transition-all hover:bg-primary/5 disabled:opacity-50"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => persist('published')}
            disabled={busy}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:opacity-50"
          >
            {busy ? 'Menyimpan…' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>{tt === 'program' ? 'Judul Program' : 'Judul Halaman'}</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>
            {tt === 'blog' ? 'Thumbnail / Gambar' : tt === 'program' ? 'Gambar / Thumbnail' : 'Gambar Utama (opsional)'}
          </label>
          <input type="file" accept="image/*" onChange={onHeroFile} className={fileInputClass} />
          {imgBusy && <p className="mt-1 text-xs text-primary">Mengunggah…</p>}
          {heroImage && (
            <div className="mt-2 flex items-center gap-3">
              <img src={heroImage} alt="" className="h-20 w-32 rounded-lg border border-gray-100 object-cover" />
              <button type="button" onClick={() => setHeroImage('')} className="text-xs font-semibold text-coral hover:text-coral-dark">
                Hapus gambar
              </button>
            </div>
          )}
        </div>

        {/* ---- Field khusus BLOG ---- */}
        {tt === 'blog' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Kategori</label>
              <input
                type="text"
                value={data.category || ''}
                onChange={(e) => setD({ category: e.target.value })}
                className={inputClass}
                placeholder="mis. Kegiatan"
              />
            </div>
            <div>
              <label className={labelClass}>Penulis</label>
              <input
                type="text"
                value={data.author || ''}
                onChange={(e) => setD({ author: e.target.value })}
                className={inputClass}
                placeholder="Tim LAZIS PLN Batam"
              />
            </div>
            <div>
              <label className={labelClass}>Tanggal</label>
              <input
                type="date"
                value={data.date || ''}
                onChange={(e) => setD({ date: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* ---- Field khusus PROGRAM ---- */}
        {tt === 'program' && (
          <>
            <div>
              <label className={labelClass}>Ringkasan / Deskripsi Singkat</label>
              <textarea
                rows={2}
                value={data.desc || ''}
                onChange={(e) => setD({ desc: e.target.value })}
                className={`${inputClass} resize-none`}
                placeholder="Kalimat singkat yang tampil di bagian atas halaman program."
              />
            </div>
            <div>
              <label className={labelClass}>Tujuan Program</label>
              <textarea
                rows={3}
                value={data.tujuan || ''}
                onChange={(e) => setD({ tujuan: e.target.value })}
                className={`${inputClass} resize-none`}
                placeholder="Apa yang ingin dicapai program ini."
              />
            </div>
          </>
        )}

        <div>
          <label className={labelClass}>
            {tt === 'blog' ? 'Isi Artikel' : tt === 'program' ? 'Isi / Detail Program' : 'Isi Halaman'}
          </label>
          <RichTextEditor value={bodyHtml} onChange={setBodyHtml} />
        </div>

        {/* ---- Rekening Donasi (PROGRAM) — tampil sebagai kotak "Donasi via
             Transfer" di halaman publik, seperti di Daftar Program ---- */}
        {tt === 'program' && (
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-gray-400">
                Rekening Donasi (No. Rekening)
              </p>
              <div className="flex items-center gap-2">
                {existingBanks.length > 0 && (
                  <select
                    value=""
                    onChange={(e) => {
                      const b = existingBanks.find((x) => String(x.id) === e.target.value)
                      if (b) addBankRow({ name: b.name, noRek: b.noRek, owner: b.owner })
                    }}
                    className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-[11px]"
                    title="Ambil dari rekening yang sudah ada di sistem"
                  >
                    <option value="">+ Ambil dari rekening yang ada…</option>
                    {existingBanks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} · {b.noRek}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  type="button"
                  onClick={() => addBankRow()}
                  className="h-8 rounded-lg bg-primary/10 px-3 text-[11px] font-bold text-primary-dark hover:bg-primary/20"
                >
                  + Tambah rekening
                </button>
              </div>
            </div>
            {banks.length === 0 ? (
              <p className="text-xs text-gray-400">
                Belum ada rekening. Kalau diisi, halaman publik akan menampilkan kotak
                &ldquo;Donasi via Transfer&rdquo;.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {banks.map((b, i) => (
                  <div key={i} className="grid grid-cols-1 gap-2 rounded-lg bg-white p-2 sm:grid-cols-[1fr_1.2fr_1fr_auto]">
                    <input
                      type="text"
                      value={b.name}
                      onChange={(e) => patchBankRow(i, { name: e.target.value })}
                      placeholder="Nama bank (mis. BSI)"
                      className="rounded border border-gray-200 px-2 py-1.5 text-[13px] text-navy"
                    />
                    <input
                      type="text"
                      value={b.noRek}
                      onChange={(e) => patchBankRow(i, { noRek: e.target.value })}
                      placeholder="Nomor rekening"
                      className="rounded border border-gray-200 px-2 py-1.5 text-[13px] font-semibold text-navy"
                    />
                    <input
                      type="text"
                      value={b.owner}
                      onChange={(e) => patchBankRow(i, { owner: e.target.value })}
                      placeholder="a.n. (pemilik)"
                      className="rounded border border-gray-200 px-2 py-1.5 text-[13px] text-navy"
                    />
                    <button
                      type="button"
                      onClick={() => removeBankRow(i)}
                      className="rounded bg-coral/10 px-2.5 py-1.5 text-[11px] font-bold text-coral hover:bg-coral/20"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---- Galeri dokumentasi (PROGRAM) ---- */}
        {tt === 'program' && (
          <div>
            <label className={labelClass}>Dokumentasi / Galeri Gambar</label>
            <input type="file" accept="image/*" onChange={onGalleryFile} className={fileInputClass} />
            {(data.gallery || []).length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {data.gallery.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="aspect-square w-full rounded-lg border border-gray-100 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryAt(i)}
                      className="absolute right-1 top-1 rounded-full bg-navy/80 px-1.5 py-0.5 text-[10px] font-bold text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---- SEO (BLOG) ---- */}
        {tt === 'blog' && (
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-400">SEO</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelClass}>SEO Title</label>
                <input
                  type="text"
                  value={data.seoTitle || ''}
                  onChange={(e) => setD({ seoTitle: e.target.value })}
                  className={inputClass}
                  placeholder="Judul untuk tab browser & hasil pencarian"
                />
              </div>
              <div>
                <label className={labelClass}>SEO Description</label>
                <textarea
                  rows={2}
                  value={data.seoDesc || ''}
                  onChange={(e) => setD({ seoDesc: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder="Ringkasan 1–2 kalimat untuk hasil pencarian."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
