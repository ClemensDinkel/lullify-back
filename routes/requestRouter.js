const { Router } = require('express');
const { Request } = require('../models/request')
const requestRouter = Router();
const verifyAdmin = require('./verifyAdmin') 

requestRouter.get('/requests', verifyAdmin, (req, res) => {
    Request.find()
        .populate('user_id', "_id user_name email phone city_name city_code country company")
        .then(request => res.json(request))
        .catch(err => res.json(err))
})

requestRouter.get('/requests/:request_id', verifyAdmin, (req, res) => {
    const {request_id} = req.params
    Request.find({_id : request_id})
        .populate('user_id', "_id user_name email phone city_name city_code country company")
        .then(request => res.json(request))
        .catch(err => res.json(err))
})

requestRouter.delete('/requests/:request_id', verifyAdmin, (req, res) => {
    const {request_id} = req.params
    Request.findOneAndDelete({_id: request_id})
        .then(() => res.json('Request has been deleted'))
        .catch(err => res.json(err))
})
module.exports = requestRouter;