const jwt = require('jsonwebtoken');

jwt.verifyAsync = function(token, secretOrPublicKey) {
    return new Promise( (resolve, reject) => {
        jwt.verify(token, secretOrPublicKey, (err, decode) => {
            if (err) reject(err);
            resolve(decode);
        })
    });
}

const checkJWTAuth = async (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT' ){
            const decode = await jwt.verifyAsync(req.headers.authorization.split(' ')[1], 'wunderlistCloneSecret' )
            req.user = decode;
        }
        next()
    } catch (error) {
        req.user = null;
        next();
        console.log(error)
    }
}

module.exports = {
    checkJWTAuth
}