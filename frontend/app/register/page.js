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
      {/* h-dvh mengunci halaman ini pas satu layar penuh di desktop, di mana
          aturan responsif auth-* di globals.css (ditambah auth-banner /
          auth-footer-link milik RegisterForm sendiri) membuat card terus
          mengecil supaya muat tanpa perlu di-scroll. Di HP, cara ini tidak
          bisa diandalkan sepenuhnya — form register-nya cukup panjang
          sehingga di layar HP yang pendek, sekecil apapun elemen-elemennya
          tetap tidak akan cukup sambil masih bisa dibaca. Makanya di bawah
          breakpoint md dipakai overflow-y-auto supaya halamannya bisa
          di-scroll, daripada bagian bawah form-nya terpotong. Pakai dvh
          (bukan vh) supaya tingginya tetap akurat di HP saat address bar
          browser muncul/hilang. "safe center" bikin card di tengah secara
          vertikal di layar normal, tapi kalau jendelanya terlalu pendek,
          card ditempatkan di bawah navbar saja (bukan dipaksa ke tengah
          sampai tertutup navbar yang fixed); dikombinasikan dengan
          overflow-y-auto, artinya card mulai dari atas dan baru terlihat
          saat di-scroll, bukan malah tersembunyi di luar layar karena
          dipaksa center. */}
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
