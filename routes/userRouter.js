const { Router } = require('express');
const { User } = require('../models/user')
const userRouter = Router();

userRouter.get('/users', (req, res) => {
/*   const populateQuery = [
        {
        path:'favorites'
    },   {
        path:'playlists',
        select:'video_list'
    }
]  */

    User
        .find()
        .populate('favorites', 'artist title video_url')
        .populate({
            path: 'playlists',
            populate: { path: 'video_list', select: 'artist title video_url' }
        }).sort({ body: 1 })
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

/* User
        .find()
        .populate('favorites', 'artist title video_url')
        .populate('playlists', 'name') 
        .then(user => res.json(user))
        .catch(err => res.json(err))
}) */

userRouter.get('/users/:id', (req, res) => {
    const {id} = req.params
    User.find({_id: id})
        .then(user => res.json(user))
        .catch(() => res.json('User does not exist'))
})

userRouter.post('/users', (req, res) => {
    User.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

userRouter.put('/users/:id', (req, res) => {
    const {id} = req.params
    User.findOneAndUpdate({_id: id}, req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

userRouter.delete('/users/:id', (req, res) => {
    const {id} = req.params
    User.deleteOne({_id: id})
        .then(() => res.json('User has been deleted successfully'))
        .catch(err => res.json(err))
})

module.exports = userRouter;