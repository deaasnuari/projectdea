'use client'

export default function AdminModal({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-navy-dark/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Scroll-nya di dalam kartu ini sendiri (bukan di overlay) supaya
          kartu tidak ikut geser dari tengah layar; bar-nya disembunyikan
          (.no-scrollbar) supaya tidak nongol di sudut yang melengkung. */}
      <div
        className="no-scrollbar relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-tr-[2rem] rounded-bl-[2rem] rounded-tl-lg rounded-br-lg bg-white p-6 shadow-[0_32px_70px_-24px_rgba(6,30,40,0.55)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <h3 className="mb-6 pr-8 font-heading text-lg font-bold text-navy">{title}</h3>
        {children}
      </div>
    </div>
  )
}
