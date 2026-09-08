'use client'

import Link from 'next/link'
import EditableRichText from '@/components/inline-edit/EditableRichText'
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
  <svg viewBox="0 0 24 24" fill="currentColor" className="ml-[3px] h-6 w-6">
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
  const { content } = useKamiPeduliContent()
  const { videos: rawVideos } = useDocVideos()
  const { photos: rawGaleri } = useDocPhotos()
  const { isAdmin } = useEditMode()

  // Video / foto yang di-"Sembunyikan" di admin tidak tampil di donatur.
  // Yang terbaru (sesuai tanggal dibuat) tampil paling dulu.
  const videos = [...rawVideos]
    .filter((v) => v.active !== false)
    .sort((a, b) => postSortKey(b) - postSortKey(a))
  const galeri = [...rawGaleri]
    .filter((f) => f.active !== false)
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
  const ph = content.programHeading
  const gh = content.galeriHeading

  // Sampai 4 video: grid 2 kolom seperti biasa. Lebih dari itu: baris yang
  // digeser ke samping (scroll-snap) supaya section tidak makin panjang ke
  // bawah — pola yang sama dengan galeri di bawahnya.
  const slideMode = videos.length > 4

  // Baris geser (video >4 & galeri). Di HP & tablet TIDAK di-bleed — kartu
  // ikut padding .container biasa supaya rata dengan judul/teks lain dan
  // tidak terlihat "mepet ke pinggir kiri". Baru mulai desktop (lg) dibiarkan
  // bleed sampai tepi (nilainya sama persis dengan padding .container di
  // ukuran itu = px-6, jadi tidak menimbulkan horizontal scroll). Di halaman
  // admin Konten Situs tidak pernah bleed karena sudah mepet sidebar.
  const slideRowClass = `flex snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:thin]${
    isAdmin ? '' : ' lg:-mx-6 lg:px-6'
  }`

  const renderVideoCard = (program, i) => {
    const PlayTag = program.videoUrl ? 'a' : 'div'
    const playProps = program.videoUrl
      ? { href: program.videoUrl, target: '_blank', rel: 'noopener noreferrer' }
      : {}
    return (
      <div
        key={program.id}
        className={`group flex animate-fade-in-up flex-col overflow-hidden rounded-2xl bg-white opacity-0 shadow-[0_2px_10px_rgba(6,30,40,0.05)] ring-1 ring-black/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(6,30,40,0.35)] ${
          slideMode ? 'w-[78vw] shrink-0 snap-start sm:w-[380px] lg:w-[min(520px,85vw)]' : ''
        }`}
        style={{ animationDelay: `${i * 0.15}s` }}
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={program.image}
            alt={program.title}
            width="640"
            height="360"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/50 via-navy-dark/0 to-navy-dark/10" />
          <PlayTag
            {...playProps}
            aria-label={program.videoUrl ? `Tonton video: ${program.title}` : undefined}
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-coral"
          >
            <span className="absolute inset-1 rounded-full bg-white/40 opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-100" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-[0_10px_28px_rgba(0,0,0,0.28)] ring-1 ring-white/60 backdrop-blur transition-transform duration-300 group-hover:scale-110">
              {PlayIcon}
            </span>
          </PlayTag>
          <span className="absolute left-3.5 top-3.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-primary-dark shadow-sm backdrop-blur-sm">
            {program.badge}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          {program.date && (
            <p className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
              <span className="h-1 w-1 rounded-full bg-gold" />
              {formatDateID(program.date)}
            </p>
          )}
          <h3 className="mb-1.5 font-heading text-base font-bold leading-snug text-navy transition-colors group-hover:text-primary">
            {program.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-[13px] leading-[1.6] text-gray-500">{program.desc}</p>
          {program.videoUrl && (
            <a
              href={program.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-1 text-[13px] font-semibold text-primary transition-all hover:gap-2 hover:text-primary-dark"
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
            <EditableRichText
              elementKey="kami-peduli.program.label"
              section="program"
              as="p"
              className="section-label !mb-1.5 !text-xs"
              defaultText={ph.label}
              label="label section program"
            />
            <h2 className="section-title !text-2xl">
              <EditableRichText
                elementKey="kami-peduli.program.title"
                section="program"
                as="span"
                style={TITLE_MAIN_STYLE}
                defaultText={ph.titleMain}
                label="judul section program"
              />{' '}
              <EditableRichText
                elementKey="kami-peduli.program.highlight"
                section="program"
                as="span"
                defaultText={ph.titleHighlight}
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
              <EditableRichText
                elementKey="kami-peduli.program.cta_label"
                section="program"
                defaultText={ph.buttonLabel}
                label="tombol Lihat Semua Video"
              />
            </a>
          </div>
        </div>

        {/* Video: grid 2 kolom, atau baris geser ke samping kalau > 4 */}
        {slideMode ? (
          <div className={`${slideRowClass} gap-6`}>
            {videos.map(renderVideoCard)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 max-[768px]:grid-cols-1">
            {videos.map(renderVideoCard)}
          </div>
        )}

        {/* Galeri foto penyaluran */}
        <div className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-6 max-[768px]:flex-col max-[768px]:items-start">
            <div>
              <EditableRichText
                elementKey="kami-peduli.galeri.label"
                section="galeri"
                as="p"
                className="section-label"
                defaultText={gh.label}
                label="label section galeri"
              />
              <h2 className="section-title">
                <EditableRichText
                  elementKey="kami-peduli.galeri.title"
                  section="galeri"
                  as="span"
                  style={TITLE_MAIN_STYLE}
                  defaultText={gh.titleMain}
                  label="judul galeri"
                />{' '}
                <EditableRichText
                  elementKey="kami-peduli.galeri.highlight"
                  section="galeri"
                  as="span"
                  defaultText={gh.titleHighlight}
                  label="kata yang ditonjolkan"
                />
              </h2>
            </div>
            {isAdmin && <TambahKontenButton />}
          </div>

          {/* Baris galeri yang bisa digeser ke samping (scroll-snap),
              bukan grid kartu, supaya foto bisa ditambah terus tanpa
              bikin section jadi makin tinggi ke bawah. */}
          <div className={`${slideRowClass} gap-4`}>
            {galeri.map((foto, i) => (
              <div
                key={foto.id}
                className="group relative aspect-square w-[260px] shrink-0 animate-fade-in-up snap-start overflow-hidden rounded-2xl opacity-0 shadow-[0_2px_10px_rgba(6,30,40,0.06)] ring-1 ring-black/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(6,30,40,0.4)] max-[480px]:w-[220px]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <img
                  src={foto.image}
                  alt={foto.caption}
                  width="260"
                  height="260"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.1]"
                />
                {/* gradasi tipis permanen + lebih pekat saat hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 via-navy-dark/0 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute inset-x-3 bottom-3 translate-y-2 text-[13px] font-semibold leading-snug text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
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
