'use client'

import { useState } from 'react'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { inputClass, labelClass } from '@/components/admin/adminFormStyles'
import { BLOCK_TYPES, newBlock } from '@/services/pageBlocks'
import { uploadImage } from '@/services/imageFile'
import { toast, confirmDialog } from '@/components/ui/feedback'

const fileInputClass =
  'block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary-dark hover:file:cursor-pointer hover:file:bg-primary/20'

function Field({ label, hint, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-gray-500">{hint}</p>}
    </div>
  )
}

function TextIn({ value, onChange, placeholder, multiline }) {
  return multiline ? (
    <textarea
      rows={2}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputClass} resize-none`}
    />
  ) : (
    <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
  )
}

function ImagePick({ value, onChange, label = 'Gambar' }) {
  const [busy, setBusy] = useState(false)
  const pick = async (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setBusy(true)
    try {
      onChange(await uploadImage(f))
    } catch (er) {
      toast(er.message || 'Gagal mengunggah', { tone: 'error' })
    } finally {
      setBusy(false)
    }
  }
  return (
    <Field label={label}>
      {value ? (
        <div className="flex items-center gap-3">
          <img width="128" height="80" src={value} alt="" className="h-20 w-32 rounded-lg border border-gray-100 object-cover" />
          <button type="button" onClick={() => onChange('')} className="text-xs font-semibold text-coral-dark hover:text-coral-dark">
            Hapus gambar
          </button>
        </div>
      ) : null}
      <input type="file" accept="image/*" onChange={pick} className={`${fileInputClass} ${value ? 'mt-2' : ''}`} />
      {busy && <p className="mt-1 text-xs text-primary">Mengunggah…</p>}
    </Field>
  )
}

// Daftar item yang bisa ditambah/dihapus (kartu, langkah, FAQ, angka, rekening).
function ListEditor({ items = [], onChange, make, addLabel, max = 12, children }) {
  const set = (i, patch) => onChange(items.map((x, idx) => (idx === i ? { ...x, ...patch } : x)))
  const del = (i) => onChange(items.filter((_, idx) => idx !== i))
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const next = items.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="flex flex-col gap-2">
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border border-gray-100 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500">#{i + 1}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="rounded px-1.5 text-xs text-gray-500 hover:bg-gray-100">▲</button>
              <button type="button" onClick={() => move(i, 1)} className="rounded px-1.5 text-xs text-gray-500 hover:bg-gray-100">▼</button>
              <button type="button" onClick={() => del(i)} className="rounded bg-coral/10 px-2 text-[11px] font-bold text-coral-dark hover:bg-coral/20">
                Hapus
              </button>
            </div>
          </div>
          {children(it, (patch) => set(i, patch), i)}
        </div>
      ))}
      {items.length < max && (
        <button
          type="button"
          onClick={() => onChange([...items, make()])}
          className="self-start rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary-dark hover:bg-primary/20"
        >
          + {addLabel}
        </button>
      )}
    </div>
  )
}

const EMOJI = ['✨', '🤝', '💛', '🌱', '📚', '🏥', '🍚', '🕌', '🔍', '⚡', '✅', '📣', '🎓', '🏠']

// Form isi per jenis bagian.
function BlockFields({ block, set }) {
  const p = block.props
  const up = (patch) => set({ ...p, ...patch })

  switch (block.type) {
    case 'hero':
      return (
        <div className="flex flex-col gap-3">
          <Field label="Label kecil di atas judul" hint="Kosongkan untuk memakai nama menu.">
            <TextIn value={p.eyebrow} onChange={(v) => up({ eyebrow: v })} placeholder="mis. Program" />
          </Field>
          <Field label="Judul besar">
            <TextIn value={p.title} onChange={(v) => up({ title: v })} />
          </Field>
          <Field label="Kalimat pendukung">
            <TextIn multiline value={p.subtitle} onChange={(v) => up({ subtitle: v })} />
          </Field>
          <ImagePick label="Gambar di samping judul (opsional)" value={p.image} onChange={(v) => up({ image: v })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Teks tombol (opsional)">
              <TextIn value={p.ctaLabel} onChange={(v) => up({ ctaLabel: v })} placeholder="mis. Donasi Sekarang" />
            </Field>
            <Field label="Tujuan tombol" hint="Mis. #donasi (turun ke bagian donasi) atau /donatur/program">
              <TextIn value={p.ctaHref} onChange={(v) => up({ ctaHref: v })} placeholder="#donasi" />
            </Field>
          </div>
        </div>
      )

    case 'text':
      return (
        <div className="flex flex-col gap-3">
          <Field label="Judul bagian (opsional)">
            <TextIn value={p.heading} onChange={(v) => up({ heading: v })} />
          </Field>
          <Field label="Isi">
            <RichTextEditor value={p.html || ''} onChange={(v) => up({ html: v })} />
          </Field>
        </div>
      )

    case 'image':
      return (
        <div className="flex flex-col gap-3">
          <ImagePick value={p.src} onChange={(v) => up({ src: v })} />
          <Field label="Keterangan gambar (opsional)">
            <TextIn value={p.caption} onChange={(v) => up({ caption: v })} />
          </Field>
        </div>
      )

    case 'features':
      return (
        <div className="flex flex-col gap-3">
          <Field label="Judul bagian (opsional)">
            <TextIn value={p.heading} onChange={(v) => up({ heading: v })} />
          </Field>
          <ListEditor items={p.items} onChange={(items) => up({ items })} make={() => ({ icon: '✨', title: '', desc: '' })} addLabel="Tambah kartu" max={6}>
            {(it, setIt) => (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-1">
                  {EMOJI.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setIt({ icon: e })}
                      className={`h-8 w-8 rounded-lg text-lg ${it.icon === e ? 'bg-primary/15 ring-1 ring-primary' : 'hover:bg-gray-100'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <TextIn value={it.title} onChange={(v) => setIt({ title: v })} placeholder="Judul kartu" />
                <TextIn multiline value={it.desc} onChange={(v) => setIt({ desc: v })} placeholder="Penjelasan singkat" />
              </div>
            )}
          </ListEditor>
        </div>
      )

    case 'stats':
      return (
        <ListEditor items={p.items} onChange={(items) => up({ items })} make={() => ({ value: '', label: '' })} addLabel="Tambah angka" max={4}>
          {(it, setIt) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <TextIn value={it.value} onChange={(v) => setIt({ value: v })} placeholder="Angka, mis. 1.200+" />
              <TextIn value={it.label} onChange={(v) => setIt({ label: v })} placeholder="Keterangan, mis. Donatur" />
            </div>
          )}
        </ListEditor>
      )

    case 'steps':
      return (
        <div className="flex flex-col gap-3">
          <Field label="Judul bagian (opsional)">
            <TextIn value={p.heading} onChange={(v) => up({ heading: v })} />
          </Field>
          <ListEditor items={p.items} onChange={(items) => up({ items })} make={() => ({ title: '', desc: '' })} addLabel="Tambah langkah" max={8}>
            {(it, setIt) => (
              <div className="flex flex-col gap-2">
                <TextIn value={it.title} onChange={(v) => setIt({ title: v })} placeholder="Judul langkah" />
                <TextIn multiline value={it.desc} onChange={(v) => setIt({ desc: v })} placeholder="Penjelasan" />
              </div>
            )}
          </ListEditor>
        </div>
      )

    case 'gallery':
      return (
        <div className="flex flex-col gap-3">
          <Field label="Judul bagian (opsional)">
            <TextIn value={p.heading} onChange={(v) => up({ heading: v })} />
          </Field>
          <GalleryPicker images={p.images || []} onChange={(images) => up({ images })} />
        </div>
      )

    case 'faq':
      return (
        <div className="flex flex-col gap-3">
          <Field label="Judul bagian (opsional)">
            <TextIn value={p.heading} onChange={(v) => up({ heading: v })} />
          </Field>
          <ListEditor items={p.items} onChange={(items) => up({ items })} make={() => ({ q: '', a: '' })} addLabel="Tambah pertanyaan" max={12}>
            {(it, setIt) => (
              <div className="flex flex-col gap-2">
                <TextIn value={it.q} onChange={(v) => setIt({ q: v })} placeholder="Pertanyaan" />
                <TextIn multiline value={it.a} onChange={(v) => setIt({ a: v })} placeholder="Jawaban" />
              </div>
            )}
          </ListEditor>
        </div>
      )

    case 'donate':
      return (
        <div className="flex flex-col gap-3">
          <Field label="Judul ajakan">
            <TextIn value={p.heading} onChange={(v) => up({ heading: v })} />
          </Field>
          <Field label="Kalimat ajakan">
            <TextIn multiline value={p.text} onChange={(v) => up({ text: v })} />
          </Field>
          <Field label="Teks tombol">
            <TextIn value={p.buttonLabel} onChange={(v) => up({ buttonLabel: v })} />
          </Field>
          <Field label="Rekening donasi" hint="Tampil sebagai kartu rekening dan dipakai di formulir Donasi.">
            <ListEditor items={p.banks} onChange={(banks) => up({ banks })} make={() => ({ name: '', noRek: '', owner: '' })} addLabel="Tambah rekening" max={6}>
              {(it, setIt) => (
                <div className="grid gap-2 sm:grid-cols-3">
                  <TextIn value={it.name} onChange={(v) => setIt({ name: v })} placeholder="Bank (mis. BSI)" />
                  <TextIn value={it.noRek} onChange={(v) => setIt({ noRek: v })} placeholder="Nomor rekening" />
                  <TextIn value={it.owner} onChange={(v) => setIt({ owner: v })} placeholder="a.n. pemilik" />
                </div>
              )}
            </ListEditor>
          </Field>
        </div>
      )

    case 'cta':
      return (
        <div className="flex flex-col gap-3">
          <Field label="Judul">
            <TextIn value={p.heading} onChange={(v) => up({ heading: v })} />
          </Field>
          <Field label="Kalimat">
            <TextIn multiline value={p.text} onChange={(v) => up({ text: v })} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Teks tombol">
              <TextIn value={p.buttonLabel} onChange={(v) => up({ buttonLabel: v })} />
            </Field>
            <Field label="Tujuan tombol">
              <TextIn value={p.buttonHref} onChange={(v) => up({ buttonHref: v })} placeholder="/donatur/kontak-kami" />
            </Field>
          </div>
        </div>
      )

    default:
      return null
  }
}

