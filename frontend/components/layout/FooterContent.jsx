'use client'

import Link from 'next/link'
import { useState } from 'react'
import EditableRichText from '@/components/inline-edit/EditableRichText'
import { useEditMode } from '@/components/inline-edit/EditModeContext'
import { useTextElementsContext } from '@/components/inline-edit/TextElementsContext'

// Isi footer yang bisa diedit admin (halaman admin "Konten Footer"). Semua
// teks disimpan sebagai text_elements page "footer" — satu footer dipakai di
// semua halaman publik. Tautan sosial media = elemen teks yang isinya URL.
const H2 =
  'mb-1.5 font-heading text-sm font-bold text-white after:mt-1 after:block after:h-0.5 after:w-5 after:rounded-full after:bg-gold/70'
const LINK = 'text-xs text-white/60 transition-colors hover:text-gold'
const SOCIAL =
  'flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.08] text-white/60 transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white'

const SOCIALS = [
  {
    key: 'facebook',
    label: 'Facebook',
    d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    d: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
]

const NAV = [
  ['beranda', 'Beranda', '/donatur#top'],
  ['program', 'Program Kami', '/donatur#programs'],
  ['zakat', 'Hitung Zakat', '/donatur#zakat-calculator'],
  ['faq', 'FAQ', '/donatur#konsultasi'],
]

const LAYANAN = [
  ['penghasilan', 'Zakat Penghasilan'],
  ['fitrah', 'Zakat Fitrah'],
  ['infaq', 'Infaq'],
  ['shadaqah', 'Shadaqah'],
]

const CONTACTS = [
  [
    'alamat',
    'Jl. PLN Batam, Kepulauan Riau, Indonesia',
    'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  ],
  [
    'telepon',
    '(0778) 123-456',
    'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  ],
  [
    'email',
    'lazis@plnbatam.co.id',
    'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  ],
]

const T = (key, defaultText, label) => (
  <EditableRichText elementKey={`footer.${key}`} section="footer" defaultText={defaultText} label={label} />
)

// Panel kecil (hanya mode edit) untuk mengisi URL sosial media.
function SocialUrlEditor() {
  const ctx = useTextElementsContext()
  const [drafts, setDrafts] = useState({})
  return (
    <div className="mt-2 flex max-w-[300px] flex-col gap-1.5 rounded-lg border border-dashed border-gold/50 bg-white/5 p-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-gold">Tautan sosial media</p>
      {SOCIALS.map((s) => {
        const key = `footer.social.${s.key}`
        const saved = ctx.get(key)?.content ?? ''
        return (
          <label key={s.key} className="flex items-center gap-2 text-[11px] text-white/70">
            <span className="w-16 shrink-0">{s.label}</span>
            <input
              type="url"
              placeholder="https://…"
              value={drafts[s.key] ?? saved}
              onChange={(e) => setDrafts((d) => ({ ...d, [s.key]: e.target.value }))}
              onBlur={() => {
                const v = (drafts[s.key] ?? saved).trim()
                if (v !== saved) ctx.stage(key, { page: ctx.page, section: 'footer', content: v })
              }}
              className="min-w-0 flex-1 rounded bg-white/10 px-2 py-1 text-[11px] text-white outline-none placeholder:text-white/30 focus:bg-white/20"
            />
          </label>
        )
      })}
    </div>
  )
}

export default function FooterContent() {
  const { editing } = useEditMode()
  const ctx = useTextElementsContext()
  const year = new Date().getFullYear()
  const noNav = editing ? (e) => e.preventDefault() : undefined

  return (
    <footer className="relative bg-navy-dark pt-4 text-white/70">
      {/* Garis tipis di atas footer: gradasi transparan → emas → transparan */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="container">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1.3fr] gap-5 pb-4 max-[768px]:grid-cols-2 max-[768px]:gap-5 max-[480px]:grid-cols-1">
          {/* Logo & deskripsi brand */}
          <div className="max-[768px]:col-span-full">
            <div className="mb-1.5">
              <img
                src="/images/logo-lazis-pln-putih.png"
                alt="Lazis PLN Batam"
                width="1080"
                height="387"
                loading="lazy"
                decoding="async"
                className="h-5 w-auto"
              />
            </div>
            <EditableRichText
              elementKey="footer.deskripsi"
              section="footer"
              as="p"
              className="mb-2 max-w-[280px] text-xs leading-[1.4] text-white/60"
              defaultText="Lembaga Amil Zakat, Infaq dan Shadaqah PLN Batam. Menyalurkan kebaikan untuk kesejahteraan masyarakat."
              label="deskripsi footer"
              multiline
            />
            <div className="flex gap-2">
              {SOCIALS.map((s) => {
                const url = (ctx.get(`footer.social.${s.key}`)?.content || '').trim()
                // Kosong → disembunyikan untuk pengunjung, tetap tampil (pudar) di mode edit.
                if (!url && !editing) return null
                return (
                  <a
                    key={s.key}
                    href={url || '#'}
                    aria-label={s.label}
                    {...(url ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    onClick={noNav}
                    className={`${SOCIAL} ${!url ? 'opacity-40' : ''}`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d={s.d} />
                    </svg>
                  </a>
                )
              })}
            </div>
            {editing && <SocialUrlEditor />}
          </div>

          {/* Link navigasi */}
          <div>
            <h2 className={H2}>{T('judul.navigasi', 'Navigasi', 'judul kolom Navigasi')}</h2>
            <ul className="space-y-1">
              {NAV.map(([k, label, href]) => (
                <li key={k}>
                  <Link href={href} onClick={noNav} className={LINK}>
                    {T(`nav.${k}`, label, `menu ${label}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Daftar layanan */}
          <div>
            <h2 className={H2}>{T('judul.layanan', 'Layanan', 'judul kolom Layanan')}</h2>
            <ul className="space-y-1">
              {LAYANAN.map(([k, label]) => (
                <li key={k}>
                  <a href="#" onClick={noNav} className={LINK}>
                    {T(`layanan.${k}`, label, `layanan ${label}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info kontak */}
          <div>
            <h2 className={H2}>{T('judul.kontak', 'Kontak', 'judul kolom Kontak')}</h2>
            <ul className="space-y-1">
              {CONTACTS.map(([k, text, d]) => (
                <li key={k} className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-primary-light">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="9" height="9">
                      <path d={d} />
                    </svg>
                  </span>
                  <span className="pt-0 text-xs leading-[1.3] text-white/60">
                    {T(`kontak.${k}`, text, `kontak ${k}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Baris paling bawah */}
        <div className="flex flex-col items-center gap-1 border-t border-white/[0.08] py-2 text-[11px] text-white/60 sm:flex-row sm:justify-between">
          <p>{T('hak-cipta', `© ${year} Lazis PLN Batam.`, 'hak cipta')}</p>
          <a
            href="#top"
            onClick={noNav}
            className="flex items-center gap-1.5 font-medium text-white/60 transition-colors hover:text-gold"
          >
            {T('kembali-atas', 'Kembali ke atas', 'tombol kembali ke atas')}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
              <path d="M10 15V5M4 9l6-6 6 6" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
