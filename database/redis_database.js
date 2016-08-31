/**
 * Created by linxiaojie on 2016/8/24.
 */
let redis = require('redis')
let redisClient = redis.createClient(6379)

redisClient.on('error', function (err) {
    console.log('Error ' + err);
});

redisClient.on('connect', function () {
    console.log('Redis is ready');
});

exports.redis = redis;
exports.redisClient = redisClient;