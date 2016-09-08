/**
 * Created by linxiaojie on 2016/8/24.
 */
let express = require('express')
let config = require('../config')
let dbHelper = require( '../helpers/dbHelper')
let PermissionModel= require('../models/permission')
let common = require( '../helpers/common')
let Router = express.Router()
let _ = require('lodash')

/*
 * 新增权限
 * */
Router.post('/', (req, res) => {
    let {permission = {}} = req.body
    let permissions = permission.permissions || []
    PermissionModel.create(permission, (err, permission) => {
        if (err) {
            return res.json(dbHelper.validateError(err))
        }
        res.json(common.getResponse({okMsg: '权限新增成功', res: {permission}}))
    })
})

/*
 * 批量更新权限
 * */
Router.put('/batch', (req, res) => {
    let {permission = {}, ids} = req.body
    ids = ids && _.isArray(ids) ? ids : [ids]
    delete permission._id
    PermissionModel.update({_id: {$in: ids}}, {$set: permission}, { multi: true }, (err, result = {ok: 0}) => {
        res.json(common.getResponse({err, okMsg: '权限批量修改成功', errMsg: '权限批量修改失败', res: {count: result.ok}}))
    })
})

/*
 * 更新权限
 * */
Router.put('/:id', (req, res) => {
    let {permission = {}} = req.body
    let _id = req.params.id
    delete permission._id
    PermissionModel.findByIdAndUpdate(_id, {$set: permission}, (err, result = {ok: 0}) => {
        res.json(common.getResponse({err, okMsg: '权限修改成功', errMsg: '权限修改失败', res: {count: result.ok}}))
    })
})

/*
 * 搜索全部权限
 * */
Router.get('/', (req, res) => {
    let name = req.query.name
    let query = {status: true}
    !_.isEmpty(name) && (query.name = {$regex: name})
    PermissionModel.find(query, (err, permissions) => {
        res.json(common.getResponse({err, okMsg: '权限搜索成功', errMsg: '权限搜索失败', res: {data: permissions}}))
    })
})

/*
 * 获取指定权限详情
 * */
Router.get('/:id', (req, res) => {
    let id = req.params.id
    PermissionModel.findOne({_id: id}).exec((err, permission) => {
        res.json(common.getResponse({err, okMsg: '获取权限详情成功', errMsg: '获取权限详情失败', res: {data: permission}}))
    })
})

/*
 * 根据ids删除权限
 * */
Router.delete('/:ids', (req, res) => {
    let ids = (req.params.ids || '').split(',')
    PermissionModel.update({_id: {$in: ids}}, {$set: {status: false}}, { multi: true }, (err, result = {ok: 0}) => {
        res.json(common.getResponse({err, okMsg: '权限修改成功', errMsg: '权限修改失败', res: {count: result.ok}}))
    })
})

module.exports = Router