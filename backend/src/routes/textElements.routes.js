const { Router } = require('express')
const textElementController = require('../controllers/textElementController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', textElementController.list) // publik
router.get('/:elementKey', textElementController.getOne) // publik
router.put('/:elementKey', requireAdmin, textElementController.update)
router.delete('/:elementKey', requireAdmin, textElementController.remove)

module.exports = router
