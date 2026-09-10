'use client'

import { useEffect, useState } from 'react'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import EditableText from '@/components/inline-edit/EditableText'
import EditableRichText from '@/components/inline-edit/EditableRichText'
import { useEditMode } from '@/components/inline-edit/EditModeContext'
import { AddItemButton, DeleteItemButton } from '@/components/inline-edit/EditControls'
import { useKontakContent, kontakHref } from './kontakData'
import { sendContactMessage } from '@/services/contactMessages'

// Tautan resmi UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (BPK).
const PDP_URL = 'https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022'

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
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm5.3 14c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1-.4-.1-1-.3-1.6-.6-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.4-1.1-2.7s.7-1.9 1-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.5.1.3.6 1 1.4 1.7 1 .9 1.8 1.1 2 1.2.3.1.4.1.6-.1l.7-.8c.2-.2.3-.2.5-.1l1.8.9c.2.1.4.2.5.3.1.2.1.7-.1 1.3z" />
    </svg>
  ),
}

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-primary focus:bg-white'

function ShieldIcon({ className = '', size = 20 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
    >
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

// Pop-up persetujuan pelindungan data pribadi — tampil saat pengunjung
// hendak menulis pesan. Isi pesan baru bisa ditulis setelah menekan "Setuju".
function ConsentModal({ open, onClose, onAgree }) {
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    if (!open) setChecked(false)
  }, [open])
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-navy-dark/70 p-3 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="no-scrollbar max-h-[90vh] w-full max-w-[440px] animate-fade-in-up overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_32px_70px_-24px_rgba(6,30,40,0.55)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdp-title"
      >
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
          <ShieldIcon size={22} />
        </span>
        <h3 id="pdp-title" className="font-heading text-lg font-bold text-navy">
          Pelindungan Data Pribadi
        </h3>
        <p className="mt-1.5 text-[13px] leading-[1.7] text-gray-600">
          Sebelum mengirim pesan, kami perlu persetujuanmu. Data yang kamu isi
          (<b>nama</b>, <b>email</b>, <b>no. HP</b>, dan <b>isi pesan</b>) kami kumpulkan
          <b> hanya</b> untuk menindaklanjuti pesan ini, disimpan selama diperlukan,
          lalu dihapus.
        </p>

        {/* Penjelasan singkat isi UU No. 27 Tahun 2022 */}
        <div className="mt-3 rounded-xl bg-gray-50 p-3.5">
          <p className="text-[12px] font-bold text-navy">
            Apa itu UU No. 27 Tahun 2022?
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-gray-600">
            Undang-Undang Pelindungan Data Pribadi (UU PDP). Isinya mewajibkan
            setiap pihak yang mengumpulkan data pribadi — termasuk kami — untuk
            memprosesnya secara <b>sah, seperlunya, transparan, dan aman</b>,
            wajib menjaga kerahasiaannya, dan wajib memberi tahu bila terjadi
            kebocoran data.
          </p>
          <p className="mt-2 text-[12px] font-semibold text-navy">
            Sebagai pemilik data, kamu berhak:
          </p>
          <ul className="mt-1 flex flex-col gap-1.5 text-[12px] leading-snug text-gray-600">
            {[
              'Mengetahui tujuan & cara datamu digunakan.',
              'Meminta akses dan salinan datamu.',
              'Memperbaiki data yang keliru atau tidak lengkap.',
              'Meminta penghapusan data dan menarik persetujuan kapan saja.',
              'Menuntut ganti rugi bila datamu disalahgunakan.',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <ShieldIcon size={13} className="mt-0.5 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-3 text-[12px] leading-relaxed text-gray-500">
          Teks lengkap:{' '}
          <a
            href={PDP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline underline-offset-2 hover:text-primary-dark"
          >
            UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi
          </a>
          .
        </p>

        <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[12px] leading-snug text-gray-700">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
          />
          <span>
            Saya telah membaca dan <b>menyetujui</b> pengumpulan &amp; pemrosesan
            data pribadi saya sesuai UU No. 27 Tahun 2022.
          </span>
        </label>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!checked}
            onClick={() => {
              onAgree()
              setChecked(false)
            }}
            className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <ShieldIcon size={15} />
            Setuju &amp; Lanjutkan
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ContactSection() {
  const [form, setForm] = useState({ nama: '', email: '', noHp: '', pesan: '' })
  const [consent, setConsent] = useState(false)
  const [consentOpen, setConsentOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')
  const { content, patchInfo, addInfo, removeInfo } = useKontakContent()
  const { isAdmin } = useEditMode()
  const h = content.hero

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setForm({ nama: '', email: '', noHp: '', pesan: '' })
    setConsent(false)
  }

  // Pesan dari pengunjung disimpan ke backend dan tampil di menu admin
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    if (!consent) {
      setConsentOpen(true)
      return
    }
    setSending(true)
    setSendError('')
    try {
      await sendContactMessage({
        name: form.nama,
        email: form.email,
        phone: form.noHp,
        message: form.pesan,
        consent: true,
      })
      setSent(true)
      resetForm()
    } catch (err) {
      setSendError(err.message || 'Gagal mengirim pesan. Coba lagi.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <PageHeroBackground id="kontak-hero" className="pb-10 pt-24">
        <div className="container">
          <EditableRichText
            elementKey="kontak-kami.hero.label"
            section="hero"
            as="p"
            className="section-label !text-gold"
            defaultText={h.label}
            label="label Kontak Kami"
          />
          <h1 className="mb-4 max-w-[640px] font-heading text-4xl font-semibold leading-[1.15] text-white max-[600px]:text-3xl">
            <EditableRichText
              elementKey="kontak-kami.hero.title"
              section="hero"
              as="span"
              defaultText={h.titleMain}
              label="judul"
            />{' '}
            <EditableRichText
              elementKey="kontak-kami.hero.highlight"
              section="hero"
              as="span"
              className="italic text-gold"
              defaultText={h.titleHighlight}
              label="kata yang ditonjolkan"
            />
          </h1>
          <EditableRichText
            elementKey="kontak-kami.hero.description"
            section="hero"
            as="p"
            className="max-w-[560px] leading-[1.7] text-white/80"
            defaultText={h.description}
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
            <EditableRichText
              elementKey="kontak-kami.form.title"
              section="form"
              as="h3"
              className="mb-1.5 font-heading text-lg font-bold text-navy"
              defaultText={content.form.title}
              label="judul formulir"
            />
            <EditableRichText
              elementKey="kontak-kami.form.description"
              section="form"
              as="p"
              className="mb-3 text-xs leading-relaxed text-gray-500"
              defaultText={content.form.description}
              label="keterangan formulir"
              multiline
            />

            {sent ? (
              <div className="rounded-xl bg-primary/5 p-5 text-center">
                <span className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary-dark">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="text-sm font-bold text-navy">Pesan terkirim!</p>
                <p className="mt-1 text-xs text-gray-500">
                  Terima kasih. Tim LAZIS PLN Batam akan membalas ke email kamu.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-3 text-xs font-semibold text-primary hover:text-primary-dark"
                >
                  Kirim pesan lain
                </button>
              </div>
            ) : (
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
                  <label htmlFor="noHp" className="mb-1 block text-xs font-semibold text-gray-500">
                    No. HP
                  </label>
                  <input
                    id="noHp"
                    name="noHp"
                    type="tel"
                    required
                    inputMode="tel"
                    pattern="[0-9+\-\s]{8,20}"
                    placeholder="08xxxxxxxxxx"
                    value={form.noHp}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Isi pesan — terkunci sampai pengunjung menyetujui
                    pelindungan data pribadi lewat pop-up. */}
                <div>
                  <label htmlFor="pesan" className="mb-1 block text-xs font-semibold text-gray-500">
                    Pesan
                  </label>

                  {consent ? (
                    <p className="mb-1.5 flex items-center gap-1.5 rounded-lg bg-green-50 px-2.5 py-1.5 text-[11px] font-semibold text-green-700">
                      <ShieldIcon size={13} />
                      Persetujuan pelindungan data diberikan — datamu aman sesuai UU No. 27/2022.
                    </p>
                  ) : (
                    <p className="mb-1.5 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-700">
                      <ShieldIcon size={13} />
                      Setujui pelindungan data pribadi dulu untuk menulis pesan.
                    </p>
                  )}

                  <div className="relative">
                    <textarea
                      id="pesan"
                      name="pesan"
                      required
                      rows={3}
                      disabled={!consent}
                      placeholder={
                        consent
                          ? 'Tulis pesan atau pertanyaan kamu di sini'
                          : 'Klik di sini untuk menyetujui pelindungan data…'
                      }
                      value={form.pesan}
                      onChange={handleChange}
                      className={`${inputClass} resize-none disabled:cursor-pointer disabled:bg-gray-100 disabled:text-gray-400`}
                    />
                    {!consent && (
                      <button
                        type="button"
                        aria-label="Buka persetujuan pelindungan data pribadi"
                        onClick={() => setConsentOpen(true)}
                        className="absolute inset-0 h-full w-full rounded-lg"
                      />
                    )}
                  </div>
                </div>

                {sendError && <p className="text-xs font-semibold text-coral">{sendError}</p>}

                <button
                  type="submit"
                  disabled={sending || !consent}
                  className="btn btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? (
                    'Mengirim…'
                  ) : (
                    <>
                      <EditableRichText
                        elementKey="kontak-kami.form.button_label"
                        section="form"
                        defaultText={content.form.buttonLabel}
                        label="teks tombol kirim"
                      />
                      <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </>
                  )}
                </button>

                <p className="mt-0.5 text-center text-[10px] leading-relaxed text-gray-400">
                  Dengan mengirim, kamu menyetujui pemrosesan data sesuai{' '}
                  <a
                    href={PDP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-gray-500 underline underline-offset-2 hover:text-primary"
                  >
                    UU No. 27 Tahun 2022
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <ConsentModal
        open={consentOpen}
        onClose={() => setConsentOpen(false)}
        onAgree={() => {
          setConsent(true)
          setConsentOpen(false)
        }}
      />
    </>
  )
}
