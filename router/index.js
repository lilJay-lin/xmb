/**
 * Created by linxiaojie on 2016/8/31.
 */
let express = require('express')
let Router = express.Router()

Router.use('/api/user', require('./user'))
Router.use('/api/role', require('./role'))
Router.use('/api/permission', require('./permission'))

module.exports = Router