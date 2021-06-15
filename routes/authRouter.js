const { Router } = require('express');
const { User } = require('../models/user')
const { Request } = require('../models/request')
const authRouter = Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//temporary workaround
let refreshTokens = []

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '20min' })
}
const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_SECRET)
}

authRouter.post('/refresh', (req, res) => {
    const refreshToken = req.header('refresh-token')
    if (refreshToken === null) return res.status(401).send("Access denied")
    if (!refreshTokens.includes(refreshToken)) return res.status(403).send("Token no longer valid")
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
        if(err) return res.status(403).send("Token no longer valid")
        console.log(user)
        const accessToken = generateAccessToken({
            id: user.id,
            user_name: user.user_name,
            role: user.role
        })
        res.json({accessToken: accessToken})
    })
})

authRouter.delete('/logout', (req, res) => {
    // temporary workaround
    const tokenToDelete = req.header('refresh-token')
    refreshTokens = refreshTokens.filter(token => token !== tokenToDelete)
    
    return res.status(204).send("Logout successful")
})

authRouter.post('/register', async (req, res) => {
    if (!req.body.password) return res.send('No password provided')
    const checkEmail = await User.findOne({ email: req.body.email })
    if (checkEmail) return res.status(400).send('Email already exist')

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const { first_name, last_name, user_name, email, phone, city_code, city_name, country, company, requested_to_be_cc } = req.body
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

    const request = new Request({
        user_id: user._id
    })

    console.log(user)
    console.log(request)
    console.log(requested_to_be_cc)

    user.save()
        .then(user => {
            console.log("user created")
            res.json(user)
        })
        .catch(err => res.json(err))

    if (requested_to_be_cc && request.user_id != null) {
        request.save()
            .then(request => {
                console.log("request created")
                res.json(request)
            })
            .catch(err => res.json(err))
    }
})

authRouter.post('/login', async (req, res) => {
    console.log("login")
    const user = await User.findOne({ email: req.body.email } /* || {user_name : req.body.user_login} */)
    if (!user) return res.status(400).send('User not found')

    const comparePassword = await bcrypt.compare(req.body.password, user.password)
    if (!comparePassword) return res.status(400).send('Wrong password')

    const userData = {
        id: user._id,
        user_name: user.user_name,
        role: user.role
    }
    const accessToken = generateAccessToken(userData)
    const refreshToken = generateRefreshToken(userData)
    /* res.header('auth-token', {accessToken: accessToken, refreshToken: refreshToken})
    res.send({accessToken: accessToken, refreshToken: refreshToken}) */
    res.header('auth-token', accessToken)
    res.json(accessToken)
    /* refreshTokens.push(refreshToken) */
})

module.exports = authRouter