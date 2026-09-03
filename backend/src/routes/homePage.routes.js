const { Router } = require('express')
const homePageController = require('../controllers/homePageController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', homePageController.get) // publik
router.put('/', requireAdmin, homePageController.update)

module.exports = router
