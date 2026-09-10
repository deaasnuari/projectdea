'use client'

import { useParams, useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useMenuPage } from '@/services/menus'
import TextTemplateView from './templates/TextTemplateView'
import BlogTemplateView from './templates/BlogTemplateView'
import ProgramTemplateView from './templates/ProgramTemplateView'

// Route catch-all 1 segmen untuk halaman yang dibuat admin lewat "Manajemen
// Menu". Next mendahulukan route statis (blog/, program/, tentang-kami/, dst)
// sehingga halaman existing TIDAK ter-override oleh route ini.
export default function DynamicMenuPage() {
  const { slug } = useParams()
  const search = useSearchParams()
  const preview = search.get('preview') === '1'
  const { loading, menu, page, notFound } = useMenuPage(slug, { preview })

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-40 text-center text-sm text-gray-400">Memuat halaman…</div>
        <Footer />
      </>
    )
  }

  // Menu system tidak punya halaman template — arahkan info sederhana.
  const ok = menu && menu.templateType !== 'system' && (preview || page?.status === 'published')

  if (notFound || !ok) {
    return (
      <>
        <Navbar />
        <div className="container flex min-h-[50vh] flex-col items-center justify-center py-32 text-center">
          <p className="font-heading text-2xl font-bold text-navy">Halaman tidak ditemukan</p>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            Halaman ini belum tersedia atau belum dipublikasikan.
          </p>
        </div>
        <Footer />
      </>
    )
  }

  const isPreview = preview && page?.status !== 'published'

  return (
    <>
      <Navbar />
      {menu.templateType === 'text' && (
        <TextTemplateView menu={menu} page={page} isPreview={isPreview} />
      )}
      {menu.templateType === 'blog' && (
        <BlogTemplateView menu={menu} page={page} isPreview={isPreview} />
      )}
      {menu.templateType === 'program' && (
        <ProgramTemplateView menu={menu} page={page} isPreview={isPreview} />
      )}
      <Footer />
    </>
  )
}
