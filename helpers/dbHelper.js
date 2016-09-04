/**
 * Created by liljay on 2016/9/4.
 */
let config = require('../config')
let _ = require('lodash')
function validateError (err) {
    if (err.name === 'ValidationError') {
        let error = {}
        _.forEach(err.errors, (e) => {
            error[e.path] = e.message
        })
        return {
            status: config.ERROR_CODE.DB_VALIDATE_FAIL,
            res: null,
            error,
            message: config.ERROR_MESSAGE.VALIDATE_ERROR_MESSAGE
        }
    } else {
        return err
    }
}
module.exports = {
    validateError
}