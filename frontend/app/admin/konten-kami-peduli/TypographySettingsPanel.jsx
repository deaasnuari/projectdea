'use client'

import { useState } from 'react'
import {
  usePageTypography,
  BODY_FONT_OPTIONS,
  HEADING_FONT_OPTIONS,
  FONT_SCALE_OPTIONS,
} from '@/services/pageTypography'
import { toast, confirmDialog } from '@/components/ui/feedback'

function OptionRow({ label, options, value, onPick, valueKey = 'key' }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const key = opt[valueKey]
          const on = String(value) === String(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => onPick(key)}
              aria-pressed={on}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                on
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function TypographySettingsPanel() {
  const { typo, save, reset, loading } = usePageTypography()
  const [busy, setBusy] = useState(false)

  const apply = async (patch) => {
    setBusy(true)
    try {
      await save(patch)
      toast('Tipografi halaman Kami Peduli diperbarui.', { tone: 'success' })
    } catch (err) {
      toast(err.message || 'Gagal menyimpan tipografi', { tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  const handleReset = async () => {
    const ok = await confirmDialog({
      title: 'Kembalikan ke tampilan bawaan?',
      message: 'Jenis & ukuran font halaman Kami Peduli akan dikembalikan seperti semula.',
      confirmLabel: 'Reset',
      tone: 'primary',
    })
    if (!ok) return
    setBusy(true)
    try {
      await reset()
      toast('Tipografi dikembalikan ke bawaan.', { tone: 'success' })
    } catch (err) {
      toast(err.message || 'Gagal mereset', { tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  const isDefault =
    typo.bodyFont === 'default' && typo.headingFont === 'default' && Number(typo.fontScale) === 1

  return (
    <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-sm font-bold text-navy">Tipografi Halaman</h2>
          <p className="mt-0.5 text-[13px] text-gray-500">
            Atur jenis &amp; ukuran font untuk seluruh halaman Kami Peduli. Perubahan langsung tersimpan
            &amp; tampil di situs — bisa dikembalikan ke bawaan kapan saja.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          disabled={busy || isDefault}
          className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset ke Bawaan
        </button>
      </div>

      <div className={`flex flex-col gap-4 ${busy || loading ? 'pointer-events-none opacity-60' : ''}`}>
        <OptionRow
          label="Jenis font isi (body)"
          options={BODY_FONT_OPTIONS}
          value={typo.bodyFont}
          onPick={(v) => apply({ bodyFont: v })}
        />
        <OptionRow
          label="Jenis font judul (heading)"
          options={HEADING_FONT_OPTIONS}
          value={typo.headingFont}
          onPick={(v) => apply({ headingFont: v })}
        />
        <OptionRow
          label="Ukuran font"
          options={FONT_SCALE_OPTIONS}
          value={typo.fontScale}
          onPick={(v) => apply({ fontScale: v })}
        />
      </div>
    </div>
  )
}
