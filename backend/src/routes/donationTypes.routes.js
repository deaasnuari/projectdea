const { Router } = require('express')
const donationTypeController = require('../controllers/donationTypeController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', donationTypeController.list) // publik (dipakai modal donasi & form program)
router.post('/', requireAdmin, donationTypeController.create)
router.put('/:id', requireAdmin, donationTypeController.update)
router.delete('/:id', requireAdmin, donationTypeController.remove)

module.exports = router
