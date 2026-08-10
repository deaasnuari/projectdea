import Navbar from '@/components/layout/Navbar'
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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-32">
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-bg.png" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,46,60,0.92)] via-[rgba(10,126,126,0.75)] to-[rgba(10,46,60,0.85)]" />
        </div>
        <div className="relative z-[1] flex flex-col items-center">
          <BackHomeLink />
          <AuthCard>
            <RegisterForm />
          </AuthCard>
        </div>
      </main>
    </>
  )
}
