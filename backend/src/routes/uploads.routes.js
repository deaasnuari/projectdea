const { Router } = require('express')
const uploadController = require('../controllers/uploadController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.post('/', requireAdmin, uploadController.create)

module.exports = router
