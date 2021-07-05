const { Router } = require('express');
const { Request } = require('../models/request')
const requestRouter = Router();
const verifyAdmin = require('./verifyAdmin') 

// get all requests
requestRouter.get('/requests', verifyAdmin, (req, res) => {
    Request.find()
        .lean()
        .populate('user_id', "_id user_name first_name last_name email phone street house_nr city_name city_code country company reg_date")
        .then(request => res.json(request))
        .catch(err => res.json(err))
})

// get a specific request
requestRouter.get('/requests/:request_id', verifyAdmin, (req, res) => {
    const {request_id} = req.params
    Request.find({_id : request_id})
        .lean()
        .populate('user_id', "_id user_name first_name last_name email phone street house_nr city_name city_code country company reg_date")
        .then(request => res.json(request))
        .catch(err => res.json(err))
})

// delete a specific request
requestRouter.delete('/requests/:request_id', verifyAdmin, (req, res) => {
    const {request_id} = req.params
    Request.findOneAndDelete({_id: request_id})
        .then(() => res.json('Request has been deleted'))  // return request_id for immediate frontend update?
        .catch(err => res.json(err))
})
module.exports = requestRouter;