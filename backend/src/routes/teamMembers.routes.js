const { Router } = require('express')
const teamMemberController = require('../controllers/teamMemberController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.get('/', teamMemberController.list) // publik
router.post('/', requireAdmin, teamMemberController.create)
router.put('/:id', requireAdmin, teamMemberController.update)
router.delete('/:id', requireAdmin, teamMemberController.remove)

module.exports = router
