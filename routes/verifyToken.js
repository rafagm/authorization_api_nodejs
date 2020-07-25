const jwt = require('jsonwebtoken');

function authentication(req, res, next) {
    const token = req.header('Auth-Token');
    
    if (!token) return res.status(401).send("Access Denied");

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        
        next();
    } catch (error) {
        return res.status(400).send('Unauthenticated');
    }
}

module.exports = authentication;