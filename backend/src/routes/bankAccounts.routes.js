const { Router } = require('express')
const bankAccountController = require('../controllers/bankAccountController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', bankAccountController.list) // publik (dipakai modal donasi)
router.post('/', requireAdmin, bankAccountController.create)
router.put('/:id', requireAdmin, bankAccountController.update)
router.delete('/:id', requireAdmin, bankAccountController.remove)

module.exports = router
