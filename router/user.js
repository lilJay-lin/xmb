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
let _ = require('lodash')

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
    let {user = {}} = req.body
    let users = user.users || []
    UserModel.create(user, (err, user) => {
        if (err) {
            return res.json(dbHelper.validateError(err))
        }
        res.json(common.getResponse({okMsg: '用户新增成功', res: {user}}))
    })
})

/*
 * 批量更新用户
 * */
Router.put('/batch', (req, res) => {
    let {user = {}, ids} = req.body
    ids = ids && _.isArray(ids) ? ids : [ids]
    delete user._id
    UserModel.update({_id: {$in: ids}}, {$set: user}, { multi: true }, (err, result = {ok: 0}) => {
        res.json(common.getResponse({err, okMsg: '用户批量修改成功', errMsg: '用户批量修改失败', res: {count: result.ok}}))
    })
})

/*
 * 更新用户
 * */
Router.put('/:id', (req, res) => {
    let {user = {}} = req.body
    let _id = req.params.id
    delete user._id
    UserModel.findByIdAndUpdate(_id, {$set: user}, (err, result = {ok: 0}) => {
        res.json(common.getResponse({err, okMsg: '用户修改成功', errMsg: '用户修改失败', res: {count: result.ok}}))
    })
})

/*
 * 搜索全部用户
 * */
Router.get('/', (req, res) => {
    let name = req.query.name
    let query = {status: true}
    !_.isEmpty(name) && (query.name = {$regex: name})
    UserModel.find(query, (err, users) => {
        res.json(common.getResponse({err, okMsg: '用户搜索成功', errMsg: '用户搜索失败', res: {data: users}}))
    })
})

/*
 * 获取指定用户详情
 * */
Router.get('/:id', (req, res) => {
    let id = req.params.id
    UserModel.findOne({_id: id}).populate('roles').exec((err, user) => {
        res.json(common.getResponse({err, okMsg: '获取用户详情成功', errMsg: '获取用户详情失败', res: {data: user}}))
    })
})

/*
 * 根据ids删除用户
 * */
Router.delete('/:ids', (req, res) => {
    let ids = (req.params.ids || '').split(',')
    UserModel.update({_id: {$in: ids}}, {$set: {status: false}}, { multi: true }, (err, result = {ok: 0}) => {
        res.json(common.getResponse({err, okMsg: '用户修改成功', errMsg: '用户修改失败', res: {count: result.ok}}))
    })
})

module.exports = Router

module.exports = Router