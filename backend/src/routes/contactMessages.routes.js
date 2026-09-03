const { Router } = require('express')
const c = require('../controllers/contactMessageController')
const requireAdmin = require('../middleware/requireAdmin')

const router = Router()

router.post('/', c.create) // publik — kirim pesan dari formulir
router.get('/', requireAdmin, c.list)
router.patch('/:id', requireAdmin, c.updateStatus)
router.delete('/:id', requireAdmin, c.remove)

module.exports = router
