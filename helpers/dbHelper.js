/**
 * Created by liljay on 2016/9/4.
 */
let config = require('../config')
let common = require( './common')
let _ = require('lodash')
const validateError = (err) => {
    let status, res =  null, error = {}, message
    if (err.name === 'ValidationError') {
        _.forEach(err.errors, (e) => {
            error[e.path] = e.message
        })
        status = config.RESPONSE_CODE.DB_VALIDATE_FAIL
        message = config.ERROR_MESSAGE.VALIDATE_ERROR_MESSAGE
    } else {
        status = err.errorCode || config.RESPONSE_CODE.DEFAULT_ERROR
        error = err
        message = error.message
    }
    return common.setResult({status, res, error, message})
}
module.exports = {
    validateError
}