const { Router } = require('express');
const { Playlist } = require('../models/playlist')
const playlistRouter = Router();

 
playlistRouter.get('/playlists', (req, res) => {
    Playlist.find().populate('video_list')
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
}) 

playlistRouter.post('/playlists', (req, res) => {
    Playlist.create(req.body)
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
})

module.exports= playlistRouter;