// Model admin. Kredensial dari env (satu admin). Kalau nanti perlu
// multi-user, ganti verify() dengan query ke tabel users.

function verify(username, password) {
  return (
    username === (process.env.ADMIN_USERNAME || 'admin') &&
    password === (process.env.ADMIN_PASSWORD || 'admin123')
  )
}

module.exports = { verify }
