'use client'

// Kontrol status "tampil / sembunyi" di halaman donatur — gaya tombol radio
// yang sama seperti di "Daftar Program", tapi hanya 2 pilihan (Blog, Video,
// Galeri tidak punya konsep "tutup donasi").
//
//   active !== false → "Aktif — tampil di donatur"
//   active === false → "Sembunyikan — hilang dari donatur"
//
// onChange menerima boolean `active` yang baru.

const LABELS = {
  full: {
    active: 'Aktif — tampil di donatur',
    hidden: 'Sembunyikan — hilang dari donatur',
  },
  compact: {
    active: 'Tampil',
    hidden: 'Sembunyikan',
  },
}

const OPTIONS = [
  {
    key: 'active',
    on: 'border-green-600 bg-green-600 text-white',
    off: 'border-green-200 text-green-700 hover:bg-green-50',
  },
  {
    key: 'hidden',
    on: 'border-navy bg-navy text-white',
    off: 'border-gray-200 text-gray-500 hover:bg-gray-50',
  },
]

export default function VisibilityStatus({
  active,
  onChange,
  compact = false,
  label = 'Status di halaman donatur',
}) {
  const cur = active === false ? 'hidden' : 'active'
  const text = compact ? LABELS.compact : LABELS.full

  return (
    <div className="mb-2.5">
      {label && (
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400">
          {label}
        </p>
      )}
      <div className={compact ? 'flex flex-wrap gap-1.5' : 'flex flex-col gap-1.5'}>
        {OPTIONS.map((opt) => {
          const isOn = cur === opt.key
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => !isOn && onChange(opt.key === 'active')}
              aria-pressed={isOn}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-semibold transition-colors ${
                isOn ? opt.on : `bg-white ${opt.off}`
              }`}
            >
              <span
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                  isOn ? 'border-white' : 'border-current'
                }`}
              >
                {isOn && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              {text[opt.key]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
