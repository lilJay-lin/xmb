/**
 * Created by linxiaojie on 2016/8/31.
 */
let express = require('express')
let Router = express.Router()

Router.use('/api/user', require('./user'))

module.exports = Router