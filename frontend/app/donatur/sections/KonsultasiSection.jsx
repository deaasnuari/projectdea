'use client'

import { useRef, useState } from 'react'
import EditableText from '@/components/inline-edit/EditableText'
import { useEditMode } from '@/components/inline-edit/EditModeContext'
import { AddItemButton, DeleteItemButton } from '@/components/inline-edit/EditControls'
import { useKamiPeduliContent } from './useKamiPeduliContent'
import { useKontakContent } from '@/app/donatur/kontak-kami/kontakData'

// Bagian "utama" judul .section-title aslinya teks polos — dinetralkan biar
// tidak ikut miring/berwarna primary saat dibungkus <span> untuk diedit.
const TITLE_MAIN_STYLE = { fontStyle: 'normal', color: 'inherit' }

const PhoneIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
    <path d="M4 5h4l2 5-2.5 1.5a11 11 0 005 5L14 14l5 2v4a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-2z" />
  </svg>
)
const MailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
    <path d="M4 4h16v16H4z" />
    <path d="M4 6l8 7 8-7" />
  </svg>
)
const PinIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
    <path d="M12 21s-7-5.6-7-11a7 7 0 0114 0c0 5.4-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
)

function ContactRow({ icon, value }) {
  return (
    <div className="mb-4 flex items-start gap-4 text-sm text-gray-600">
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <span>{value || '—'}</span>
    </div>
  )
}

export default function KonsultasiSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const panelRefs = useRef([])
  const { content, patchSection, patchFaq, addFaq, removeFaq } = useKamiPeduliContent()
  const { content: kontak } = useKontakContent()
  const { editing } = useEditMode()
  const k = content.konsultasi

  // Telepon, email & alamat mengikuti data halaman "Kontak Kami" (satu sumber).
  const infoVal = (type) => kontak.info?.find((i) => i.type === type)?.value || ''
  const phone = infoVal('telepon') || k.phone
  const email = infoVal('email') || k.email
  const address = infoVal('alamat') || k.address

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? -1 : i))
  const set = (patch) => patchSection('konsultasi', patch)

  return (
    <section id="konsultasi" className="bg-white py-14">
      <div className="container grid grid-cols-[0.85fr_1.15fr] gap-12 max-[900px]:grid-cols-1">
        <div>
          <EditableText
            as="p"
            className="section-label"
            value={k.label}
            onSave={(v) => set({ label: v })}
            label="label Konsultasi"
          />
          <h2 className="section-title">
            <EditableText
              as="span"
              style={TITLE_MAIN_STYLE}
              value={k.titleMain}
              onSave={(v) => set({ titleMain: v })}
              label="judul Konsultasi"
            />
            <br />
            <EditableText
              as="span"
              value={k.titleHighlight}
              onSave={(v) => set({ titleHighlight: v })}
              label="kata yang ditonjolkan"
            />
          </h2>
          <EditableText
            as="p"
            className="my-4 mb-8 max-w-[380px] leading-[1.7] text-gray-500"
            value={k.description}
            onSave={(v) => set({ description: v })}
            label="paragraf Konsultasi"
            multiline
          />

          <div className="max-w-[380px] border-t border-gray-200 pt-6">
            <ContactRow icon={PhoneIcon} value={phone} />
            <ContactRow icon={MailIcon} value={email} />
            <ContactRow icon={PinIcon} value={address} />
            {editing && (
              <p className="mt-1 text-xs italic text-gray-400">
                Telepon, email &amp; alamat mengikuti halaman <b>Konten Kontak Kami</b>.
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200">
          {k.faqs.map((item, i) => {
            const isOpen = editing || openIndex === i
            return (
              <div key={item.id} className="border-b border-gray-200">
                <div className="flex w-full items-center justify-between gap-6 py-6 text-left font-heading text-lg font-semibold text-navy">
                  <button
                    type="button"
                    onClick={() => !editing && toggle(i)}
                    className="flex-1 text-left"
                  >
                    <EditableText
                      value={item.q}
                      onSave={(v) => patchFaq(item.id, { q: v })}
                      label="pertanyaan"
                      multiline
                    />
                  </button>
                  {!editing && (
                    <span
                      onClick={() => toggle(i)}
                      className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors duration-300 ${
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
                  )}
                </div>
                <div
                  className={editing ? '' : 'overflow-hidden transition-[max-height] duration-300'}
                  style={
                    editing
                      ? undefined
                      : { maxHeight: isOpen ? `${(panelRefs.current[i]?.scrollHeight ?? 400) + 32}px` : '0px' }
                  }
                >
                  <div
                    ref={(el) => (panelRefs.current[i] = el)}
                    className="max-w-[560px] pb-6 text-sm leading-[1.75] text-gray-600"
                  >
                    <EditableText
                      as="span"
                      value={item.a}
                      onSave={(v) => patchFaq(item.id, { a: v })}
                      label="jawaban"
                      multiline
                    />
                    {editing && (
                      <DeleteItemButton
                        className="mt-2 block"
                        label="Hapus FAQ ini"
                        onClick={() => removeFaq(item.id)}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          {editing && <AddItemButton className="mt-4" label="Tambah FAQ" onClick={addFaq} />}
        </div>
      </div>
    </section>
  )
}
