const { Router } = require('express')
const healthController = require('../controllers/healthController')
const authRoutes = require('./auth.routes')
const contentRoutes = require('./content.routes')
const donationRoutes = require('./donations.routes')
const blogRoutes = require('./blog.routes')
const programRoutes = require('./programs.routes')
const bankAccountRoutes = require('./bankAccounts.routes')
const donationTypeRoutes = require('./donationTypes.routes')
const teamMemberRoutes = require('./teamMembers.routes')
const uploadRoutes = require('./uploads.routes')
const docRoutes = require('./doc.routes')
const donorInfoRoutes = require('./donorInfo.routes')
const homePageRoutes = require('./homePage.routes')
const aboutPageRoutes = require('./aboutPage.routes')
const contactPageRoutes = require('./contactPage.routes')
const contactMessageRoutes = require('./contactMessages.routes')
const textElementRoutes = require('./textElements.routes')
const menuRoutes = require('./menus.routes')
const securityRoutes = require('./security.routes')
const { createChallenge } = require('../lib/captcha')
const { rateLimit, formatWait } = require('../middleware/rateLimit')

const router = Router()

router.get('/health', healthController.check)

// Soal CAPTCHA untuk form publik (donasi & kontak). Dibatasi per IP supaya
// tidak bisa dipakai untuk menguras server.
router.get(
  '/captcha',
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: (s) => `Terlalu sering meminta soal verifikasi. Coba lagi dalam ${formatWait(s)}.`,
  }),
  (_req, res) => {
    res.set('Cache-Control', 'no-store')
    res.json(createChallenge())
  },
)

// Thumbnail YouTube lewat server sendiri — browser pengunjung tidak perlu
// menghubungi google/youtube (menghindari cookie pihak ketiga). Di-cache di memori.
const ytThumbCache = new Map()
router.get('/yt-thumb/:id', async (req, res) => {
  const id = req.params.id
  if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return res.status(400).end()
  try {
    let buf = ytThumbCache.get(id)
    if (!buf) {
      const r = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)
      if (!r.ok) return res.status(404).end()
      buf = Buffer.from(await r.arrayBuffer())
      if (ytThumbCache.size > 100) ytThumbCache.clear()
      ytThumbCache.set(id, buf)
    }
    res.set({ 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=604800' })
    res.send(buf)
  } catch {
    res.status(502).end()
  }
})
router.use('/auth', authRoutes)
router.use('/security', securityRoutes)
router.use('/content', contentRoutes)
router.use('/donations', donationRoutes)
router.use('/blog', blogRoutes)
router.use('/programs', programRoutes)
router.use('/bank-accounts', bankAccountRoutes)
router.use('/donation-types', donationTypeRoutes)
router.use('/team', teamMemberRoutes)
router.use('/uploads', uploadRoutes)
router.use('/doc-videos', docRoutes.videos)
router.use('/doc-photos', docRoutes.photos)
router.use('/donor-info', donorInfoRoutes)
router.use('/home', homePageRoutes)
router.use('/about', aboutPageRoutes)
router.use('/contact', contactPageRoutes)
router.use('/contact-messages', contactMessageRoutes)
router.use('/text-elements', textElementRoutes)
router.use('/menus', menuRoutes)

module.exports = router
