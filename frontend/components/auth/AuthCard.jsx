// Style input yang dipakai bersama supaya tampilan form login dan register
// tetap sama persis, tanpa perlu copy-paste className yang sama di tiap field.
// Padding kiri sengaja disediakan untuk tempat ikon di setiap Field.
export const inputClass =
  'w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-2.5 text-xs text-gray-800 outline-none transition-colors focus:border-primary focus:bg-white'

//ini fungsi untuk menampilkan ikon di form login dan register
function AuthIcon({ name, className = 'h-3 w-3' }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
  }
  switch (name) {
    case 'user':
      return (
        <svg {...common}>
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...common}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 6l-10 7L2 6" />
        </svg>
      )
    case 'hash':
      return (
        <svg {...common}>
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="15" x2="20" y2="15" />
          <line x1="10" y1="3" x2="8" y2="21" />
          <line x1="16" y1="3" x2="14" y2="21" />
        </svg>
      )
    case 'briefcase':
      return (
        <svg {...common}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </svg>
      )
    default:
      return null
  }
}

//ini fungsi untuk menampilkan field di form login dan register
export function Field({ label, icon, children }) {
  return (
    <div className="auth-field">
      <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-[0.5px] text-gray-600">{label}</label>
      <div className="group relative">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary">
          <AuthIcon name={icon} />
        </span>
        {children}
      </div>
    </div>
  )
}

//ini fungsi untuk menampilkan card login dan register
export default function AuthCard({ eyebrow, title, subtitle, children }) {
  return (
    <div className="w-full max-w-[340px] overflow-hidden rounded-tr-[1.75rem] rounded-bl-[1.75rem] rounded-tl-lg rounded-br-lg bg-white shadow-[0_32px_70px_-24px_rgba(6,30,40,0.55)]">
      <div className="auth-card-header border-b border-gray-100">
        <img src="/images/logo lazis pln.png" alt="Lazis PLN Batam" className="h-5 w-auto" />
        <p className="auth-card-tagline mt-0.5 text-[9px] font-semibold uppercase tracking-[1.5px] text-gray-400">
          Lembaga Zakat &amp; Shadaqah
        </p>

        {(eyebrow || title || subtitle) && (
          <div className="auth-optional-copy mt-2">
            {eyebrow && <p className="section-label !mb-0.5 !text-[10px] !text-primary">{eyebrow}</p>}
            {title && <h1 className="font-heading text-sm font-bold text-navy">{title}</h1>}
            {subtitle && <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">{subtitle}</p>}
          </div>
        )}
      </div>
      <div className="auth-card-body">{children}</div>
    </div>
  )
}
