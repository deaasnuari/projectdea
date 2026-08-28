'use client'

// Tombol kecil "Tambah" / "Hapus" untuk daftar yang bisa diedit inline.
// Pemanggil yang menentukan kapan tampil (biasanya `isAdmin` dari useEditMode).

export function AddItemButton({ onClick, label = 'Tambah', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-[0_4px_12px_-4px_rgba(10,126,126,0.6)] ring-1 ring-white/30 transition-colors hover:bg-primary-dark ${className}`}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13" aria-hidden="true">
        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
      </svg>
      {label}
    </button>
  )
}

export function DeleteItemButton({ onClick, label = 'Hapus', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex items-center gap-1 text-xs font-bold text-coral transition-colors hover:text-coral-dark ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13" aria-hidden="true">
        <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6" />
      </svg>
      {label}
    </button>
  )
}
