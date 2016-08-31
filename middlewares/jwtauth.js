/**
 * Created by linxiaojie on 2016/8/24.
 */
let config = require('../config')
let jwt = require('jsonwebtoken')
var UnauthorizedError = require('express-jwt/lib/errors/UnauthorizedError');
module.exports = (req, res, next) => {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token']
    if (token) {
        try {
            jwt.verify(token, config.SECRET_TOKEN, (err, decoded) => {
                if (err) {
                    return next(err)
                }
                req.user = decoded.user
                next()
            });
        } catch (e){
            return next(e)
        }
    } else {
        return next(new UnauthorizedError('credentials_required', { message: 'No authorization token was found' }));
    }
}