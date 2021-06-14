const jwt = require('jsonwebtoken')

const verifySpecificUser = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) return res.status(400).send('Access denied')
    const decToken = jwt.decode(token)
    const user = req.params.user_id
    console.log(user)
    if (user !== decToken.id && decToken.role !== "admin") return res.status(400).send('Access denied')
    try {
        const verified = jwt.verify(token, process.env.SECRET)
        req.user = verified
        next()
    }
    catch (err) {
        res.send('error')
    }
}

module.exports = verifySpecificUser