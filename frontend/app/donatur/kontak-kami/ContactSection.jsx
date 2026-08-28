'use client'

import { useState } from 'react'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import EditableText from '@/components/inline-edit/EditableText'
import { useEditMode } from '@/components/inline-edit/EditModeContext'
import { AddItemButton, DeleteItemButton } from '@/components/inline-edit/EditControls'
import { useKontakContent, kontakHref } from './kontakData'

const ICONS = {
  alamat: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  ),
  telepon: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
  jam: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.41V7a1 1 0 00-2 0v6a1 1 0 00.29.71l3.5 3.5a1 1 0 001.42-1.42L13 12.41z" />
    </svg>
  ),
}

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-primary focus:bg-white'

export default function ContactSection() {
  const [form, setForm] = useState({ nama: '', email: '', pesan: '' })
  const { content, patch, patchInfo, addInfo, removeInfo } = useKontakContent()
  const { isAdmin } = useEditMode()
  const h = content.hero

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  //ini untuk membuka aplikasi email pengguna dengan isi pesan yang sudah diisi, karena situs ini belum punya endpoint backend untuk mengirim pesan
  const handleSubmit = (e) => {
    e.preventDefault()
    const tujuan = content.info.find((i) => i.type === 'email')?.value || 'lazis@plnbatam.co.id'
    const subject = encodeURIComponent(`Pesan dari ${form.nama || 'Donatur'} — Website Lazis PLN Batam`)
    const body = encodeURIComponent(`Nama: ${form.nama}\nEmail: ${form.email}\n\nPesan:\n${form.pesan}`)
    window.location.href = `mailto:${tujuan}?subject=${subject}&body=${body}`
  }

  return (
    <>
      <PageHeroBackground id="kontak-hero" className="pb-10 pt-32">
        <div className="container">
          <EditableText
            as="p"
            className="section-label !text-gold"
            value={h.label}
            onSave={(v) => patch('hero', { label: v })}
            label="label Kontak Kami"
          />
          <h1 className="mb-4 max-w-[640px] font-heading text-4xl font-semibold leading-[1.15] text-white max-[600px]:text-3xl">
            <EditableText
              as="span"
              value={h.titleMain}
              onSave={(v) => patch('hero', { titleMain: v })}
              label="judul"
            />{' '}
            <EditableText
              as="span"
              className="italic text-gold"
              value={h.titleHighlight}
              onSave={(v) => patch('hero', { titleHighlight: v })}
              label="kata yang ditonjolkan"
            />
          </h1>
          <EditableText
            as="p"
            className="max-w-[560px] leading-[1.7] text-white/80"
            value={h.description}
            onSave={(v) => patch('hero', { description: v })}
            label="paragraf pengantar"
            multiline
          />
        </div>
      </PageHeroBackground>

      <section className="bg-gray-50 py-10">
        <div className="container grid grid-cols-[0.9fr_1.1fr] items-start gap-8 max-[900px]:grid-cols-1">
          {/* Kiri: informasi kontak */}
          <div className="flex flex-col gap-4">
            {content.info.map((item) => {
              const href = kontakHref(item)
              const inner = (
                <div className="card flex items-start gap-4 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {ICONS[item.type] || ICONS.alamat}
                  </span>
                  <div className="min-w-0 flex-1">
                    <EditableText
                      as="p"
                      className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-400"
                      value={item.label}
                      onSave={(v) => patchInfo(item.id, { label: v })}
                      label="label kontak"
                    />
                    <EditableText
                      as="p"
                      className="mt-1 text-sm font-medium leading-relaxed text-navy"
                      value={item.value}
                      onSave={(v) => patchInfo(item.id, { value: v })}
                      label="isi kontak"
                      multiline
                    />
                    {isAdmin && (
                      <DeleteItemButton
                        className="mt-2"
                        label="Hapus kontak ini"
                        onClick={() => removeInfo(item.id)}
                      />
                    )}
                  </div>
                </div>
              )
              // Di mode edit, jangan bungkus <a> supaya klik = edit, bukan pindah.
              return href && !isAdmin ? (
                <a key={item.id} href={href} className="block transition-transform hover:-translate-y-0.5">
                  {inner}
                </a>
              ) : (
                <div key={item.id}>{inner}</div>
              )
            })}
            {isAdmin && <AddItemButton label="Tambah kontak" onClick={addInfo} />}
          </div>

          {/* Kanan: formulir pesan */}
          <div className="card p-5">
            <EditableText
              as="h3"
              className="mb-1.5 font-heading text-lg font-bold text-navy"
              value={content.form.title}
              onSave={(v) => patch('form', { title: v })}
              label="judul formulir"
            />
            <EditableText
              as="p"
              className="mb-3 text-xs leading-relaxed text-gray-500"
              value={content.form.description}
              onSave={(v) => patch('form', { description: v })}
              label="keterangan formulir"
              multiline
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <div>
                <label htmlFor="nama" className="mb-1 block text-xs font-semibold text-gray-500">
                  Nama Lengkap
                </label>
                <input
                  id="nama"
                  name="nama"
                  type="text"
                  required
                  placeholder="Masukkan nama kamu"
                  value={form.nama}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-500">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="pesan" className="mb-1 block text-xs font-semibold text-gray-500">
                  Pesan
                </label>
                <textarea
                  id="pesan"
                  name="pesan"
                  required
                  rows={2}
                  placeholder="Tulis pesan atau pertanyaan kamu di sini"
                  value={form.pesan}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full justify-center">
                <EditableText
                  value={content.form.buttonLabel}
                  onSave={(v) => patch('form', { buttonLabel: v })}
                  label="teks tombol kirim"
                />
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
