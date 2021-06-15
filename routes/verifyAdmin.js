const jwt = require('jsonwebtoken')

const verifyAdmin = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) return res.status(401).send('Access denied')
    const decToken = jwt.decode(token)
    //console.log("checking role...")
    console.log(decToken)
    if (decToken.role !== "admin") return res.status(400).send('Access denied')
    try {
        const verified = jwt.verify(token, process.env.SECRET)
        req.user = verified
        next()
    }
    catch (err) {
        res.status(403).send('Token no longer valid')
    }
}

module.exports = verifyAdmin