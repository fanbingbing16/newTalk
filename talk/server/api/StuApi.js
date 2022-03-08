const models = require('../db')
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const $sql = require('../sqlMap')
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
// 接口：增加信息
router.post('/addStu', (req, res) => {
  const sql = $sql.Stu.add
  const params = req.body
  console.log('添加', params)
  conn.query(sql, [params.userId, params.userName, params.password, params.text], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 接口：查询全部
router.get('/showStu', (req, res) => {
  const sql = $sql.Stu.show
  const params = req.body
  console.log(params)
  conn.query(sql, [params.userId, params.userName, params.password, params.text], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 接口：删除信息
router.post('/delStu', (req, res) => {
  const sql = $sql.Stu.del
  const params = req.body
  console.log('删除', params)
  conn.query(sql, [params.userId], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 接口：修改密码
router.post('/updateStu', (req, res) => {
  const sql = $sql.Stu.updatePassword
  const params = req.body
  console.log('修改', params)
  conn.query(sql, [ params.password,params.userId], function (err, result) {
    if (err) {
      console.log(err,'editErr')
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})
// 接口：查询医生信息,分页查询
router.post('/showDoctor', (req, res) => {
  const sql = $sql.Stu.showDoctor
  const params = req.body
  console.log('查询医生',params)
  conn.query(sql, [params.m,params.n], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})
// 接口：查询医生全部信息
router.get('/showAllDoctor', (req, res) => {
  const sql = $sql.Stu.showAllDoctor
  const params = req.body
  console.log('查询医生',params)
  conn.query(sql, [], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})
module.exports = router