/**
 * Created by linxiaojie on 2016/8/31.
 */
let mongoose = require('mongoose')
let Schema = mongoose.Schema
let Permission = new Schema({
    name: {type: String, required: true, unique:true},
    description: String
})