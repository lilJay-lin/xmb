/**
 * Created by linxiaojie on 2016/8/24.
 */
let express = require('express')
let jwt = require('jsonwebtoken')
let Router = express.Router()
let config = require('../config')
let User = require('../models/user')

Router.post('/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    User.findOne({username}, (err, user) => {
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


Router.post('/', (req, res) => {
    let {username, password} = req.body
    let user = new User({username, password})
    user.save((err, user) => {
        console.log(err)
        if (err) {
            return res.end('保存失败')
        }
        res.json({message: 'user created', user: user})
    })
})

Router.get('/', (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.end(err)
        }
        res.json(users)
    })
})

module.exports = Router