/**
 * Created by linxiaojie on 2016/8/24.
 */
var redisClient = require('../database/redis_database').redisClient;

var TOKEN_EXPIRATION = 1;
var TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;


function getToken (req) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token']
    return token;
}

exports.expireToken = function(req) {
    var token = getToken(req);

    if (token != null) {
        redisClient.set(token, { is_expired: true });
        redisClient.expire(token, TOKEN_EXPIRATION_SEC);
    }
};

exports.verifyToken = function (req, res, next) {
    var token = getToken(req);

    redisClient.get(token, function (err, reply) {
        if (err) {
            console.log(err);
            return res.send(500);
        }

        if (reply) {
            res.send(401);
        }
        else {
            next();
        }

    });
};