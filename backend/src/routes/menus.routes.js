const { Router } = require('express')
const menuController = require('../controllers/menuController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', menuController.publicTree) // publik — navbar
router.get('/all', requireAdmin, menuController.adminList) // admin — panel
router.put('/reorder', requireAdmin, menuController.reorder) // admin — drag-drop
router.get('/:idOrSlug', menuController.getOne) // publik (draft butuh ?preview=1 + sesi admin)
router.post('/', requireAdmin, menuController.create)
router.put('/:id', requireAdmin, menuController.update)
router.put('/:id/page', requireAdmin, menuController.savePage)
router.delete('/:id', requireAdmin, menuController.remove)

module.exports = router
