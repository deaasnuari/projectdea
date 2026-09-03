const { Router } = require('express')
const contentController = require('../controllers/contentController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/:key', contentController.get)
router.put('/:key', requireAdmin, contentController.update)

module.exports = router
