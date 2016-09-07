/**
 * Created by linxiaojie on 2016/8/24.
 */
let express = require('express')
let jwt = require('jsonwebtoken')
let config = require('../config')
let dbHelper = require( '../helpers/dbHelper')
let UserModel= require('../models/user')
let common = require( '../helpers/common')
let Router = express.Router()

Router.post('/login', (req, res) => {
    let userName = req.body.userName
    let password = req.body.password
    UserModel.findOne({userName}, (err, user) => {
        if (err) {
            res.end(err)
        }
        user.comparePassword(password, (isMatch) => {
            if (!isMatch) {
                console.log("Attempt failed to login with " + user.userName);
                return res.send(401);
            }
            let token = jwt.sign({user: user}, config.SECRET_TOKEN, {expiresIn: 60 * 60});
            res.send({token})
        })
    })
})

Router.post('/logout', (req, res) => {
    if (req.user) {
        delete req.user
        res.send(200)
    } else {
        res.send(401)
    }
})


/*
* 新增用户
* */
Router.post('/', (req, res) => {
    let {user} = req.body
    let userEntity = new UserModel(user)
    userEntity.save((err, user) => {
        if (err) {
            return res.json(dbHelper.validateError(err))
        }
        res.json(common.getResponse({okMsg: '用户新增成功', res: user}))
    })
})

/*
* 更新用户
* */
Router.put('/', (req, res) => {
    let {user} = req.body
    let _id = user._id
    delete user._id
    UserModel.findByIdAndUpdate(_id, {$set: user}, (err, user) => {
        res.json(common.setResult({err, okMsg: '用户修改成功', errMsg: '用户修改失败', res: user._id}))
    })
})

Router.get('/', (req, res) => {
    UserModel.find((err, users) => {
        res.json(common.setResult({err, okMsg: '用户搜索成功', errMsg: '用户搜索失败', res: {list: users}}))
    })
})

module.exports = Router