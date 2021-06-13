const { Router } = require('express');
const { User } = require('../models/user')
const { Playlist } = require('../models/playlist')
const { Video } = require('../models/video')
const verifyToken = require('./verifyToken')
const userRouter = Router();

userRouter.get('/users', verifyToken, (req, res) => {
    User.find()
        .populate('favorites', 'artist title video_url')
        .populate({
            path: 'playlists',
            populate: { path: 'video_list', select: 'artist title video_url' }
        })
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

userRouter.get('/users/:id', (req, res) => {
    const { id } = req.params
    User.find({ _id: id })
        .populate('favorites', 'artist title video_url')
        .populate({
            path: 'playlists',
            populate: { path: 'video_list', select: 'artist title video_url' }
        })
        .then(user => res.json(user))
        .catch(() => res.json('User does not exist'))
})

/* userRouter.post('/register', (req, res) => {
    User.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err))
}) ---now in authRouter ---*/

userRouter.get('/users/:id/playlists', (req, res) => {
    const { id } = req.params
    Playlist.find({ user_id: id })
        .populate('video_list', 'artist title video_url')
        .populate('user_id', 'user_name')
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
})

userRouter.get('/users/:id/videos', (req, res) => {
    const { id } = req.params
    Video.find({ uploader_id: id })
        .populate('uploader_id', "_id user_name")
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

userRouter.put('/users/:id', (req, res) => {
    const { id } = req.params
    User.findOneAndUpdate({ _id: id }, req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

userRouter.put('/users/:id/promote', (req, res) => {
    const { id } = req.params
    User.findOneAndUpdate(({ _id: id, role: "user"}), {role:"content_creator"})
        .then((user) => res.json(user === null ? "User can't be promoted" : 'User has been promoted to content_creator'))
        .catch(err => res.json(err))
})

userRouter.put('/users/:id/demote', (req, res) => {
    const { id } = req.params
    User.findOneAndUpdate(({ _id: id, role: "content_creator"}), {role: "user"})
    .then((user) => res.json(user === null ? "Content_creator can't be demoted" : 'Content_creator has been demoted to user'))
        .catch(err => res.json(err))
})

userRouter.delete('/users/:id', (req, res) => {
    const { id } = req.params
    User.deleteOne({ _id: id })
        .then(() => res.json('User has been deleted successfully'))
        .catch(err => res.json(err))
})

module.exports = userRouter;