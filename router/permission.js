/**
 * Created by liljay on 2016/9/7.
 */
let express = require('express')
let Router = express.Router()
let PermissionModel = require('../models/permission')
let dbHelper = require('../helpers/dbHelper')
let common = require('../helpers/common')
/*
* 查询所有权限
* */
Router.get('/', (req, res) => {
    PermissionModel.find((err, permissoins) => {
        res.json(common.setResult({err, okMsg: '权限搜索成功', errMsg: '权限搜索失败', res: {list: permissoins}}))

    })
})
/*
 * 新增权限
 * */
Router.post('/', (req, res) => {
    let permission = req.body.permission
    let permissionEntity = new PermissionModel(permission)
    permissionEntity.save((err, permission) => {
        if (err) {
            return res.json(dbHelper.validateError(err))
        }
        res.json(common.getResponse({okMsg: '权限新增成功', res: permission}))
    })
})

module.exports = Router