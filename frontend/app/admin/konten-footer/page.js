import DevicePreviewFrame from '@/components/inline-edit/DevicePreviewFrame'
import ContentPageHeader from '@/components/admin/ContentPageHeader'

export const metadata = {
  title: 'Konten Footer — Panel Admin',
}

// Footer dipakai di semua halaman publik, jadi sekali diubah di sini langsung
// berlaku di semua halaman.
export default function AdminKontenFooterPage() {
  return (
    <div>
      <ContentPageHeader
        title="Footer"
        note='Footer ini tampil di semua halaman publik. Tautan Facebook, Instagram & YouTube diisi lewat kotak "Tautan sosial media" yang muncul di mode edit — kosongkan untuk menyembunyikan ikonnya.'
      />
      <DevicePreviewFrame page="footer" />
    </div>
  )
}
