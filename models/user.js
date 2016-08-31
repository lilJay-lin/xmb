/**
 * Created by linxiaojie on 2016/8/31.
 */
let mongoose = require('mongoose')
let Schema = mongoose.Schema
let bcrypt = require('bcryptjs')
let config = require('../config')

/*文档定义*/
let UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})


let User = mongoose.model('User', UserSchema)

/*
* 保存之前做密码hash加盐
* */
UserSchema.pre('save', function (next) {
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

module.exports = User