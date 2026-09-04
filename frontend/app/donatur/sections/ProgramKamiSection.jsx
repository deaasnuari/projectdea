'use client'

import Link from 'next/link'
import EditableText from '@/components/inline-edit/EditableText'
import { useEditMode } from '@/components/inline-edit/EditModeContext'
import { useKamiPeduliContent } from './useKamiPeduliContent'
import { useDocVideos, useDocPhotos } from '@/services/docMedia'
import { formatDateID, postSortKey } from '@/services/dateText'

// Judul di dalam .section-title: bagian "utama" aslinya cuma teks polos
// (bukan <span>), jadi saat dibungkus jadi <span> untuk diedit, aturan
// global ".section-title span" (miring + warna primary) ikut kena —
// dinetralkan lewat inline style ini supaya tampilannya sama seperti semula.
const TITLE_MAIN_STYLE = { fontStyle: 'normal', color: 'inherit' }

const PlayIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="ml-[3px] h-6 w-6 text-white">
    <path d="M8 5v14l11-7z" />
  </svg>
)

// Tombol "Tambah konten" — hanya tampil untuk admin (di halaman Konten
// Situs), mengarah ke dashboard Dokumentasi untuk tambah/edit/hapus.
function TambahKontenButton() {
  return (
    <Link
      href="/admin/dokumentasi"
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-primary/50 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:border-primary hover:bg-primary/5"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
      </svg>
      Tambah konten
    </Link>
  )
}

export default function ProgramKamiSection() {
  const { content, patchSection } = useKamiPeduliContent()
  const { videos: rawVideos } = useDocVideos()
  const { photos: rawGaleri } = useDocPhotos()
  const { isAdmin } = useEditMode()

  // Di halaman donatur: yang terbaru (sesuai tanggal dibuat) tampil paling dulu.
  const videos = [...rawVideos].sort((a, b) => postSortKey(b) - postSortKey(a))
  const galeri = [...rawGaleri].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
  )
  const ph = content.programHeading
  const gh = content.galeriHeading

  // Sampai 4 video: grid 2 kolom seperti biasa. Lebih dari itu: baris yang
  // digeser ke samping (scroll-snap) supaya section tidak makin panjang ke
  // bawah — pola yang sama dengan galeri di bawahnya.
  const slideMode = videos.length > 4

  // Baris geser (video >4 & galeri): di halaman publik dibiarkan "bleed"
  // sampai tepi container (-mx-6 px-6). Di halaman admin Konten Situs area
  // kontennya sudah mepet ke sidebar, jadi bleed bikin gambar nempel —
  // di sana pakai padding container biasa saja supaya sejajar dengan judul.
  const slideRowClass = `flex snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:thin]${
    isAdmin ? '' : ' -mx-6 px-6'
  }`

  const renderVideoCard = (program, i) => {
    const PlayTag = program.videoUrl ? 'a' : 'div'
    const playProps = program.videoUrl
      ? { href: program.videoUrl, target: '_blank', rel: 'noopener noreferrer' }
      : {}
    return (
      <div
        key={program.id}
        className={`card group animate-fade-in-up opacity-0 ${
          slideMode ? 'w-[min(520px,85vw)] shrink-0 snap-start' : ''
        }`}
        style={{ animationDelay: `${i * 0.15}s` }}
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={program.image}
            alt={program.title}
            className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-[1.08]"
          />
          <PlayTag
            {...playProps}
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-coral shadow-[0_4px_20px_rgba(231,76,60,0.4)] transition-all group-hover:scale-[1.15]"
          >
            {PlayIcon}
          </PlayTag>
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            {program.badge}
          </span>
        </div>
        <div className="p-6">
          {program.date && (
            <p className="mb-1 text-xs font-medium text-gray-400">{formatDateID(program.date)}</p>
          )}
          <h3 className="mb-2 font-heading text-lg font-bold leading-[1.3] text-navy">{program.title}</h3>
          <p className="mb-4 text-sm leading-[1.6] text-gray-500">{program.desc}</p>
          {program.videoUrl && (
            <a
              href={program.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2 hover:text-primary-dark"
            >
              {content.selengkapnyaLabel}
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <section id="programs" className="bg-gray-50 pt-12 pb-14">
      <div className="container">
        {/* Judul bagian — teksnya bisa diedit inline oleh admin (di halaman
            /admin/konten-kami-peduli). Daftar video & galeri dikelola lewat
            halaman /admin/dokumentasi (tambah / edit / hapus). */}
        <div className="mb-8 flex items-end justify-between gap-6 max-[768px]:flex-col max-[768px]:items-start">
          <div>
            <EditableText
              as="p"
              className="section-label !mb-1.5 !text-xs"
              value={ph.label}
              onSave={(v) => patchSection('programHeading', { label: v })}
              label="label section program"
            />
            <h2 className="section-title !text-2xl">
              <EditableText
                as="span"
                style={TITLE_MAIN_STYLE}
                value={ph.titleMain}
                onSave={(v) => patchSection('programHeading', { titleMain: v })}
                label="judul section program"
              />{' '}
              <EditableText
                as="span"
                value={ph.titleHighlight}
                onSave={(v) => patchSection('programHeading', { titleHighlight: v })}
                label="kata yang ditonjolkan"
              />
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-3 max-[768px]:flex-wrap">
            {isAdmin && <TambahKontenButton />}
            <a href="#" className="btn btn-coral shrink-0">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M8 5v14l11-7z" />
              </svg>
              <EditableText
                value={ph.buttonLabel}
                onSave={(v) => patchSection('programHeading', { buttonLabel: v })}
                label="tombol Lihat Semua Video"
              />
            </a>
          </div>
        </div>

        {/* Video: grid 2 kolom, atau baris geser ke samping kalau > 4 */}
        {slideMode ? (
          <div className={`${slideRowClass} gap-8`}>
            {videos.map(renderVideoCard)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 max-[768px]:grid-cols-1">
            {videos.map(renderVideoCard)}
          </div>
        )}

        {/* Galeri foto penyaluran */}
        <div className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-6 max-[768px]:flex-col max-[768px]:items-start">
            <div>
              <EditableText
                as="p"
                className="section-label"
                value={gh.label}
                onSave={(v) => patchSection('galeriHeading', { label: v })}
                label="label section galeri"
              />
              <h2 className="section-title">
                <EditableText
                  as="span"
                  style={TITLE_MAIN_STYLE}
                  value={gh.titleMain}
                  onSave={(v) => patchSection('galeriHeading', { titleMain: v })}
                  label="judul galeri"
                />{' '}
                <EditableText
                  as="span"
                  value={gh.titleHighlight}
                  onSave={(v) => patchSection('galeriHeading', { titleHighlight: v })}
                  label="kata yang ditonjolkan"
                />
              </h2>
            </div>
            {isAdmin && <TambahKontenButton />}
          </div>

          {/* Baris galeri yang bisa digeser ke samping (scroll-snap),
              bukan grid kartu, supaya foto bisa ditambah terus tanpa
              bikin section jadi makin tinggi ke bawah. */}
          <div className={`${slideRowClass} gap-5`}>
            {galeri.map((foto, i) => (
              <div
                key={foto.id}
                className="group relative aspect-square w-[240px] shrink-0 snap-start animate-fade-in-up overflow-hidden rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md opacity-0 max-[480px]:w-[200px]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <img
                  src={foto.image}
                  alt={foto.caption}
                  className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/85 via-navy-dark/0 to-navy-dark/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute inset-x-3 bottom-3 translate-y-2 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {foto.caption}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
