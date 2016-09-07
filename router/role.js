/**
 * Created by linxiaojie on 2016/8/24.
 */
let express = require('express')
let config = require('../config')
let dbHelper = require( '../helpers/dbHelper')
let RoleModel= require('../models/role')
let common = require( '../helpers/common')
let Router = express.Router()

/*
 * 新增角色
 * */
Router.post('/', (req, res) => {
    let {role} = req.body
    let roleEntity = new RoleModel(role)
    roleEntity.save((err, role) => {
        if (err) {
            return res.json(dbHelper.validateError(err))
        }
        res.json(common.getResponse({okMsg: '角色新增成功', res: role}))
    })
})

/*
 * 更新角色
 * */
Router.put('/', (req, res) => {
    let {role} = req.body
    let _id = role._id
    delete role._id
    RoleModel.findByIdAndUpdate(_id, {$set: role}, (err, role) => {
        res.json(common.setResult({err, okMsg: '角色修改成功', errMsg: '角色修改失败', res: role._id}))
    })
})

Router.get('/', (req, res) => {
    RoleModel.find((err, roles) => {
        if (err) {
            return res.end(err)
        }
        res.json(roles)
    })
})

Router.delete('/:ids', (req, res) => {
    RoleModel.find((err, roles) => {
        if (err) {
            return res.end(err)
        }
        res.json(roles)
    })
})

module.exports = Router