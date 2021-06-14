const { Router } = require('express');
const { Playlist } = require('../models/playlist')
const playlistRouter = Router();
const verifyAdmin = require('./verifyAdmin')
const verifyUser = require('./verifyUser')
const verifySpecificUser = require('./verifySpecificUser')

playlistRouter.get('/playlists', verifyAdmin, (req, res) => {
    Playlist.find()
        .populate('video_list', 'artist title video_url')
        .populate('user_id', 'user_name')
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
})

playlistRouter.post('/playlists', verifyUser, (req, res) => {
    Playlist.create(req.body)
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
})

// available to the user with the user_id
/* playlistRouter.get('/playlists/:user_id', (req, res) => {
    Playlist.find({user_id: req.params.user_id})
        .populate('video_list', 'artist title video_url')
        .populate('user_id', 'user_name')
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
}) */

/* playlistRouter.put('/playlists/:id', (req, res) => {
    const { id } = req.params
    Playlist.findOneAndUpdate({ _id: id }, req.body)
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
})

playlistRouter.delete('/playlists/:id', (req, res) => {
    const { id } = req.params
    Playlist.findOneAndDelete({ _id: id })
        .then(res.json('Playlist has been deleted successfully'))
        .catch(err => res.json(err))
}) */

module.exports = playlistRouter;
