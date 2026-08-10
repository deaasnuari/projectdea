// Shared input styling so the login and register forms stay visually
// identical without copy-pasting the same className string into every field.
export const inputClass =
  'w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 transition-colors focus:border-primary'

export function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.5px] text-gray-600">{label}</label>
      {children}
    </div>
  )
}

// White card used by both /login and /register — logo header plus whatever
// form is passed in as children.
export default function AuthCard({ children }) {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
      <div className="mb-6">
        <img src="/images/logo lazis pln.png" alt="Lazis PLN Batam" className="h-8 w-auto" />
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-400">
          Lembaga Zakat &amp; Shadaqah
        </p>
      </div>
      {children}
    </div>
  )
}
