const { Router } = require('express');
const { User } = require('../models/user')
const userRouter = Router();

userRouter.get('/users', (req, res) => {
    User.find()
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

userRouter.get('/users/:id', (req, res) => {
    const {id} = req.params
    User.find({_id: id})
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

userRouter.post('/users', (req, res) => {
    User.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

module.exports = userRouter;