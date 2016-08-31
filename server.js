/**
 * Created by linxiaojie on 2016/8/23.
 */
let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
let jwt = require('express-jwt')
let config = require('./config')
let http = require('http')

let db = mongoose.connection

//mongoose
mongoose.connect('mongodb://localhost/ruru')
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('mongodb is connected')
});

//port
let port = process.env.port || 8080

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/', require('./router'))

/*
* 404错误
* */
app.use((req, res) => {
    res.statusCode = 404
    res.json({success: -1, message: '请求路径不存在'});
})

let server = http.createServer(app)
server.listen(port)
server.on('listening', () => {
    console.log('server listening at port ', port)
})

/*
* 服务器错误
* */
server.on('error', (error) => {
    process.exit(1)
    console.log(error)
})

/*
* 未捕获异常处理，重启服务
* TODO: 开多进程domain-middleware
* */
process.on('uncaughtException', function (err) {
    console.log(err.stack)
    process.exit(1);
});

