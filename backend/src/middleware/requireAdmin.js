const { COOKIE_NAME, verifyToken } = require('../lib/session')

// Middleware: tolak kalau tidak ada cookie sesi admin yang valid.
function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME]
  if (verifyToken(token) === null) {
    return res.status(401).json({ error: 'Butuh login admin' })
  }
  next()
}

module.exports = requireAdmin
