const { Router } = require('express');
const { Playlist } = require('../models/playlist')
const playlistRouter = Router();

 
playlistRouter.get('/playlists', (req, res) => {
    Playlist.find().populate('video_list', 'artist title video_url')
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
}) 

playlistRouter.post('/playlists', (req, res) => {
    Playlist.create(req.body)
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
})

playlistRouter.put('/playlists/:id', (req, res) => {
    const {id} = req.params
    Playlist.findOneAndUpdate({_id: id}, req.body)
        .then(playlist => res.json(playlist))
        .catch(err => res.json(err))
})

playlistRouter.delete('/playlists/:id', (req, res) => {
    const {id} = req.params
    Playlist.findOneAndDelete({_id: id})
        .then(res.json('Playlist has been deleted successfully'))
        .catch(err => res.json(err))
})

module.exports= playlistRouter;
