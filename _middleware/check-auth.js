const jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var authenticate = (req, res, next) => {
    try {
        const token = req.body.token;
        console.log('body is: ', req.query.token);
        const decoded = jwt.verify(req.query.token, secret);
        req.userData = decoded;
        // await console.log('DECODEDS is: ', jwt.verify(req.query.token, secret));
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Auth Failed'
        });
    }
}

module.exports = authenticate;