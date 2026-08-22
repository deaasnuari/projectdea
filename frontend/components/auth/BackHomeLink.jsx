import Link from 'next/link'

//ini
export default function BackHomeLink() {
  return (
    <Link
      href="/"
      className="auth-back-link mb-3 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M12.5 15L7.5 10l5-5" />
      </svg>
      Kembali ke Beranda
    </Link>
  )
}
