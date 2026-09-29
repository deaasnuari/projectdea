const { Router } = require('express')
const c = require('../controllers/contactMessageController')
const requireAdmin = require('../middleware/requireAdmin')
const { rateLimit, formatWait } = require('../middleware/rateLimit')

const router = Router()

// Anti-spam formulir "Kirim Pesan" (tiap pesan juga dikirim ke email admin):
// per alamat IP maksimal 2 pesan / menit dan 10 pesan / jam.
const perMenit = rateLimit({
  windowMs: 60 * 1000,
  max: 2,
  message: (s) => `Terlalu sering mengirim pesan. Coba lagi dalam ${formatWait(s)}.`,
})
const perJam = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: (s) => `Batas pengiriman pesan tercapai. Coba lagi dalam ${formatWait(s)}.`,
})

router.post('/', perJam, perMenit, c.create) // publik — kirim pesan dari formulir
router.get('/', requireAdmin, c.list)
router.get('/stats', requireAdmin, c.stats)
router.patch('/:id', requireAdmin, c.updateStatus)
router.delete('/:id', requireAdmin, c.remove)

module.exports = router
