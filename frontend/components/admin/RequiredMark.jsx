// Tanda bintang merah untuk field yang wajib diisi di form admin. Pakai di
// dalam <label>: <label>Nama <RequiredMark /></label>. Pembaca layar
// membacanya sebagai "wajib diisi".
export default function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="ml-0.5 font-bold text-coral-dark">
        *
      </span>
      <span className="sr-only"> (wajib diisi)</span>
    </>
  )
}
