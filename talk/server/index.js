
const StuApi = require('./api/StuApi')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
//采用设置所有均可访问的方法解决跨域问题
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200); //让options尝试请求快速结束
    else
        next();
})
app.use(bodyParser.json()) // 以json格式返回出去
app.use(bodyParser.urlencoded({ extended: false }))
// 后端api路由

app.use('/api/Stu', StuApi)
// 监听端口
app.listen(3000)
console.log('success listen at port:3000......')


var chatList = [];//记录聊天记录
var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({ port: 8188 }); //8181 与前端相对应
const mysql = require('mysql')
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "111",
    database: "hospital",
    timezone: "08:00"
})//连接数据库
connection.connect()
connection.query('select talkDoctor.*,doctor.* from talkDoctor,doctor where talkDoctor.doctorId = doctor.id', [], function (err, result) {
    if (err) {
        console.log(err, 'err')
    }
    if (result) {
        let a = JSON.parse(JSON.stringify(result))
        chatList = a
        console.log(a, 'a')
    }
})
//调用 broadcast 广播，实现数据互通和实时更新
wss.broadcast = function (msg) {
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};
wss.on('connection', function (ws) {
    wss.broadcast(JSON.stringify({ funName: 'userCount', chat: chatList })); //建立连接成功广播一次当前在线人数
    console.log('Connected clients:',);
    //接收前端发送过来的数据
    ws.on('message', function (e) {
        var resData = JSON.parse(e)
        console.log('接收到来自' + resData.talkFrom + '的消息：' + resData.text, resData)
        chatList.push({ talkTo: resData.talkTo, talkFrom: resData.talkFrom, userId: resData.userId, userName: resData.userName, doctorId: resData.doctorId, doctorName: resData.doctorName, text: resData.text, image: resData.image, isDoctor: resData.isDoctor, time: resData.time, endTime: resData.endTime });//每次发送信息，都会把信息存起来，然后通过广播传递出去，这样此每次进来的用户就能看到之前的数据
        //利用随机数和时间戳生成随机数
        function createId() {
            let word = 'abcdefghijklmnopqrstuvwxyz'
            let s = []
            let getId = ''
            for (let i = 0; i < 5; i++) {
                s[i] = word[Math.floor(Math.random() * 25)]
                if ((Math.random() * 5) > 1) {
                    getId += word[Math.floor(Math.random() * 25)]
                }
            }
            getId += Math.random().toString().substr(3, 3) + s.join('') + new Date().getTime()
            return getId
        }
        let id = createId()
        console.log(id, 'id')
        wss.broadcast(JSON.stringify({ talkTo: resData.talkTo, talkFrom: resData.talkFrom, userId: resData.userId, userName: resData.userName, doctorId: resData.doctorId, doctorName: resData.doctorName, text: resData.text, image: resData.image, isDoctor: resData.isDoctor, time: resData.time, endTime: resData.endTime })); //每次发送都相当于广播一次消息
        const sql = 'insert into talkDoctor(doctorId,doctorName,userId,userName,time,id,text,endTime,talkTo,talkFrom) values (?,?,?,?,?,?,?,?,?,?)'
        console.log('添加', resData)
        connection.query(sql, [resData.doctorId, resData.doctorName, resData.userId, resData.userName, resData.time, id, resData.text, resData.endTime, resData.talkTo, resData.talkFrom], function (err, result) {
            if (err) {
                console.log(err)
            }
        })
    });
    ws.on('close', function (e) {
        wss.broadcast(JSON.stringify({ funName: 'userCount', users: '', chat: chatList }));//建立连接关闭广播一次当前在线人数
        console.log('Connected clients:', e);
        console.log('长连接已关闭')
    })
})
console.log('服务器创建成功')
// connection.end();