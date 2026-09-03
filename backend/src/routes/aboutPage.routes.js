const { Router } = require('express')
const aboutPageController = require('../controllers/aboutPageController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', aboutPageController.get) // publik
router.put('/', requireAdmin, aboutPageController.update)

module.exports = router
