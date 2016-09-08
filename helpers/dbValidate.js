/**
 * Created by linxiaojie on 2016/9/2.
 */
let _ = require('lodash')

module.exports = {
    _validateMethod (schema) {
        return (paramObj) => {
            let {path, cb, message} = paramObj
            schema.path(path).validate(cb(paramObj), message)
        }
    },
    setValidateStrange (schema, cfg) {
        let me = this
        let exec = me._validateMethod(schema)
        let requiredProps = []
        _.forEach(cfg, (validator, key) => {
            let validators = _.isArray(validator) ? validator : [validator]
            _.forEach(validators, (param) => {
                let {method} = param
                delete param.method
                param.path = key
                param.cb = param.cb || me[method]
                if (!_.isFunction(param.cb)) {
                    throw new Error('校验方法不存在:' + method)
                }
                if (method === 'required') {
                    requiredProps.push(key)
                }
                exec(param)
            })
        })
        me.preValidate(schema, requiredProps)
    },
    /*
    * path阶段校验，不会校验保存对象中不存在的属性,增加pre('save')做校验
    * */
    preValidate (schema, props) {
        schema.pre('validate', function (next) {
            let entity = this
            _.forEach(props, (prop) => {
                if (entity[prop] === undefined) {
                    entity[prop] = null
                }
            })
            next()
        })
    },
    /*
     * 不为空
     * */
    required () {
        return (value) => {
            return !_.isEmpty(value)
        }
    },
    /*
     * 值唯一
     * */
    unique ({path, model}) {
        return (value, done) => {
            model.findOne({[path]: value}, (err, doc) => {
                if (err) {
                    throw err
                }
                return done(doc ? false : true)
            })
        }
    },
    /*
     * 长度校验
     * 默认值0，表示不需校验
     * */
    checkLen ({min = 0, max = 0}) {
        return (value) => {
            let len = _.isEmpty(value) ? 0 : _.isNumber(value) || _.isString(value) ? ('' + value).length : _.isArray(value) ? value.length : 0
            let gtMin = min <= len
            let ltMax = len <= max
            return min === 0 ? (max === 0 ? true : ltMax) : (max === 0 ? gtMin : gtMin && ltMax)
        }
    },
    /*
     * 正则表达式校验
     * */
    match ({regex}) {
        return (value, done) => {
            return done(regex.test(value))
        }
    }
}