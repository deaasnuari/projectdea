const { Router } = require('express')
const blogController = require('../controllers/blogController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', blogController.list) // publik
router.get('/:slug', blogController.getOne) // publik
router.post('/', requireAdmin, blogController.create)
router.put('/:id', requireAdmin, blogController.update)
router.delete('/:id', requireAdmin, blogController.remove)

module.exports = router
