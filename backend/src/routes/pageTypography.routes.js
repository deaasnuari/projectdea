const { Router } = require('express')
const pageTypographyController = require('../controllers/pageTypographyController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', pageTypographyController.get) // publik
router.put('/', requireAdmin, pageTypographyController.update)
router.post('/reset', requireAdmin, pageTypographyController.reset)

module.exports = router
