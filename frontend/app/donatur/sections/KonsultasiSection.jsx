'use client'

import { useRef, useState } from 'react'

const FAQS = [
  {
    q: 'Siapa saja yang wajib membayar zakat profesi?',
    a: 'Seluruh karyawan PLN Batam yang penghasilan bulanannya (gaji pokok + tunjangan tetap) telah mencapai nisab zakat profesi, yaitu setara 85 gram emas per tahun.',
  },
  {
    q: 'Bagaimana cara membayar zakat melalui LAZIS PLN Batam?',
    a: 'Anda dapat mendaftar sebagai donatur, menghitung kewajiban zakat melalui kalkulator di halaman ini, lalu melakukan pembayaran melalui transfer ke rekening resmi atau potong gaji otomatis.',
  },
  {
    q: 'Apakah pembayaran zakat mendapat bukti setor?',
    a: 'Ya. Setiap pembayaran akan mendapatkan bukti setor zakat resmi yang dapat diunduh melalui akun donatur Anda, sekaligus berlaku sebagai pengurang pajak penghasilan.',
  },
  {
    q: 'Bagaimana transparansi penyaluran dana zakat?',
    a: 'Setiap program penyaluran didokumentasikan dan dipublikasikan secara berkala, termasuk laporan triwulanan yang dapat diakses oleh seluruh donatur pada bagian Program Kami.',
  },
]

export default function KonsultasiSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const panelRefs = useRef([])

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? -1 : i))

  return (
    <section id="konsultasi" className="bg-white py-24">
      <div className="container grid grid-cols-[0.85fr_1.15fr] gap-12 max-[900px]:grid-cols-1">
        <div>
          <p className="section-label">Konsultasi</p>
          <h2 className="section-title">
            Pertanyaan Seputar
            <br />
            <span>Zakat &amp; Shadaqah</span>
          </h2>
          <p className="my-4 mb-8 max-w-[380px] leading-[1.7] text-gray-500">
            Tim Lazis PLN Batam siap membantu Anda memahami kewajiban zakat dan cara penunaiannya.
          </p>

          <div className="max-w-[380px] border-t border-gray-200 pt-6">
            <div className="mb-4 flex items-start gap-4 text-sm text-gray-600">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
                  <path d="M4 5h4l2 5-2.5 1.5a11 11 0 005 5L14 14l5 2v4a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-2z" />
                </svg>
              </span>
              <span>(0778) 469 100 ext. 1234</span>
            </div>
            <div className="mb-4 flex items-start gap-4 text-sm text-gray-600">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
                  <path d="M4 4h16v16H4z" />
                  <path d="M4 6l8 7 8-7" />
                </svg>
              </span>
              <span>lazis@plnbatam.com</span>
            </div>
            <div className="mb-4 flex items-start gap-4 text-sm text-gray-600">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
                  <path d="M12 21s-7-5.6-7-11a7 7 0 0114 0c0 5.4-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.4" />
                </svg>
              </span>
              <span>Gedung PLN Batam, Lt. 2, Jl. Engku Putri No. 1</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={item.q} className="border-b border-gray-200">
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left font-heading text-lg font-semibold text-navy"
                >
                  <span>{item.q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      isOpen ? 'border-primary bg-primary text-white' : 'border-gray-200 text-primary'
                    }`}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                    >
                      <path d="M10 4v12M4 10h12" />
                    </svg>
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-[max-height] duration-300"
                  style={{ maxHeight: isOpen ? `${(panelRefs.current[i]?.scrollHeight ?? 400) + 32}px` : '0px' }}
                >
                  <p ref={(el) => (panelRefs.current[i] = el)} className="max-w-[560px] pb-6 text-sm leading-[1.75] text-gray-600">
                    {item.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
