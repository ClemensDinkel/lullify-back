const { Router } = require('express');
const { Video } = require('../models/video')
const videoRouter = Router();

videoRouter.get('/videos', (req, res) => {
    Video.find().populate('uploader')
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

videoRouter.get('/videos/byUploader/:uploader', (req, res) => {
    const {uploader} = req.params
    Video.find({uploader : uploader})
    .then(video => res.json(video))
    .catch(err => res.json(err))
})

videoRouter.get('/videos/:id', (req, res) => {
    const {id} = req.params
    Video.find({_id : id})
    .then(video => res.json(video))
    .catch(err => res.json(err))
})

videoRouter.post('/videos', (req, res) => {
    Video.create(req.body)
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

module.exports = videoRouter;