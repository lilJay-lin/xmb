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
    let username = req.body.username
    let password = req.body.password
    UserModel.findOne({username}, (err, user) => {
        if (err) {
            res.end(err)
        }
        user.comparePassword(password, (isMatch) => {
            if (!isMatch) {
                console.log("Attempt failed to login with " + user.username);
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
    let {username, password} = req.body
    let user = new UserModel({username, password})
    user.save((err, user) => {
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
    let {username, password, _id} = req.body
    UserModel.findByIdAndUpdate(_id, {$set: {username, password}}, (err, user) => {
        res.json(common.setResult({err, okMsg: '用户修改成功', errMsg: '用户修改失败', res: user._id}))
    })
})

Router.get('/', (req, res) => {
    UserModel.find((err, users) => {
        if (err) {
            return res.end(err)
        }
        res.json(users)
    })
})

module.exports = Router