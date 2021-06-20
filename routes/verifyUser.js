const jwt = require('jsonwebtoken')

const verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    /*const token = req.header('auth-token')*/    if (!token) return res.status(401).send('Access denied')
    try {
        const verified = jwt.verify(token, process.env.SECRET)
        req.user = verified
        next()
    }
    catch (err) {
        res.sendStatus(403).send('Token no longer valid')
    }
}

module.exports = verifyUser