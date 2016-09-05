/**
 * Created by linxiaojie on 2016/8/31.
 */
let mongoose = require('mongoose')
let Schema = mongoose.Schema
let bcrypt = require('bcryptjs')
let config = require('../config')
let dbValidate = require('../helpers/dbValidate')

/*
 *文档定义
 * match: [regex, msg]
 * enum: {values, message}
 * 实用类：trim,lowercase,uppercase
 * */
let UserSchema = new Schema({
    username: {type: String},
    password: {type: String}
})
let UserModel = mongoose.model('User', UserSchema)

/*
 * 数据校验
 * 1. 使用schema的默认校验，校验信息格式在dbHelper.customizeError中定义
 * */
let validateConfig = {
    password: [
        {
            method: 'required',
            message: '密码不能为空',
        },
        {
            method: 'checkLen',
            min: 8,
            max: 20,
            message: '密码长度8到20位'
        }
    ],
    username:[
        {
            method: 'required',
            message: '用户名不能为空',
        },
        {
            method: 'unique',
            message: '用户已经存在',
            model: UserModel
        }
    ],
}
dbValidate.setValidateStrange(UserSchema, validateConfig)

/*
 * 保存之前做密码hash加盐
 * */
UserSchema.pre('save', function (next, err) {
    let user = this
    if (!user.isModified('password')) {
        return next()
    }
    bcrypt.genSalt(config.SALT_FACTOR, (err, salt) => {
        if (err) {
            return next(err)
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            user.password = hash
            next()
        })
    })
})

/*
 * 密码匹配
 * */
UserSchema.methods.comparePassword = (password, cb) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err)
        }
        cb(isMatch)
    })
}

module.exports = UserModel