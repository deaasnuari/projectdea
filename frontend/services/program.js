// Fungsi bantuan (bukan data, bukan halaman) untuk fitur program donasi.
// Data programnya sendiri tetap di app/donatur/program/programData.js.
import { PROGRAMS } from '@/app/donatur/program/programData'

export function getProgramById(id) {
  return PROGRAMS.find((program) => program.id === id)
}
