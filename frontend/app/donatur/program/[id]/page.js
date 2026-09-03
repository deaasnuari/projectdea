'use client'

import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProgramDetailSection from './ProgramDetailSection'
import { usePrograms } from '../usePrograms'

export default function ProgramDetailPage() {
  const { id } = useParams() // nilai route = slug program
  const { programs: allPrograms, loading } = usePrograms()
  const programs = allPrograms.filter((p) => p.active !== false) // program yang ditutup tidak bisa dibuka donatur

  const program = programs.find((p) => p.slug === id || String(p.id) === id)
  const otherPrograms = programs.filter((p) => p !== program).slice(0, 2)

  return (
    <>
      <Navbar />
      {program ? (
        <ProgramDetailSection program={program} otherPrograms={otherPrograms} />
      ) : (
        <div className="container py-40 text-center text-sm text-gray-500">
          {loading ? 'Memuat program…' : 'Program tidak ditemukan.'}
        </div>
      )}
      <Footer />
    </>
  )
}
