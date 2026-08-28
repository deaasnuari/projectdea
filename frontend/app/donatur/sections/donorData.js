export const DONOR_CONTENT_STORAGE_KEY = 'lazis-pln-donor-content'

export const DEFAULT_DONOR_CONTENT = {
  title: 'Jumlah Donatur Saat Ini',
  description: 'Kepercayaan yang tumbuh dari kebaikan yang dilakukan bersama.',
  stats: [
    { value: 157, label: 'Donatur Zakat' },
    { value: 21, label: 'Donatur Infaq' },
    { value: 1, label: 'Donatur Orang Tua Asuh' },
  ],
}

export function getDonorContent() {
  if (typeof window === 'undefined') return DEFAULT_DONOR_CONTENT

  try {
    const saved = window.localStorage.getItem(DONOR_CONTENT_STORAGE_KEY)
    if (!saved) return DEFAULT_DONOR_CONTENT

    const parsed = JSON.parse(saved)
    if (!parsed || !Array.isArray(parsed.stats) || parsed.stats.length !== 3) {
      return DEFAULT_DONOR_CONTENT
    }

    return parsed
  } catch {
    return DEFAULT_DONOR_CONTENT
  }
}

export function saveDonorContent(content) {
  window.localStorage.setItem(DONOR_CONTENT_STORAGE_KEY, JSON.stringify(content))
  window.dispatchEvent(new Event('donor-content-updated'))
}
