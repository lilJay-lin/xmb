/**
 * Created by liljay on 2016/9/5.
 */

let config = require('../config')
module.exports =  {
    setResult ({status = 0, res = null, error = null, message = ""}) {
        return {status, res, error, message}
    },
    getResponse ({err, res, okMsg, errMsg}) {
        let status, message
        if (err) {
            message = errMsg
            status = err.errorCode || config.RESPONSE_CODE.DEFAULT_ERROR
        } else {
            message = okMsg
            status = config.RESPONSE_CODE.SUCCESS_CODE
        }
        return this.setResult({status, res, err, message})
    }
}