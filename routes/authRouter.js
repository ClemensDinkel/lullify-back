const { Router } = require('express');
const { User } = require('../models/user')
const { Request } = require('../models/request')
const authRouter = Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

authRouter.post('/register', async (req, res) => {
    if(!req.body.password) return res.send('No password provided')

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const {first_name, last_name, user_name, email, phone, city_code, city_name, country, company} = req.body //contentcreator
    const user = new User({
        first_name: first_name,
        last_name: last_name,
        user_name: user_name,
        email: email,
        password: hashPassword,
        phone: phone,
        city_code: city_code,
        city_name: city_name,
        country: country,
        company: company
    })
    
    // if (req.body.contentcreator) Request.create(req.body.)
    user.save()
    .then(user=> res.json({user}))
    .catch(err => res.json(err))

    /* User.create(user)
    .then(user=> res.json({user}))
    .catch(err => res.json(err)) */
    
})



module.exports = authRouter