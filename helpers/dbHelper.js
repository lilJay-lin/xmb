/**
 * Created by linxiaojie on 2016/9/2.
 */
let _ = require('lodash')
function validateMethod (schema) {
    return (path, cb, errorMsg) => {
        schema.path(path).validate(cb, errorMsg)
    }
}

function required (path) {
    return (value) => {
        return !_.isEmpty(value)
    }
}

function customizeError () {
    let msg = {};
    msg.general = {};
    msg.general.default = "Validator failed for path `{PATH}` with value `{VALUE}`";
    msg.general.required = "Path `{PATH}` is required.";
    msg.Number = {};
    msg.Number.min = "Path `{PATH}` ({VALUE}) is less than minimum allowed value ({MIN}).";
    msg.Number.max = "Path `{PATH}` ({VALUE}) is more than maximum allowed value ({MAX}).";
    msg.String = {};
    msg.String.enum = "`{VALUE}` is not a valid enum value for path `{PATH}`.";
    msg.String.match = "Path `{PATH}` is invalid ({VALUE}).";
    return msg
}


module.exports = {
    validateMethod,
    customizeError
}