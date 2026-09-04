const { query } = require('../config/db')
const { hashPassword, verifyPassword } = require('../lib/password')

function toApi(row) {
  if (!row) return null
  return {
    id: Number(row.id),
    username: row.username,
    name: row.name || '',
    nik: row.nik || '',
    email: row.email || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function list() {
  const { rows } = await query('select * from admin_accounts order by created_at asc')
  return rows.map(toApi)
}

async function count() {
  const { rows } = await query('select count(*)::int as n from admin_accounts')
  return rows[0].n
}

// Dipakai internal untuk verifikasi login — ikut membawa password_hash.
async function findByUsername(username) {
  const { rows } = await query('select * from admin_accounts where lower(username) = lower($1)', [
    String(username || '').trim(),
  ])
  return rows[0] || null
}

async function findById(id) {
  const { rows } = await query('select * from admin_accounts where id = $1', [id])
  return rows[0] || null
}

async function create(d) {
  const username = String(d.username || '').trim()
  if (!username) throw new Error('Username wajib diisi')
  if (String(d.password || '').length < 6) throw new Error('Password minimal 6 karakter')

  const exists = await findByUsername(username)
  if (exists) throw new Error('Username sudah dipakai')

  const { rows } = await query(
    `insert into admin_accounts (username, name, nik, email, password_hash)
     values ($1, $2, $3, $4, $5)
     returning *`,
    [
      username,
      String(d.name || '').trim(),
      String(d.nik || '').trim(),
      String(d.email || '').trim(),
      hashPassword(d.password),
    ],
  )
  return toApi(rows[0])
}

// Ganti password. Buat baris baru kalau username belum ada di tabel
// (mis. akun bawaan dari env yang baru pertama kali ganti password).
async function setPassword(username, newPassword, extra = {}) {
  if (String(newPassword || '').length < 6) throw new Error('Password baru minimal 6 karakter')
  const uname = String(username || '').trim()
  const row = await findByUsername(uname)
  if (row) {
    const { rows } = await query(
      `update admin_accounts set password_hash = $2, updated_at = now() where id = $1 returning *`,
      [row.id, hashPassword(newPassword)],
    )
    return toApi(rows[0])
  }
  const { rows } = await query(
    `insert into admin_accounts (username, name, nik, email, password_hash)
     values ($1, $2, $3, $4, $5)
     returning *`,
    [
      uname,
      String(extra.name || '').trim(),
      String(extra.nik || '').trim(),
      String(extra.email || '').trim(),
      hashPassword(newPassword),
    ],
  )
  return toApi(rows[0])
}

async function remove(id) {
  const { rowCount } = await query('delete from admin_accounts where id = $1', [id])
  return rowCount > 0
}

// true kalau username+password cocok dengan salah satu baris di tabel.
// null kalau username tidak ada di tabel (biar pemanggil bisa fallback ke env).
async function checkCredentials(username, password) {
  const row = await findByUsername(username)
  if (!row) return null
  return verifyPassword(password, row.password_hash)
}

module.exports = {
  toApi,
  list,
  count,
  findByUsername,
  findById,
  create,
  setPassword,
  remove,
  checkCredentials,
}
