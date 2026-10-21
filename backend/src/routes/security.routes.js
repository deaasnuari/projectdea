const { Router } = require('express')
const c = require('../controllers/securityController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

// Semua endpoint di sini hanya untuk admin yang sudah login.
router.use(requireAdmin, (_req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})
router.get('/overview', c.overview)
router.get('/audit', c.audit)
router.post('/revoke-all', c.revokeAllSessions)

module.exports = router
