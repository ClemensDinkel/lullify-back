const { Router } = require('express');
const { User } = require('../models/user')
const { Playlist } = require('../models/playlist')
const { Video } = require('../models/video')
const verifyAdmin = require('./verifyAdmin')
const verifySpecificUser = require('./verifySpecificUser')
const verifyCC = require('./verifyCC')
const userRouter = Router();
const bcrypt = require('bcryptjs')
/* const cors = require('cors')
userRouter.use(cors()) */

userRouter.get('/users', verifyAdmin, (req, res) => {
    User.find()
        .populate('favorites', 'artist title video_url')
        .populate({
            path: 'playlists',
            populate: { path: 'video_list', select: 'artist title video_url' }
        })
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

userRouter.get('/users/:user_id', verifySpecificUser, (req, res) => {
    const { user_id } = req.params
    User.find({ _id: user_id })
        .populate('favorites', 'artist title video_url')
        .populate({
            path: 'playlists',
            populate: { path: 'video_list', select: 'artist title video_url' }
        })
        .then(user => res.json(user))
        .catch(() => res.json('User does not exist'))
})

userRouter.get('/users/:user_id/playlists', verifySpecificUser, (req, res) => {
    const { user_id } = req.params
    Playlist.find({ user_id: user_id })
        .populate('video_list', 'artist title video_url')
        .populate('user_id', 'user_name')
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
})

userRouter.get('/users/:user_id/videos', verifySpecificUser, (req, res) => {
    const { user_id } = req.params
    Video.find({ uploader_id: user_id })
        .populate('uploader_id', "_id user_name")
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

// const comparePassword = await bcrypt.compare(req.body.password, user.password)
//if (!comparePassword) return res.status(400).send('Wrong password')


userRouter.put('/users/:user_id', verifySpecificUser, async (req, res) => {
    const { user_id } = req.params
    let dbpw = ""
    await User.findOne({ _id: user_id }).exec().then(res => {
        console.log(res.password)
        dbpw = res.password
    })
    const comparePassword = await bcrypt.compare(req.body.currentPassword, dbpw)
    if (!comparePassword) return res.status(400).send('Wrong password')
    let user = req.body
    if (req.body.password !== "") {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(user.password, salt)
        user.password = hashPassword
    }
    else user.password = dbpw
    // maybe there is a better way without making a second call
    User.findOneAndUpdate({ _id: user_id }, user)
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

userRouter.put('/users/:user_id/promote', verifyAdmin, (req, res) => {
    const { user_id } = req.params
    User.findOneAndUpdate(({ _id: user_id, role: "user" }), { role: "content_creator" })
        .then((user) => res.json(user === null ? "User can't be promoted" : 'User has been promoted to content_creator'))
        .catch(err => res.json(err))
})

userRouter.put('/users/:user_id/makeAdmin', verifyAdmin, (req, res) => {
    const { user_id } = req.params
    User.findOneAndUpdate(({ _id: user_id}), { role: "admin" })
        .then((user) => res.json(user === null ? "User can't be promoted" : 'User has been promoted to admin'))
        .catch(err => res.json(err))
})

userRouter.put('/users/:user_id/demote', verifyAdmin, (req, res) => {
    const { user_id } = req.params
    User.findOneAndUpdate(({ _id: user_id, role: "content_creator" }), { role: "user" })
        .then((user) => res.json(user === null ? "User can't be demoted" : 'Content_creator has been demoted to user'))
        .catch(err => res.json(err))
})

userRouter.get('/users/:user_id/playlists/:playlist_id', verifySpecificUser, (req, res) => {
    const { playlist_id } = req.params
    Playlist.findOne({ _id: playlist_id }, req.body)
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
})

userRouter.put('/users/:user_id/playlists/:playlist_id', verifySpecificUser, (req, res) => {
    const { playlist_id } = req.params
    Playlist.findOneAndUpdate({ _id: playlist_id }, req.body)
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
})

userRouter.delete('/users/:user_id', verifySpecificUser, (req, res) => {
    const { user_id } = req.params
    User.deleteOne({ _id: user_id })
        .then(() => res.json('User has been deleted successfully'))
        .catch(err => res.json(err))
})

userRouter.delete('/users/:user_id/playlists/:playlist_id', verifySpecificUser, (req, res) => {
    const { playlist_id } = req.params
    Playlist.findOneAndDelete({ _id: playlist_id })
        .then(res.json('Playlist has been deleted successfully'))
        .catch(err => res.json(err))
})

userRouter.put('/users/:user_id/videos/:video_id', verifyCC, verifySpecificUser, (req, res) => {
    const { video_id } = req.params
    Video.findOneAndUpdate({ _id: video_id }, req.body)
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

userRouter.delete('/users/:user_id/videos/:video_id', verifyCC, verifySpecificUser, (req, res) => {
    const { video_id } = req.params
    Video.deleteOne({ _id: video_id })
        .then(() => res.json('Video has been deleted successfully'))
        .catch(err => res.json(err))
})

module.exports = userRouter;