const { Router } = require('express')
const doc = require('../controllers/docController')
const requireAdmin = require('../middleware/requireAdmin')

const videos = Router()
videos.get('/', doc.listVideos) // publik
videos.post('/', requireAdmin, doc.createVideo)
videos.put('/:id', requireAdmin, doc.updateVideo)
videos.delete('/:id', requireAdmin, doc.removeVideo)

const photos = Router()
photos.get('/', doc.listPhotos) // publik
photos.post('/', requireAdmin, doc.createPhoto)
photos.put('/:id', requireAdmin, doc.updatePhoto)
photos.delete('/:id', requireAdmin, doc.removePhoto)

module.exports = { videos, photos }
