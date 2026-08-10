import { redirect } from 'next/navigation'

// Kept so any bookmarked/shared /donatur links still resolve — the landing
// page itself now lives at the root route.
export default function DonaturRedirect() {
  redirect('/')
}