function GalleryPicker({ images, onChange }) {
  const [busy, setBusy] = useState(false)
  const add = async (e) => {
    const files = [...(e.target.files || [])]
    e.target.value = ''
    if (!files.length) return
    setBusy(true)
    try {
      const urls = []
      for (const f of files) urls.push(await uploadImage(f))
      onChange([...images, ...urls])
    } catch (er) {
      toast(er.message || 'Gagal mengunggah', { tone: 'error' })
    } finally {
      setBusy(false)
    }
  }
  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={add} className={fileInputClass} />
      {busy && <p className="mt-1 text-xs text-primary">Mengunggah…</p>}
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((u, i) => (
            <div key={i} className="relative">
              <img width="200" height="200" src={u} alt="" className="aspect-square w-full rounded-lg border border-gray-100 object-cover" />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 rounded-full bg-navy/80 px-1.5 py-0.5 text-[10px] font-bold text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Ringkasan satu baris isi blok (tampil saat kartu blok dilipat).
function summaryOf(b) {
  const p = b.props || {}
  return (
    p.title || p.heading || p.caption || (p.items?.[0] && (p.items[0].title || p.items[0].value || p.items[0].q)) ||
    (p.images?.length ? `${p.images.length} foto` : '') ||
    ''
  )
}

export default function BlocksEditor({ blocks, onChange }) {
  const [open, setOpen] = useState(() => new Set())
  const [adding, setAdding] = useState(false)

  const toggleOpen = (id) =>
    setOpen((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  const patch = (id, fn) => onChange(blocks.map((b) => (b.id === id ? fn(b) : b)))
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= blocks.length) return
    const next = blocks.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const add = (type) => {
    const b = newBlock(type)
    onChange([...blocks, b])
    setOpen((s) => new Set(s).add(b.id))
    setAdding(false)
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] text-gray-500">
          Halaman tersusun dari <b>bagian-bagian</b> berurutan. Klik bagian untuk mengisi, ▲▼ untuk memindah, 👁 untuk
          menyembunyikan tanpa menghapus.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(new Set(blocks.map((b) => b.id)))}
            className="text-xs font-semibold text-primary hover:text-primary-dark"
          >
            Buka semua
          </button>
          <button type="button" onClick={() => setOpen(new Set())} className="text-xs font-semibold text-gray-500 hover:text-gray-600">
            Tutup semua
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {blocks.map((b, i) => {
          const def = BLOCK_TYPES[b.type]
          if (!def) return null
          const isOpen = open.has(b.id)
          const hidden = b.visible === false
          return (
            <div
              key={b.id}
              className={`overflow-hidden rounded-xl border bg-white transition-colors ${
                isOpen ? 'border-primary/40 shadow-sm' : 'border-gray-200'
              } ${hidden ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-2 px-3 py-2.5">
                <button type="button" onClick={() => toggleOpen(b.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg">{def.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-navy">
                      {def.label}
                      {hidden && <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">Disembunyikan</span>}
                    </span>
                    <span className="block truncate text-[12px] text-gray-500">{summaryOf(b) || def.desc}</span>
                  </span>
                  <span className={`ml-auto text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button type="button" title="Naik" disabled={i === 0} onClick={() => move(i, -1)} className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30">▲</button>
                  <button type="button" title="Turun" disabled={i === blocks.length - 1} onClick={() => move(i, 1)} className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30">▼</button>
                  <button
                    type="button"
                    title={hidden ? 'Tampilkan' : 'Sembunyikan'}
                    onClick={() => patch(b.id, (x) => ({ ...x, visible: x.visible === false }))}
                    className="h-8 w-8 rounded-lg hover:bg-gray-100"
                  >
                    {hidden ? '🙈' : '👁'}
                  </button>
                  <button
                    type="button"
                    title="Hapus bagian"
                    onClick={async () => {
                      const ok = await confirmDialog({
                        title: 'Hapus bagian?',
                        message: `Bagian "${def.label}" dihapus dari halaman ini.`,
                        confirmLabel: 'Hapus',
                      })
                      if (ok) onChange(blocks.filter((x) => x.id !== b.id))
                    }}
                    className="h-8 w-8 rounded-lg text-coral-dark hover:bg-coral/10"
                  >
                    🗑
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="border-t border-gray-100 bg-gray-50/60 p-4">
                  <BlockFields block={b} set={(props) => patch(b.id, (x) => ({ ...x, props }))} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4">
        {!adding ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="w-full rounded-xl border-2 border-dashed border-primary/40 py-3 text-sm font-bold text-primary-dark transition-colors hover:bg-primary/5"
          >
            + Tambah Bagian
          </button>
        ) : (
          <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.06em] text-gray-500">Pilih jenis bagian</p>
              <button type="button" onClick={() => setAdding(false)} className="text-xs font-semibold text-gray-500 hover:text-gray-600">
                Batal
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(BLOCK_TYPES).map(([type, def]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => add(type)}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-primary hover:shadow-sm"
                >
                  <span className="text-2xl">{def.icon}</span>
                  <span>
                    <span className="block text-sm font-bold text-navy">{def.label}</span>
                    <span className="block text-[11px] leading-snug text-gray-500">{def.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
