const { Router } = require('express')
const donationController = require('../controllers/donationController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.post('/', donationController.create) // publik — kirim donasi
router.get('/', requireAdmin, donationController.list)
router.get('/stats', requireAdmin, donationController.stats)
router.get('/jenis-options', requireAdmin, donationController.jenisOptions)
router.get('/:id/proof', requireAdmin, donationController.proof)
router.patch('/:id/status', requireAdmin, donationController.updateStatus)
router.delete('/:id', requireAdmin, donationController.remove)

module.exports = router
