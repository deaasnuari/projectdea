const { Router } = require('express')
const textElementController = require('../controllers/textElementController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', textElementController.list) // publik (admin login → lihat draft sendiri)
router.get('/:elementKey', textElementController.getOne) // publik (idem)
router.post('/publish', requireAdmin, textElementController.publish)
router.put('/:elementKey', requireAdmin, textElementController.update)
router.delete('/:elementKey', requireAdmin, textElementController.remove)

module.exports = router
