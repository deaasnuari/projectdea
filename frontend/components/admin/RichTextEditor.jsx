'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { Extension } from '@tiptap/core'
import FontFamily from '@tiptap/extension-font-family'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { uploadImage } from '@/services/imageFile'
import { toast } from '@/components/ui/feedback'

// Ekstensi kecil: dukung atribut font-size di mark textStyle (TipTap tidak
// menyediakan bawaan). setFontSize('18px') / unsetFontSize().
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size:${attrs.fontSize}` } : {},
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    }
  },
})

const FONTS = [
  { label: 'Font bawaan', value: '' },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Fraunces', value: "'Fraunces', Georgia, serif" },
  { label: 'Poppins', value: "'Poppins', sans-serif" },
  { label: 'Merriweather', value: "'Merriweather', Georgia, serif" },
  { label: 'Roboto Slab', value: "'Roboto Slab', Georgia, serif" },
]
const SIZES = ['', '13px', '15px', '18px', '22px', '28px', '36px']

function Btn({ on, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={on}
      disabled={disabled}
      title={title}
      className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-[13px] font-semibold transition-colors ${
        active
          ? 'border-navy bg-navy text-white'
          : 'border-gray-200 bg-white text-navy hover:border-primary/40 hover:bg-primary/5'
      } disabled:opacity-40`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ value = '', onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'rich-content min-h-[320px] rounded-b-xl bg-white px-4 py-3 outline-none',
      },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  })

  // Sinkronkan kalau `value` berubah dari luar (mis. load data awal).
  useEffect(() => {
    if (!editor) return
    const cur = editor.getHTML()
    if (value && value !== cur) editor.commands.setContent(value, false)
  }, [value, editor])

  if (!editor) {
    return <div className="min-h-[380px] rounded-xl border border-gray-200 bg-gray-50" />
  }

  const setLink = () => {
    const prev = editor.getAttributes('link').href || ''
    const url = window.prompt('URL tautan:', prev)
    if (url === null) return
    if (url === '') editor.chain().focus().extendMarkRange('link').unsetLink().run()
    else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const pickImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const url = await uploadImage(file)
        editor.chain().focus().setImage({ src: url }).run()
      } catch (e) {
        toast(e.message || 'Gagal mengunggah gambar', { tone: 'error' })
      }
    }
    input.click()
  }

  return (
    <div className="rounded-xl border border-gray-200">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
        <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Tebal">
          <b>B</b>
        </Btn>
        <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Miring">
          <i>I</i>
        </Btn>
        <Btn
          on={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Garis bawah"
        >
          <u>U</u>
        </Btn>
        <Btn on={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Coret">
          <s>S</s>
        </Btn>

        <span className="mx-1 h-6 w-px bg-gray-200" />

        <Btn on={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} title="Paragraf">
          ¶
        </Btn>
        {[2, 3, 4].map((lvl) => (
          <Btn
            key={lvl}
            on={() => editor.chain().focus().toggleHeading({ level: lvl }).run()}
            active={editor.isActive('heading', { level: lvl })}
            title={`Heading ${lvl}`}
          >
            H{lvl}
          </Btn>
        ))}

        <span className="mx-1 h-6 w-px bg-gray-200" />

        <Btn
          on={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet"
        >
          • ─
        </Btn>
        <Btn
          on={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbering"
        >
          1.
        </Btn>
        <Btn
          on={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Kutipan"
        >
          &ldquo;
        </Btn>

        <span className="mx-1 h-6 w-px bg-gray-200" />

        {['left', 'center', 'right', 'justify'].map((a) => (
          <Btn
            key={a}
            on={() => editor.chain().focus().setTextAlign(a).run()}
            active={editor.isActive({ textAlign: a })}
            title={`Rata ${a}`}
          >
            {a === 'left' ? '⯇' : a === 'center' ? '≡' : a === 'right' ? '⯈' : '⤄'}
          </Btn>
        ))}

        <span className="mx-1 h-6 w-px bg-gray-200" />

        <Btn on={setLink} active={editor.isActive('link')} title="Tautan">
          🔗
        </Btn>
        <Btn on={pickImage} title="Sisipkan gambar">
          🖼
        </Btn>
        <Btn
          on={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Sisipkan tabel"
        >
          ▦
        </Btn>
        {editor.isActive('table') && (
          <>
            <Btn on={() => editor.chain().focus().addColumnAfter().run()} title="Tambah kolom">
              +col
            </Btn>
            <Btn on={() => editor.chain().focus().addRowAfter().run()} title="Tambah baris">
              +row
            </Btn>
            <Btn on={() => editor.chain().focus().deleteTable().run()} title="Hapus tabel">
              ✕▦
            </Btn>
          </>
        )}

        <span className="mx-1 h-6 w-px bg-gray-200" />

        <label className="flex h-8 cursor-pointer items-center rounded-md border border-gray-200 bg-white px-1" title="Warna teks">
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
          />
        </label>
        <select
          onChange={(e) =>
            e.target.value
              ? editor.chain().focus().setFontFamily(e.target.value).run()
              : editor.chain().focus().unsetFontFamily().run()
          }
          className="h-8 rounded-md border border-gray-200 bg-white px-1 text-[12px]"
          title="Jenis font"
          defaultValue=""
        >
          {FONTS.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => {
            if (e.target.value) editor.chain().focus().setFontSize(e.target.value).run()
            else editor.chain().focus().unsetFontSize().run()
          }}
          className="h-8 rounded-md border border-gray-200 bg-white px-1 text-[12px]"
          title="Ukuran font"
          defaultValue=""
        >
          {SIZES.map((s) => (
            <option key={s || 'def'} value={s}>
              {s || 'Ukuran'}
            </option>
          ))}
        </select>

        <span className="mx-1 h-6 w-px bg-gray-200" />
        <Btn on={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          ↺
        </Btn>
        <Btn on={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          ↻
        </Btn>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
