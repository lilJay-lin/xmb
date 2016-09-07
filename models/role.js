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

dbValidate.setValidateStrange(RoleSchema, {
    name: [
        {
            method: 'required',
            message: '角色名称不能为空',
            status: {
                type: Number,
                default: 1
            }
        },
        {
            method: 'checkLen',
            min: 2,
            max: 10,
            message: '角色名称长度2到10位'
        }
    ]
})

module.exports = RoleModel
