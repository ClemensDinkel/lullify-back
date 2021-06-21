const jwt = require('jsonwebtoken')

const verifyCC = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    /*     const token = req.header('auth-token')*/    
    if (token === "null") return res.status(401).send('Access denied')
    const decToken = jwt.decode(token)
    //console.log("checking role...")
    if (decToken.role !== "admin" && decToken.role !== 'content_creator') return res.status(400).send('Access denied')
    try {
        const verified = jwt.verify(token, process.env.SECRET)
        req.user = verified
        next()
    }
    catch (err) {
        res.status(403).send('Token no longer valid')
    }
}

module.exports = verifyCC