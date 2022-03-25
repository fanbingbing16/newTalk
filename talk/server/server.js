const getId = require('./createId')
var userNum = 0; //统计在线人数
var chatList = [];//记录聊天记录
let history = []//记录历史聊天记录
var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({ port: 8181 }); //8181 与前端相对应
const mysql = require('mysql')
let data = []
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "111",
    database: "mysql",
    timezone: "08:00"
})//连接数据库
connection.connect()
connection.query('select * from userTalk', [], function (err, result) {
    if (err) {
        console.log(err, 'err')
    }
    if (result) {
        let a = JSON.parse(JSON.stringify(result))
        let date = new Date().getDate()
        history = a
        // console.log(history, 'history', result);
        a.map(item => {
            //数据库返回的数据存储到chatList
            if (new Date(item.date).getDate() === date) {
                chatList.push({ userId: item.userId, content: item.talk, date: item.date })
            }
        })
    }
})
//调用 broadcast 广播，实现数据互通和实时更新
wss.broadcast = function (msg) {
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};
wss.on('connection', function (ws) {
    userNum++
    wss.broadcast(JSON.stringify({ funName: 'userCount', users: userNum, chat: chatList, history: history })); //建立连接成功广播一次当前在线人数
    console.log('Connected clients:', userNum);
    //接收前端发送过来的数据
    ws.on('message', function (e) {
        var resData = JSON.parse(e)
        console.log('接收到来自' + resData.userId + '的消息：' + resData.msg, resData)
        history.push({ userId: resData.userId, talk: resData.msg, date: resData.date, id: history.length })
        chatList.push({ userId: resData.userId, content: resData.msg, date: resData.date });//每次发送信息，都会把信息存起来，然后通过广播传递出去，这样此每次进来的用户就能看到之前的数据
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
        wss.broadcast(JSON.stringify({ userId: resData.userId, msg: resData.msg, date: resData.date, history: history })); //每次发送都相当于广播一次消息
        const sql = 'insert into userTalk(userId,id,talk,date) values (?,?,?,?)'
        console.log('添加', resData)
        connection.query(sql, [resData.userId, id, resData.msg, resData.date], function (err, result) {
            if (err) {
                console.log(err)
            }
        })
    });
    ws.on('close', function (e) {
        if (userNum > 0) {
            userNum--;//建立连接关闭在线人数 -1
        }
        wss.broadcast(JSON.stringify({ funName: 'userCount', users: userNum, chat: chatList }));//建立连接关闭广播一次当前在线人数
        console.log('Connected clients:', userNum);
        console.log('长连接已关闭')
    })
})
console.log('服务器创建成功')
// connection.end();