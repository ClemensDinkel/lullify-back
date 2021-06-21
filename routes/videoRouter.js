const { Router } = require('express');
const { Video } = require('../models/video')
const verifyCC = require("./verifyCC");
const verifySpecificUser = require('./verifySpecificUser');
const verifyUser = require('./verifyUser')
const videoRouter = Router();

videoRouter.get('/videos', (req, res) => {
    Video.find()
        .populate('uploader_id', "_id user_name")
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

videoRouter.get('/videos/byUploader/:user_id', verifyCC, verifySpecificUser, (req, res) => {
    const { user_id } = req.params
    Video.find({ uploader_id: user_id })
        .populate('uploader_id', "_id user_name")
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

videoRouter.get('/videos/:video_id', (req, res) => {
    const { video_id } = req.params
    Video.find({ _id: video_id })
        .populate('uploader_id', "_id user_name")
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

videoRouter.post('/videos', verifyCC, (req, res) => {
    Video.create(req.body)
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

videoRouter.put('/videos/:video_id/report', verifyUser, (req, res) => {
    const { video_id } = req.params
    const {user_id} = req.body
    Video.findOneAndUpdate({_id: video_id && !repotedBy.includes(user_id)}, {reports: reports+=1})
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

/* videoRouter.put('users/:user_id/videos/:video_id', verifyCC, (req, res) => {
    const { video_id } = req.params
    Video.findOneAndUpdate({ _id: video_id }, req.body)
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

videoRouter.delete('/videos/:video_id', verifyCC, (req, res) => {
    const { video_id } = req.params
    Video.deleteOne({ _id: video_id })
        .then(() => res.json('Video has been deleted successfully'))
        .catch(err => res.json(err))
}) */

module.exports = videoRouter;