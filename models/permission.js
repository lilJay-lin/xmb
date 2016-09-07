/**
 * Created by linxiaojie on 2016/8/31.
 */
let mongoose = require('mongoose')
let Schema = mongoose.Schema
let dbValidate = require('../helpers/dbValidate')
let PermissionSchema = new Schema({
    name: String,
    description: String,
    status: {type: Boolean, default: true}
})
let PermissionModel = mongoose.model('Permission', PermissionSchema)

dbValidate.setValidateStrange(PermissionSchema, {
    name: [
        {
            method: 'required',
            message: '权限名称不能为空'
        },
        {
            method: 'checkLen',
            min: 2,
            max: 10,
            message: '权限名称长度2到10位'
        }
    ]
})

module.exports = PermissionModel
