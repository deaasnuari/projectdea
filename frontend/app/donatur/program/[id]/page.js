import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { PROGRAMS } from '../programData'
import { getProgramById } from '@/services/program'
import ProgramDetailSection from './ProgramDetailSection'

export function generateStaticParams() {
  return PROGRAMS.map((program) => ({ id: program.id }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const program = getProgramById(id)
  if (!program) return { title: 'Program — Lazis PLN Batam' }
  return { title: `${program.title} — Lazis PLN Batam` }
}

export default async function ProgramDetailPage({ params }) {
  const { id } = await params
  const program = getProgramById(id)
  if (!program) notFound()

  const otherPrograms = PROGRAMS.filter((p) => p.id !== program.id).slice(0, 2)

  return (
    <>
      <Navbar />
      <ProgramDetailSection program={program} otherPrograms={otherPrograms} />
      <Footer />
    </>
  )
}
