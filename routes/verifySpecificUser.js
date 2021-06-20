const jwt = require('jsonwebtoken')

const verifySpecificUser = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    /* const token = req.header('auth-token') */
    if (!token) return res.status(401).send('Access denied because of missing token')
    const decToken = jwt.decode(token)
    const user = req.params.user_id
    if (user !== decToken.id && decToken.role !== "admin") return res.status(400).send('Access denied')
    try {
        const verified = jwt.verify(token, process.env.SECRET)
        req.user = verified
        next()
    }
    catch (err) {
        res.status(403).send('Token invalid')
    }
}

module.exports = verifySpecificUser