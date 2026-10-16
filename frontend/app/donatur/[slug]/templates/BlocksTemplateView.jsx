'use client'

import { useState } from 'react'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import DonationModal from '@/components/donation/DonationModal'

// Template berbasis bagian (blok) — lihat services/pageBlocks.js. Tiap blok
// dirender berurutan; blok yang dimatikan admin (visible=false) dilewati,
// begitu juga blok yang isinya masih kosong.
const has = (s) => String(s ?? '').trim() !== ''

function Section({ tone, children, id }) {
  return (
    <section id={id} className={`py-12 sm:py-16 ${tone === 'gray' ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="container">
        <div className="mx-auto max-w-[900px]">{children}</div>
      </div>
    </section>
  )
}

function Heading({ children, center = true }) {
  if (!has(children)) return null
  return (
    <h2
      className={`mb-8 font-heading text-2xl font-bold text-navy after:mt-3 after:block after:h-1 after:w-12 after:rounded-full after:bg-gold sm:text-3xl ${
        center ? 'text-center after:mx-auto' : ''
      }`}
    >
      {children}
    </h2>
  )
}

function Hero({ p, menu, isPreview }) {
  const external = /^https?:\/\//.test(p.ctaHref || '')
  return (
    <PageHeroBackground className="pb-14 pt-28 sm:pb-20">
      <div className="container">
        <div className={`grid items-center gap-8 ${p.image ? 'md:grid-cols-[1.1fr_0.9fr]' : ''}`}>
          <div>
            {isPreview && (
              <span className="mb-4 inline-block rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy">
                Pratinjau — belum dipublikasikan
              </span>
            )}
            <p className="section-label !text-gold">{has(p.eyebrow) ? p.eyebrow : menu?.name}</p>
            <h1 className="max-w-[720px] font-heading text-4xl font-semibold leading-[1.15] text-white max-[600px]:text-3xl sm:text-5xl">
              {p.title}
            </h1>
            {has(p.subtitle) && <p className="mt-4 max-w-[560px] text-lg leading-relaxed text-white/80">{p.subtitle}</p>}
            {has(p.ctaLabel) && has(p.ctaHref) && (
              <a
                href={p.ctaHref}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="btn btn-gold mt-7 inline-flex"
              >
                {p.ctaLabel}
              </a>
            )}
          </div>
          {p.image && (
            <img
              src={p.image}
              alt={p.title}
              className="w-full rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-lg rounded-br-lg object-cover shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]"
            />
          )}
        </div>
      </div>
    </PageHeroBackground>
  )
}

function Faq({ p }) {
  const list = (p.items || []).filter((x) => has(x.q))
  if (!list.length) return null
  return (
    <>
      <Heading>{p.heading}</Heading>
      <div className="flex flex-col gap-3">
        {list.map((x, i) => (
          <details key={i} className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/[0.05]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy">
              {x.q}
              <span className="text-xl text-primary transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{x.a}</p>
          </details>
        ))}
      </div>
    </>
  )
}

export default function BlocksTemplateView({ menu, page, isPreview }) {
  const [donate, setDonate] = useState(null) // blok donasi yang sedang dibuka
  const title = page?.title?.trim() || menu?.name || ''
  const blocks = (Array.isArray(page?.data?.blocks) ? page.data.blocks : []).filter((b) => b && b.visible !== false)

  let n = 0 // selang-seling latar putih / abu untuk blok non-hero
  const tone = () => (n++ % 2 === 0 ? 'white' : 'gray')

  const jenisOverride = [{ id: 'menu-program', key: 'menu-program', label: menu?.name || 'Program' }]

  const render = (b) => {
    const p = b.props || {}
    switch (b.type) {
      case 'hero':
        return <Hero key={b.id} p={p} menu={menu} isPreview={isPreview} />

      case 'text':
        if (!has(p.html) && !has(p.heading)) return null
        return (
          <Section key={b.id} tone={tone()}>
            <Heading center={false}>{p.heading}</Heading>
            {has(p.html) && <div className="rich-content" dangerouslySetInnerHTML={{ __html: p.html }} />}
          </Section>
        )

      case 'image':
        if (!p.src) return null
        return (
          <Section key={b.id} tone={tone()}>
            <figure>
              <img src={p.src} alt={p.caption || title} className="w-full rounded-2xl shadow-md" />
              {has(p.caption) && <figcaption className="mt-3 text-center text-sm text-gray-500">{p.caption}</figcaption>}
            </figure>
          </Section>
        )

      case 'features': {
        const list = (p.items || []).filter((x) => has(x.title) || has(x.desc))
        if (!list.length) return null
        return (
          <Section key={b.id} tone={tone()}>
            <Heading>{p.heading}</Heading>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((x, i) => (
                <div
                  key={i}
                  className="rounded-tr-2xl rounded-bl-2xl rounded-tl-md rounded-br-md bg-white p-6 shadow-[0_2px_16px_rgba(6,30,40,0.07)] ring-1 ring-black/[0.04]"
                >
                  <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                    {x.icon || '✨'}
                  </span>
                  <h3 className="mb-1 font-heading text-lg font-semibold text-navy">{x.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{x.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        )
      }

      case 'stats': {
        const list = (p.items || []).filter((x) => has(x.value))
        if (!list.length) return null
        return (
          <section key={b.id} className="bg-navy py-5 text-white sm:py-6">
            <div className="container">
              <div
                className={`mx-auto grid max-w-[900px] gap-3 text-center sm:gap-6 ${
                  list.length >= 3 ? 'grid-cols-3' : list.length === 2 ? 'grid-cols-2' : ''
                }`}
              >
                {list.map((x, i) => (
                  <div key={i}>
                    <p className="font-heading text-lg font-extrabold leading-tight text-gold min-[420px]:text-2xl sm:text-3xl">{x.value}</p>
                    <p className="mt-0.5 text-[10px] font-medium uppercase leading-tight tracking-wide text-white/70 sm:text-xs">{x.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      }

      case 'steps': {
        const list = (p.items || []).filter((x) => has(x.title) || has(x.desc))
        if (!list.length) return null
        return (
          <Section key={b.id} tone={tone()}>
            <Heading>{p.heading}</Heading>
            <ol className="relative flex flex-col gap-6 border-l-2 border-primary/20 pl-8">
              {list.map((x, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[2.85rem] flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-white ring-4 ring-white">
                    {i + 1}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-navy">{x.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{x.desc}</p>
                </li>
              ))}
            </ol>
          </Section>
        )
      }

      case 'gallery': {
        const imgs = (p.images || []).filter(Boolean)
        if (!imgs.length) return null
        return (
          <Section key={b.id} tone={tone()}>
            <Heading>{p.heading}</Heading>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {imgs.map((u, i) => (
                <img key={i} src={u} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
              ))}
            </div>
          </Section>
        )
      }

      case 'faq':
        if (!(p.items || []).some((x) => has(x.q))) return null
        return (
          <Section key={b.id} tone={tone()}>
            <Faq p={p} />
          </Section>
        )

      case 'donate': {
        const banks = (p.banks || []).filter((x) => has(x.name) || has(x.noRek))
        return (
          <Section key={b.id} id="donasi" tone={tone()}>
            <div className="rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-lg rounded-br-lg bg-gradient-to-br from-primary-dark to-navy p-8 text-center text-white shadow-lg sm:p-12">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">{p.heading}</h2>
              {has(p.text) && <p className="mx-auto mt-3 max-w-[560px] text-white/80">{p.text}</p>}
              <button type="button" onClick={() => setDonate({ banks })} className="btn btn-gold mt-6">
                {p.buttonLabel || 'Donasi Sekarang'}
              </button>
              {banks.length > 0 && (
                <div className="mx-auto mt-8 grid max-w-[640px] gap-3 text-left sm:grid-cols-2">
                  {banks.map((x, i) => (
                    <div key={i} className="rounded-xl bg-white/10 p-4 backdrop-blur">
                      <p className="text-xs font-bold uppercase tracking-wide text-gold">{x.name}</p>
                      <p className="mt-1 font-heading text-xl font-bold tracking-wide">{x.noRek}</p>
                      {has(x.owner) && <p className="text-xs text-white/70">a.n. {x.owner}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>
        )
      }

      case 'cta':
        if (!has(p.heading) && !has(p.buttonLabel)) return null
        return (
          <Section key={b.id} tone={tone()}>
            <div className="rounded-2xl bg-primary/[0.07] p-8 text-center ring-1 ring-primary/15 sm:p-10">
              <h2 className="font-heading text-2xl font-bold text-navy">{p.heading}</h2>
              {has(p.text) && <p className="mx-auto mt-2 max-w-[520px] text-gray-600">{p.text}</p>}
              {has(p.buttonLabel) && has(p.buttonHref) && (
                <a href={p.buttonHref} className="btn btn-primary mt-5 inline-flex">
                  {p.buttonLabel}
                </a>
              )}
            </div>
          </Section>
        )

      default:
        return null
    }
  }

  const hasHero = blocks.some((b) => b.type === 'hero')

  return (
    <>
      {/* Tanpa blok banner? Tetap beri judul supaya halaman tidak terasa terpotong. */}
      {!hasHero && <Hero p={{ title }} menu={menu} isPreview={isPreview} />}
      {blocks.map(render)}
      {blocks.length === 0 && (
        <p className="container py-16 text-center text-sm text-gray-400">Konten halaman ini belum diisi.</p>
      )}

      <DonationModal
        open={Boolean(donate)}
        onClose={() => setDonate(null)}
        scope="program"
        sourceLabel={title}
        initialJenisId="menu-program"
        jenisOverride={jenisOverride}
        banksOverride={donate?.banks || []}
      />
    </>
  )
}
