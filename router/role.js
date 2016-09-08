/**
 * Created by linxiaojie on 2016/8/24.
 */
let express = require('express')
let config = require('../config')
let dbHelper = require( '../helpers/dbHelper')
let RoleModel= require('../models/role')
let common = require( '../helpers/common')
let Router = express.Router()
let _ = require('lodash')

/*
 * 新增角色
 * */
Router.post('/', (req, res) => {
    let {role = {}} = req.body
    let permissions = role.permissions || []
    RoleModel.create(role, (err, role) => {
        if (err) {
            return res.json(dbHelper.validateError(err))
        }
        res.json(common.getResponse({okMsg: '角色新增成功', res: {role}}))
    })
})

/*
 * 批量更新角色
 * */
Router.put('/batch', (req, res) => {
    let {role = {}, ids} = req.body
    ids = ids && _.isArray(ids) ? ids : [ids]
    delete role._id
    RoleModel.update({_id: {$in: ids}}, {$set: role}, { multi: true }, (err, result = {ok: 0}) => {
        res.json(common.getResponse({err, okMsg: '角色批量修改成功', errMsg: '角色批量修改失败', res: {count: result.ok}}))
    })
})

/*
 * 更新角色
 * */
Router.put('/:id', (req, res) => {
    let {role = {}} = req.body
    let _id = req.params.id
    delete role._id
    RoleModel.findByIdAndUpdate(_id, {$set: role}, (err, result = {ok: 0}) => {
        res.json(common.getResponse({err, okMsg: '角色修改成功', errMsg: '角色修改失败', res: {count: result.ok}}))
    })
})

/*
* 搜索全部角色
* */
Router.get('/', (req, res) => {
    let name = req.query.name
    let query = {status: true}
    !_.isEmpty(name) && (query.name = {$regex: name})
    RoleModel.find(query, (err, roles) => {
        res.json(common.getResponse({err, okMsg: '角色搜索成功', errMsg: '角色搜索失败', res: {data: roles}}))
    })
})

/*
 * 获取指定角色详情
 * */
Router.get('/:id', (req, res) => {
    let id = req.params.id
    RoleModel.findOne({_id: id}).populate('permissions').exec((err, role) => {
        res.json(common.getResponse({err, okMsg: '获取角色详情成功', errMsg: '获取角色详情失败', res: {data: role}}))
    })
})

/*
* 根据ids删除角色
* */
Router.delete('/:ids', (req, res) => {
    let ids = (req.params.ids || '').split(',')
    RoleModel.update({_id: {$in: ids}}, {$set: {status: false}}, { multi: true }, (err, result = {ok: 0}) => {
        res.json(common.getResponse({err, okMsg: '角色修改成功', errMsg: '角色修改失败', res: {count: result.ok}}))
    })
})

module.exports = Router