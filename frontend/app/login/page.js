import Link from 'next/link'
import PageHeroBackground from '@/components/layout/PageHeroBackground'
import LoginForm from './LoginForm'

export const metadata = {
  title: 'Masuk — Lazis PLN Batam',
}

export default function LoginPage() {
  return (
    <PageHeroBackground className="flex min-h-[100dvh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-[360px]">
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/75 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M12.5 15L7.5 10l5-5" />
          </svg>
          Kembali ke Beranda
        </Link>

        <div className="overflow-hidden rounded-tr-[1.5rem] rounded-bl-[1.5rem] rounded-tl-lg rounded-br-lg bg-white shadow-[0_30px_60px_-24px_rgba(6,30,40,0.55)]">
          <div className="flex flex-col items-center px-7 pb-4 pt-6 text-center">
            <img
              src="/images/logo lazis pln.png"
              alt="Lazis PLN Batam"
              className="h-8 w-auto rounded-md bg-white px-1"
            />
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">Portal Admin</p>
            <h1 className="mt-0.5 font-heading text-lg font-bold text-navy">Masuk ke Akun</h1>
          </div>

          <div className="px-7 pb-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </PageHeroBackground>
  )
}
