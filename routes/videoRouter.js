const { Router } = require('express');
const { Video } = require('../models/video')
const videoRouter = Router();

videoRouter.get('/videos', (req, res) => {
    Video.find()
        .populate('uploader', "_id user_name")
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

videoRouter.get('/videos/byUploader/:uploader', (req, res) => {
    const { uploader } = req.params
    Video.find({ uploader: uploader })
        .populate('uploader', "_id user_name")
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

videoRouter.get('/videos/:id', (req, res) => {
    const { id } = req.params
    Video.find({ _id: id })
        .populate('uploader', "_id user_name")
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

videoRouter.post('/videos', (req, res) => {
    Video.create(req.body)
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

videoRouter.put('/videos/:id', (req, res) => {
    const { id } = req.params
    Video.findOneAndUpdate({ _id: id }, req.body)
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

videoRouter.delete('/videos/:id', (req, res) => {
    const { id } = req.params
    Video.deleteOne({ _id: id })
        .then(() => res.json('Video has been deleted successfully'))
        .catch(err => res.json(err))
})

module.exports = videoRouter;