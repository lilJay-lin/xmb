/**
 * Created by liljay on 2016/9/6.
 */
let mongoose = require('mongoose')
let Schema = mongoose.Schema
let dbValidate = require('../helpers/dbValidate')

let RoleSchema = new Schema({
    name: String,
    description: String,
    status: {type: Boolean, default: true},
    permissions: [{type: Schema.Types.ObjectId, ref: 'Permission'}]
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

let RoleModel = mongoose.model('Role', RoleSchema)

/*
* 表校验
* */
dbValidate.setValidateStrange(RoleSchema, {
    name: [
        {
            method: 'required',
            message: '角色名称不能为空'
        },
        {
            method: 'checkLen',
            min: 2,
            max: 10,
            message: '角色名称长度2到10位'
        }
    ]
})

/*
* 保存角色和关联的权限
* */
/*RoleSchema.pre('save', function (next) {
    let role = this
    let permissions = role.permissions || []
})*/

module.exports = RoleModel
