const models = require('../db')
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const $sql = require('../sqlMap')
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
// 连接数据库
const conn = mysql.createConnection(models.mysql)
conn.connect()
const jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1', msg: '操作失败'
    })
  } else {
    res.json(
      ret
    )
  }
}
//接口，管理员登录
router.post('/login', (req, res) => {
  const sql = $sql.manage.searchLogin
  const params = req.body
  console.log('管理员登录', params)
  // totalPay = ?,wellPayment = ? where id = ?
  conn.query(sql, [params.name], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      console.log(result)
      jsonWrite(res, result)
    }  // 
  })
})
// searchPrescription
//接口，查询全部处方
router.get('/searchPrescription', (req, res) => {
  const sql = $sql.manage.searchPrescription
  const params = req.body
  // totalPay = ?,wellPayment = ? where id = ?
  conn.query(sql, [], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      console.log(result)
      jsonWrite(res, result)
    }  // 
  })
})
// showAllDoctor
//接口，查询全部医师以及排班信息
router.get('/showAllDoctor', (req, res) => {
  const sql = $sql.manage.showAllDoctor
  const params = req.body
  // totalPay = ?,wellPayment = ? where id = ?
  conn.query(sql, [], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      console.log(result)
      jsonWrite(res, result)
    }  // 
  })
})
module.exports = router