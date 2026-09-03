const SiteContent = require('../models/SiteContent')

async function check(_req, res) {
  try {
    await SiteContent.ping()
    res.json({ ok: true, db: 'up' })
  } catch (err) {
    res.status(503).json({ ok: false, db: 'down', error: err.message })
  }
}

module.exports = { check }
