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
      {/* h-dvh + overflow-hidden mengunci halaman ini pas satu layar penuh —
          background, navbar, dan card semuanya diam di tempat; tidak ada
          yang bisa di-scroll. Pakai dvh (bukan vh) supaya tingginya tetap
          akurat di HP saat address bar browser muncul/hilang. "safe center"
          bikin card berada di tengah secara vertikal di layar normal, tapi
          kalau jendelanya terlalu pendek, card ditempatkan di bawah navbar
          saja (bukan dipaksa ke tengah sampai tertutup navbar yang fixed).
          Kalau ruang yang tersisa masih kurang, padding card dan teks
          header opsionalnya akan mengecil sendiri (lihat aturan class
          auth-* di globals.css). */}
      <main className="h-dvh overflow-hidden">
        <PageHeroBackground className="auth-shell-gap flex h-full items-safe-center justify-center px-4 pb-10 pt-24">
          {/* auth-page-cozy: teks header di halaman login ini cukup pendek
              sehingga masih muat di jendela yang lebih pendek dibanding
              halaman register — lihat override .auth-page-cozy di
              globals.css. */}
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
