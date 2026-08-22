import Navbar from '@/components/layout/Navbar'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import AuthCard from '@/components/auth/AuthCard'
import RegisterForm from './RegisterForm'
import BackHomeLink from '@/components/auth/BackHomeLink'

export const metadata = {
  title: 'Daftar — Lazis PLN Batam',
}

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      {/* h-dvh pins the page to exactly one viewport on desktop, where the
          auth-* responsive rules in globals.css (plus RegisterForm's own
          auth-banner/auth-footer-link) keep the card shrinking to fit
          without ever scrolling. Mobile can't lean on that the same way —
          the register form is long enough that on a short phone screen
          there's no amount of shrinking left that both stays legible and
          fits, so overflow-y-auto below md lets the page scroll instead of
          clipping the bottom of the form. dvh (not vh) so heights stay true
          on mobile as the browser chrome shows/hides. "safe center" keeps
          the card vertically centered on normal screens but, on a window
          too short for it, pins it below the navbar instead of centering it
          up into — and behind — the fixed navbar; combined with
          overflow-y-auto that also means the card starts at the top and
          scrolls into view rather than being centered off-screen. */}
      <main className="h-dvh overflow-y-auto md:overflow-hidden">
        <PageHeroBackground className="auth-shell-gap flex min-h-full items-safe-center justify-center px-4 pb-6 pt-20">
          <div className="flex flex-col items-center">
            <BackHomeLink />
            <AuthCard
              eyebrow="Registrasi Karyawan"
              title="Buat Akun Baru"
              subtitle="Khusus karyawan aktif PT PLN Batam untuk mulai menunaikan zakat, infaq, dan shadaqah."
            >
              <RegisterForm />
            </AuthCard>
          </div>
        </PageHeroBackground>
      </main>
    </>
  )
}
