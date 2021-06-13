const { Router } = require('express');
const { Request } = require('../models/request')
const requestRouter = Router();

requestRouter.get('/requests', (req, res) => {
    Request.find()
        .populate('user_id', "_id user_name email phone city_name city_code country company")
        .then(request => res.json(request))
        .catch(err => res.json(err))
})

requestRouter.get('/requests/:id', (req, res) => {
    const {id} = req.params
    Request.find({_id : id})
        .populate('user_id', "_id user_name email phone city_name city_code country company")
        .then(request => res.json(request))
        .catch(err => res.json(err))
})

requestRouter.delete('/requests/:id', (req, res) => {
    const {id} = req.params
    Request.findOneAndDelete({_id: id})
        .then(() => res.json('Request has been deleted'))
        .catch(err => res.json(err))
})
module.exports = requestRouter;