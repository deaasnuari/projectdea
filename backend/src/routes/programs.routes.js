const { Router } = require('express')
const programController = require('../controllers/programController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', programController.list) // publik
router.get('/:slug', programController.getOne) // publik
router.post('/', requireAdmin, programController.create)
router.put('/:id', requireAdmin, programController.update)
router.delete('/:id', requireAdmin, programController.remove)

module.exports = router
