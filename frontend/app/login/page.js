import Navbar from '@/components/layout/Navbar'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import AuthCard from '@/components/auth/AuthCard'
import LoginForm from './LoginForm'
import BackHomeLink from '@/components/auth/BackHomeLink'

export const metadata = {
  title: 'Masuk — Lazis PLN Batam',
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      {/* h-dvh + overflow-hidden pins the page to exactly one viewport — the
          background, navbar, and card all stay put; nothing here ever
          scrolls. dvh (not vh) so heights stay true on mobile as the
          browser chrome shows/hides. "safe center" keeps the card
          vertically centered on normal screens but, on a window too short
          for it, pins it below the navbar instead of centering it up into
          — and behind — the fixed navbar. Whatever headroom that still
          leaves too tight, the card's own padding and optional header
          copy shrink to fit (see the auth-* rules in globals.css). */}
      <main className="h-dvh overflow-hidden">
        <PageHeroBackground className="auth-shell-gap flex h-full items-safe-center justify-center px-4 pb-10 pt-24">
          {/* auth-page-cozy: login's own header copy is short enough to
              keep down to a shorter window than register's needs — see
              the .auth-page-cozy override in globals.css. */}
          <div className="auth-page-cozy flex flex-col items-center">
            <BackHomeLink />
            <AuthCard
              eyebrow="Portal Admin"
              title="Masuk ke Akun Anda"
              subtitle="Kelola donasi dan program Lazis PLN Batam dari satu tempat."
            >
              <LoginForm />
            </AuthCard>
          </div>
        </PageHeroBackground>
      </main>
    </>
  )
}
