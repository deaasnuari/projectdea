'use client'

import { useState } from 'react'
import PageHeroBackground from '@/components/layout/PageHeroBackground'

const KONTAK_INFO = [
  {
    id: 'alamat',
    label: 'Alamat',
    value: 'Jl. PLN Batam, Kepulauan Riau, Indonesia',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
  },
  {
    id: 'telepon',
    label: 'Telepon',
    value: '(0778) 123-456',
    href: 'tel:+0778123456',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    value: 'lazis@plnbatam.co.id',
    href: 'mailto:lazis@plnbatam.co.id',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
  {
    id: 'jam',
    label: 'Jam Operasional',
    value: 'Senin – Jumat, 08.00 – 16.00 WIB',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.41V7a1 1 0 00-2 0v6a1 1 0 00.29.71l3.5 3.5a1 1 0 001.42-1.42L13 12.41z" />
      </svg>
    ),
  },
]

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-primary focus:bg-white'

export default function ContactSection() {
  const [form, setForm] = useState({ nama: '', email: '', pesan: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  //ini untuk membuka aplikasi email pengguna dengan isi pesan yang sudah diisi, karena situs ini belum punya endpoint backend untuk mengirim pesan
  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Pesan dari ${form.nama || 'Donatur'} — Website Lazis PLN Batam`)
    const body = encodeURIComponent(
      `Nama: ${form.nama}\nEmail: ${form.email}\n\nPesan:\n${form.pesan}`
    )
    window.location.href = `mailto:lazis@plnbatam.co.id?subject=${subject}&body=${body}`
  }

  return (
    <>
      <PageHeroBackground className="pb-10 pt-32">
        <div className="container">
          <p className="section-label !text-gold">Kontak Kami</p>
          <h1 className="mb-4 max-w-[640px] font-heading text-4xl font-semibold leading-[1.15] text-white max-[600px]:text-3xl">
            Ada Pertanyaan? <span className="italic text-gold">Hubungi Kami</span>
          </h1>
          <p className="max-w-[560px] leading-[1.7] text-white/80">
            Tim LAZIS PLN Batam siap membantu seputar zakat, infaq, shadaqah, maupun kerja sama program. Silakan
            hubungi kami melalui kontak di bawah, atau kirim pesan langsung lewat formulir.
          </p>
        </div>
      </PageHeroBackground>

      <section className="bg-gray-50 py-10">
        <div className="container grid grid-cols-[0.9fr_1.1fr] gap-8 max-[900px]:grid-cols-1">
          {/* Kiri: informasi kontak */}
          <div className="flex flex-col gap-4">
            {KONTAK_INFO.map((item) => {
              const content = (
                <div className="card flex items-start gap-4 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-400">{item.label}</p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-navy">{item.value}</p>
                  </div>
                </div>
              )
              return item.href ? (
                <a key={item.id} href={item.href} className="block transition-transform hover:-translate-y-0.5">
                  {content}
                </a>
              ) : (
                <div key={item.id}>{content}</div>
              )
            })}
          </div>

          {/* Kanan: formulir pesan */}
          <div className="card p-8">
            <h3 className="mb-2 font-heading text-xl font-bold text-navy">Kirim Pesan</h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-500">
              Isi formulir berikut, kami akan membuka aplikasi email kamu dengan pesan yang sudah terisi otomatis.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="nama" className="mb-1.5 block text-xs font-semibold text-gray-500">
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
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-gray-500">
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
                <label htmlFor="pesan" className="mb-1.5 block text-xs font-semibold text-gray-500">
                  Pesan
                </label>
                <textarea
                  id="pesan"
                  name="pesan"
                  required
                  rows={5}
                  placeholder="Tulis pesan atau pertanyaan kamu di sini"
                  value={form.pesan}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button type="submit" className="btn btn-primary mt-2 w-full justify-center">
                Kirim Pesan
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
