const nodemailer = require('nodemailer')

// Pengirim email (SMTP) — dipakai untuk meneruskan pesan formulir "Kontak
// Kami" ke email LAZIS. Semua pengaturan dari .env:
//   SMTP_HOST / SMTP_PORT  (bawaan: smtp.gmail.com : 465)
//   SMTP_USER / SMTP_PASS  akun pengirim (Gmail: pakai "App Password")
//   MAIL_TO                email tujuan (email LAZIS; sementara email percobaan)
//   MAIL_FROM              nama pengirim yang tampil (opsional)
// Kalau SMTP_USER/SMTP_PASS/MAIL_TO belum diisi, email dilewati saja —
// pesan tetap tersimpan di menu Pesan Masuk admin.

let transporter = null

function config() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const to = process.env.MAIL_TO
  if (!user || !pass || !to) return null
  const port = Number(process.env.SMTP_PORT) || 465
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user, pass },
    to,
    from: process.env.MAIL_FROM || `"Website LAZIS PLN Batam" <${user}>`,
  }
}

function isMailConfigured() {
  return config() !== null
}

async function sendMail({ subject, text, html, replyTo }) {
  const c = config()
  if (!c) return { skipped: true }
  if (!transporter) {
    transporter = nodemailer.createTransport({ host: c.host, port: c.port, secure: c.secure, auth: c.auth })
  }
  const info = await transporter.sendMail({ from: c.from, to: c.to, subject, text, html, replyTo })
  return { messageId: info.messageId }
}

module.exports = { sendMail, isMailConfigured }
