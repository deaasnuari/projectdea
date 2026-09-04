'use client'

import { useState } from 'react'
import DonationModal from '@/components/donation/DonationModal'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import EditableRichText from '@/components/inline-edit/EditableRichText'
import { useEditMode } from '@/components/inline-edit/EditModeContext'
import { AddItemButton, DeleteItemButton } from '@/components/inline-edit/EditControls'
import { useTentangContent, uid } from './tentangData'

// Bagian "utama" judul .section-title aslinya teks polos (bukan <span>) —
// dinetralkan biar tidak ikut kena aturan ".section-title span" saat dibungkus.
const TITLE_MAIN_STYLE = { fontStyle: 'normal', color: 'inherit' }

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
      <path d="M4 10.5l3.5 3.5L16 5.5" />
    </svg>
  )
}

export default function TentangSection() {
  const [donationOpen, setDonationOpen] = useState(false)
  const { content, addListItem, removeListItem } = useTentangContent()
  const { isAdmin } = useEditMode()
  const h = content.hero
  const vm = content.visiMisi

  return (
    <>
      <PageHeroBackground id="tentang-hero" className="pb-10 pt-24">
        <div className="container grid grid-cols-[1.1fr_0.9fr] items-start gap-12 max-[900px]:grid-cols-1">
          {/* Kiri: teks pengantar */}
          <div>
            <EditableRichText
              elementKey="tentang-kami.hero.label"
              section="hero"
              as="p"
              className="section-label !text-gold"
              defaultText={h.label}
              label="label Tentang Kami"
            />
            <h1 className="mb-6 font-heading text-4xl font-semibold leading-[1.15] text-white max-[600px]:text-3xl">
              <EditableRichText
                elementKey="tentang-kami.hero.title"
                section="hero"
                as="span"
                defaultText={h.titleMain}
                label="judul utama"
              />
              <br />
              <EditableRichText
                elementKey="tentang-kami.hero.highlight"
                section="hero"
                as="span"
                className="italic text-gold"
                defaultText={h.titleHighlight}
                label="judul (ditonjolkan)"
              />
            </h1>
            <EditableRichText
              elementKey="tentang-kami.hero.description"
              section="hero"
              as="p"
              className="mb-8 max-w-[520px] leading-[1.7] text-white/80"
              defaultText={h.description}
              label="paragraf pengantar"
              multiline
            />

            <div className="grid max-w-[520px] grid-cols-2 gap-4 max-[480px]:grid-cols-1">
              {content.keunggulan.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start gap-3 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md border border-white/[0.12] bg-white/[0.08] p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.14]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.15] text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-white">
                    <CheckIcon />
                  </span>
                  <span className="flex-1 text-sm leading-snug text-white/90">
                    <EditableRichText
                      elementKey={`tentang-kami.hero.keunggulan.${item.id}.text`}
                      section="hero"
                      defaultText={item.text}
                      label="poin keunggulan"
                      multiline
                    />
                    {isAdmin && (
                      <DeleteItemButton
                        className="mt-1 block"
                        label="Hapus poin ini"
                        onClick={() => removeListItem('keunggulan', item.id)}
                      />
                    )}
                  </span>
                </div>
              ))}
              {isAdmin && (
                <AddItemButton
                  className="self-start"
                  label="Tambah keunggulan"
                  onClick={() => addListItem('keunggulan', { id: uid('k'), text: 'Poin keunggulan baru' })}
                />
              )}
            </div>
          </div>

          {/* Kanan: card donasi — SENGAJA tidak diberi inline editing */}
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <h3 className="mb-3 font-heading text-xl font-bold text-navy">Donasi via Transfer</h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-500">
              Pilih jenis donasi dan bank tujuan langsung lewat tombol di bawah — nomor rekening ditampilkan otomatis
              di langkah terakhir.
            </p>

            <div className="flex flex-col items-center gap-4 rounded-xl bg-gradient-to-br from-navy to-primary-dark px-6 py-6">
              <span className="text-xs font-semibold uppercase tracking-[0.5px] text-white/70">Bayar zakat sekarang</span>
              <button type="button" onClick={() => setDonationOpen(true)} className="btn btn-gold w-full justify-center">
                Donasi via Transfer
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </PageHeroBackground>

      {/* Visi & Misi */}
      <section className="bg-gray-50 py-12">
        <div className="container">
          <div className="mb-6">
            <EditableRichText
              elementKey="tentang-kami.visimisi.label"
              section="visimisi"
              as="p"
              className="section-label !mb-1 !text-xs"
              defaultText={vm.label}
              label="label Arah Kami"
            />
            <h2 className="section-title !text-xl">
              <EditableRichText
                elementKey="tentang-kami.visimisi.title"
                section="visimisi"
                as="span"
                style={TITLE_MAIN_STYLE}
                defaultText={vm.titleMain}
                label="judul Visi & Misi"
              />{' '}
              <EditableRichText
                elementKey="tentang-kami.visimisi.highlight"
                section="visimisi"
                as="span"
                defaultText={vm.titleHighlight}
                label="kata yang ditonjolkan"
              />
            </h2>
          </div>

          <div className="grid grid-cols-[0.8fr_1.2fr] gap-4 max-[900px]:grid-cols-1">
            <div className="card flex flex-col justify-center bg-gradient-to-br from-navy to-primary-dark p-5">
              <EditableRichText
                elementKey="tentang-kami.visimisi.visi_title"
                section="visimisi"
                as="h3"
                className="mb-2 font-heading text-sm font-bold uppercase tracking-[0.5px] text-gold"
                defaultText={vm.visiTitle}
                label="judul Visi"
              />
              <EditableRichText
                elementKey="tentang-kami.visimisi.visi_text"
                section="visimisi"
                as="p"
                className="text-xs leading-[1.6] text-white/85"
                defaultText={vm.visiText}
                label="isi Visi"
                multiline
              />
            </div>

            <div className="card p-5">
              <EditableRichText
                elementKey="tentang-kami.visimisi.misi_title"
                section="visimisi"
                as="h3"
                className="mb-2.5 font-heading text-sm font-bold uppercase tracking-[0.5px] text-primary"
                defaultText={vm.misiTitle}
                label="judul Misi"
              />
              <ul className="flex flex-col gap-2.5">
                {content.misi.map((item) => (
                  <li key={item.id} className="flex items-start gap-2.5 text-xs leading-relaxed text-gray-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckIcon />
                    </span>
                    <span className="flex-1">
                      <EditableRichText
                        elementKey={`tentang-kami.visimisi.misi.${item.id}.text`}
                        section="visimisi"
                        defaultText={item.text}
                        label="poin misi"
                        multiline
                      />
                      {isAdmin && (
                        <DeleteItemButton
                          className="mt-1 block"
                          label="Hapus poin misi"
                          onClick={() => removeListItem('misi', item.id)}
                        />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              {isAdmin && (
                <AddItemButton
                  className="mt-3"
                  label="Tambah misi"
                  onClick={() => addListItem('misi', { id: uid('m'), text: 'Poin misi baru' })}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <DonationModal open={donationOpen} onClose={() => setDonationOpen(false)} />
    </>
  )
}
