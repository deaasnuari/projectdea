const ContactMessage = require('../models/ContactMessage')
const { sendMail } = require('../lib/mailer')

const escapeHtml = (v) =>
  String(v).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch])

// Teruskan pesan formulir ke email LAZIS (MAIL_TO di .env). "Balas" di email
// langsung ke pengirim (replyTo). Gagal kirim email tidak menggagalkan
// formulir — pesannya tetap tersimpan di menu Pesan Masuk admin.
function forwardToEmail({ name, email, phone, message }) {
  const rows = [
    ['Nama', name],
    ['Email', email],
    ['No. HP', phone],
  ]
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#0a2e3c">
      <h2 style="margin:0 0 12px;color:#0a7e7e">Pesan baru dari website LAZIS PLN Batam</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="color:#6b7280">${k}</td><td><b>${escapeHtml(v)}</b></td></tr>`,
          )
          .join('')}
      </table>
      <p style="margin:16px 0 6px;color:#6b7280">Pesan:</p>
      <div style="white-space:pre-wrap;background:#f3f6f7;border-radius:8px;padding:12px">${escapeHtml(message)}</div>
      <p style="margin-top:16px;font-size:12px;color:#9ca3af">
        Klik "Balas" untuk membalas langsung ke ${escapeHtml(email)}. Pesan ini juga tersimpan di Panel Admin → Pesan Masuk.
      </p>
    </div>`
  const text = `Pesan baru dari website LAZIS PLN Batam

Nama: ${name}
Email: ${email}
No. HP: ${phone}

Pesan:
${message}`
  sendMail({ subject: `Pesan baru dari ${name} — Website LAZIS PLN Batam`, text, html, replyTo: email })
    .then((r) => {
      if (r?.skipped) console.warn('[mail] SMTP belum diatur di .env — pesan tidak dikirim ke email.')
    })
    .catch((err) => console.error('[mail] Gagal mengirim email pesan kontak:', err.message))
}

// POST /api/contact-messages  (publik — dari formulir Kontak Kami)
async function create(req, res, next) {
  try {
    const b = req.body || {}
    const name = String(b.name || '').trim()
    const email = String(b.email || '').trim()
    const phone = String(b.phone || '').trim()
    const message = String(b.message || '').trim()
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Nama, email, no. HP, dan pesan wajib diisi' })
    }
    if (message.length > 5000) return res.status(400).json({ error: 'Pesan terlalu panjang' })
    // Wajib menyetujui pelindungan data pribadi (UU No. 27 Tahun 2022) dulu.
    if (b.consent !== true) {
      return res.status(400).json({ error: 'Persetujuan pelindungan data pribadi wajib diberikan' })
    }

    const row = await ContactMessage.create({ name, email, phone, message, consent: true })
    forwardToEmail({ name, email, phone, message }) // tidak ditunggu — balasan ke pengunjung tetap cepat
    res.status(201).json({ id: row.id, created_at: row.created_at })
  } catch (err) {
    next(err)
  }
}

// GET /api/contact-messages?status=  (admin)
async function list(req, res, next) {
  try {
    res.json({
      data: await ContactMessage.list({ status: req.query.status }),
      stats: await ContactMessage.stats(),
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/contact-messages/stats  (admin) — dipakai badge sidebar & polling
async function stats(_req, res, next) {
  try {
    res.json(await ContactMessage.stats())
  } catch (err) {
    next(err)
  }
}

// PATCH /api/contact-messages/:id  (admin) — ubah status
async function updateStatus(req, res, next) {
  try {
    const row = await ContactMessage.updateStatus(req.params.id, req.body?.status)
    if (!row) return res.status(400).json({ error: 'Status tidak valid atau data tidak ditemukan' })
    res.json(row)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/contact-messages/:id  (admin)
async function remove(req, res, next) {
  try {
    const ok = await ContactMessage.remove(req.params.id)
    if (!ok) return res.status(404).json({ error: 'Pesan tidak ditemukan' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, list, stats, updateStatus, remove }
