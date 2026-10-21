// Pembersih HTML untuk isi yang ditulis lewat editor teks admin (artikel,
// halaman menu, bagian blok) sebelum disimpan & sebelum dikirim ke publik.
// Frontend menampilkannya dengan dangerouslySetInnerHTML — tanpa pembersihan,
// satu <script>/onerror= yang terselip (mis. akun admin dibobol atau
// copy-paste dari situs lain) jadi XSS di semua pengunjung.
//
// Daftar putih: hanya tag & atribut yang memang dihasilkan editor (Tiptap).
const sanitize = require('sanitize-html')

const STYLE_OK = {
  color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^[a-z]+$/i],
  'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^[a-z]+$/i],
  'font-family': [/^[\w\s,'"-]+$/],
  'font-size': [/^[\d.]+(px|em|rem|%|pt)$/],
  'font-weight': [/^(normal|bold|[1-9]00)$/],
  'font-style': [/^(normal|italic)$/],
  'text-align': [/^(left|right|center|justify)$/],
  'text-decoration': [/^(none|underline|line-through)$/],
  width: [/^[\d.]+(px|%|em|rem)$/],
  height: [/^([\d.]+(px|%|em|rem)|auto)$/],
  'max-width': [/^[\d.]+(px|%|em|rem)$/],
}

const OPTIONS = {
  allowedTags: [
    'p', 'br', 'hr', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'mark', 'sub', 'sup', 'code', 'pre', 'blockquote',
    'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height', 'style', 'class'],
    th: ['colspan', 'rowspan', 'colwidth', 'style'],
    td: ['colspan', 'rowspan', 'colwidth', 'style'],
    col: ['style', 'span'],
    '*': ['style', 'class', 'data-text-align'],
  },
  allowedStyles: { '*': STYLE_OK },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https', 'data'] },
  allowProtocolRelative: false,
  // Tautan keluar: tidak boleh membocorkan window.opener.
  transformTags: {
    a: (tag, attribs) => {
      const out = { ...attribs }
      if (out.target === '_blank') out.rel = 'noopener noreferrer'
      return { tagName: tag, attribs: out }
    },
  },
}

const cleanHtml = (html) => (typeof html === 'string' && html ? sanitize(html, OPTIONS) : html)

// Telusuri objek/array bersarang; bersihkan nilai string pada kunci `html`/`bodyHtml`.
function cleanDeep(value) {
  if (Array.isArray(value)) return value.map(cleanDeep)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = (k === 'html' || k === 'bodyHtml') && typeof v === 'string' ? cleanHtml(v) : cleanDeep(v)
    }
    return out
  }
  return value
}

module.exports = { cleanHtml, cleanDeep }
