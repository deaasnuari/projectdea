const { Router } = require('express')
const donorInfoController = require('../controllers/donorInfoController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', donorInfoController.get) // publik
router.put('/', requireAdmin, donorInfoController.update)

module.exports = router
