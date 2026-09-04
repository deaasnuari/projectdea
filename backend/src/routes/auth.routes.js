const { Router } = require('express')
const authController = require('../controllers/authController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/me', authController.me)

// Ubah password sendiri — butuh password lama yang benar (publik).
router.post('/change-password', authController.changePassword)

// CRUD akun admin — semua butuh sesi admin.
router.get('/accounts', requireAdmin, authController.listAccounts)
router.post('/register', requireAdmin, authController.register)
router.delete('/accounts/:id', requireAdmin, authController.removeAccount)
router.post('/accounts/:id/reset-password', requireAdmin, authController.resetAccountPassword)

module.exports = router
