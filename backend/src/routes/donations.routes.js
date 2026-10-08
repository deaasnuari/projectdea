const { Router } = require('express')
const donationController = require('../controllers/donationController')
const requireAdmin = require('../middleware/requireAdmin')

const { rateLimit, formatWait } = require('../middleware/rateLimit')

const router = Router()

// Anti-spam donasi publik: per IP maksimal 5 / menit dan 30 / jam.
const donasiMenit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: (s) => `Terlalu sering mengirim donasi. Coba lagi dalam ${formatWait(s)}.`,
})
const donasiJam = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: (s) => `Batas pengiriman donasi tercapai. Coba lagi dalam ${formatWait(s)}.`,
})

router.post('/', donasiJam, donasiMenit, donationController.create) // publik — kirim donasi
router.get('/', requireAdmin, donationController.list)
router.get('/stats', requireAdmin, donationController.stats)
router.get('/jenis-options', requireAdmin, donationController.jenisOptions)
router.get('/:id/proof', requireAdmin, donationController.proof)
router.patch('/:id/status', requireAdmin, donationController.updateStatus)
router.post('/bulk-delete', requireAdmin, donationController.removeBulk) // → Sampah
router.post('/bulk-restore', requireAdmin, donationController.restoreBulk)
router.post('/bulk-purge', requireAdmin, donationController.purgeBulk) // hapus permanen
router.post('/trash/empty', requireAdmin, donationController.emptyTrash)
router.delete('/:id', requireAdmin, donationController.remove)

module.exports = router
