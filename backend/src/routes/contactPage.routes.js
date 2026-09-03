const { Router } = require('express')
const contactPageController = require('../controllers/contactPageController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', contactPageController.get) // publik
router.put('/', requireAdmin, contactPageController.update)

module.exports = router
