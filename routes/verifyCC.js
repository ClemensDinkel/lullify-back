const jwt = require('jsonwebtoken')

const verifyCC = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) return res.status(400).send('Access denied')
    const decToken = jwt.decode(token)
    //console.log("checking role...")
    if (decToken.role !== "admin" && decToken.role !== 'content_creator') return res.status(400).send('Access denied')
    try {
        const verified = jwt.verify(token, process.env.SECRET)
        req.user = verified
        next()
    }
    catch (err) {
        res.send('error')
    }
}

module.exports = verifyCC