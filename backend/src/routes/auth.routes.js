const { Router } = require('express')
const authController = require('../controllers/authController')
const requireAdmin = require('../middleware/requireAdmin')
const { rateLimit, formatWait } = require('../middleware/rateLimit')

const router = Router()

router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/me', authController.me)

// Ubah password sendiri — butuh password lama yang benar (publik).
router.post('/change-password', authController.changePassword)

// Lupa password: kode 6 digit dikirim ke email akun, lalu dipakai untuk reset.
const emailLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: (s) => `Terlalu sering meminta kode. Coba lagi dalam ${formatWait(s)}.`,
})
router.post('/forgot-password', emailLimit, authController.forgotPassword)
router.post('/reset-password', emailLimit, authController.resetPassword)

// CRUD akun admin — semua butuh sesi admin.
router.get('/accounts', requireAdmin, authController.listAccounts)
router.post('/register', requireAdmin, authController.register)
router.delete('/accounts/:id', requireAdmin, authController.removeAccount)
router.post('/accounts/:id/reset-password', requireAdmin, authController.resetAccountPassword)

module.exports = router
