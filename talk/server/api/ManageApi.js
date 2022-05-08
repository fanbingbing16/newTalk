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
      code: '1', msg: res.msg
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
// addScheduling
//接口，增加医生排班信息
router.post('/addScheduling', (req, res) => {
  const sql = $sql.manage.addScheduling
  const params = req.body
  console.log('增加医生排班信息', params)
  conn.query(`select * from scheduling where doctorId=?`, [params.doctorId], function (err1, result1) {
    if (err1) {
      console.log(err1)
    }
    if (result1) {
      let a = JSON.parse(JSON.stringify(result1))
      // 3600000*2
      let boo = true
      a.some(item => {
        let date1 = new Date(params.date)
        let date2 = new Date(item.date)
        console.log(date1, date2, date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate(), date1.getHours() >= 4 && date2.getHours() >= 4 && date1.getHours() <= 12 && date2.getHours() <= 12, date1.getHours() > 12 && date2.getHours() > 12)
        if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) {
          if (date1.getHours() >= 4 && date2.getHours() >= 4 && date1.getHours() <= 12 && date2.getHours() <= 12) {
            boo = false
            return true
          } else if (date1.getHours() > 12 && date2.getHours() > 12) {
            boo = false
            return true
          }
        }
      })
      if (boo) {
        let id = createId()
        conn.query(sql, [params.date, params.name, id, params.doctorId, params.part, params.signalSource], function (err, result) {
          if (err) {
            console.log(err)
          }
          if (result) {
            console.log(result, '增加排班信息')
            jsonWrite(res, result)
          }  // 
        })
      } else {
        res.msg = '该时间段已经有排班了！'
        jsonWrite(res)
      }

    }
  })
})

// searchOrder
//接口，查询所有的预约记录
router.get('/searchOrder', (req, res) => {
  const sql = $sql.manage.searchOrder
  const params = req.body
  console.log('查询所有的预约记录', params)
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

// editScheduling
//接口，修改排班信息
router.post('/editScheduling', (req, res) => {
  const sql = $sql.manage.editScheduling
  const params = req.body
  console.log('修改排班信息', params)
  conn.query(`select * from scheduling where doctorId=?`, [params.doctorId], function (err1, result1) {
    if (err1) {
      console.log(err1)
    }
    if (result1) {
      let a = JSON.parse(JSON.stringify(result1))
      let boo = true
      a.some(item => {
        let date1 = new Date(params.date)
        let date2 = new Date(item.date)
        console.log(date1, date2, date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate(), date1.getHours() >= 4 && date2.getHours() >= 4 && date1.getHours() <= 12 && date2.getHours() <= 12, date1.getHours() > 12 && date2.getHours() > 12)
        if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) {
          if (date1.getHours() >= 4 && date2.getHours() >= 4 && date1.getHours() <= 12 && date2.getHours() <= 12) {
            boo = false
            return true
          } else if (date1.getHours() > 12 && date2.getHours() > 12) {
            boo = false
            return true
          }
        }
      })
      if (boo) {
        conn.query(sql, [params.date, params.signalSource, params.id], function (err, result) {
          if (err) {
            console.log(err)
          }
          if (result) {
            console.log(result)
            jsonWrite(res, result)
          }  // 
        })
      } else {
        res.msg = '该时间段已经有排班了！'
        jsonWrite(res)
      }
    }
  })
})

//接口，删除排班信息
router.post('/deleteScheduling', (req, res) => {
  const sql = $sql.manage.deleteScheduling
  const params = req.body
  console.log('删除排班信息', params)
  conn.query(sql, [params.id], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      console.log(result)
      jsonWrite(res, result)
    }  // 
  })
})

// 接口：根据id查询医生,查找的是两个表的，还有排班表
router.post('/associationQuery', (req, res) => {
  const sql = $sql.manage.associationQuery
  const params = req.body
  console.log('查询医生 id 包括排班表', params)
  if (!params.id) {
    throw new Error('id必须传')
  }
  conn.query(sql, [params.id], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})

// searchDoctorDoctorUser
//接口，查询全部医生
router.get('/searchDoctorDoctorUser', (req, res) => {
  const sql = $sql.manage.searchDoctorDoctorUser
  const params = req.body
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

// editDoctor
// 接口：修改医生信息
router.post('/editDoctor', (req, res) => {
  const sql = $sql.manage.editDoctor
  const params = req.body
  console.log('修改医生信息', params)
  if (!params.id) {
    throw new Error('id必须传')
  }
  conn.query(sql, [params.email, params.phone, params.part, params.title, params.sex, params.image, params.detail, params.id], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})

// deleteDoctor
// 接口：删除医生
router.post('/deleteDoctor', (req, res) => {
  const sql = $sql.manage.deleteDoctor
  const sql2 = $sql.manage.deleteDoctorUser

  const params = req.body
  console.log('删除医生信息', params)
  if (!params.id) {
    throw new Error('id必须传')
  }
  conn.query(sql, [params.id], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      conn.query(sql2, [params.id], function (err, result) {
        if (err) {
          throw new Error(err)
        }
        if (result) {
          jsonWrite(res, result)
        }
      })
    }  // 
  })
})

module.exports = router