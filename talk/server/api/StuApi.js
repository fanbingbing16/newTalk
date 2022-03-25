const getId = require('../createId')
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
// 接口：根据id查询
router.post('/showOfId', (req, res) => {
  const sql = $sql.Stu.showOfId
  const params = req.body
  console.log(params)
  conn.query(sql, [params.userId], function (err, result) {
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
  conn.query(sql, [params.password, params.userId], function (err, result) {
    if (err) {
      console.log(err, 'editErr')
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})
// 接口：将身份认证的信息写入库中
router.post('/addAuthentication', (req, res) => {
  const sql = $sql.Stu.addAuthentication
  const params = req.body
  console.log('修改', params)
  conn.query(sql, [params.sfz_number, params.real_name, params.userId], function (err, result) {
    if (err) {
      console.log(err, 'editErr')
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
  console.log('查询医生', params)
  conn.query(sql, [params.m, params.n], function (err, result) {
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
  console.log('查询医生', params)
  conn.query(sql, [], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})
// 接口：根据id查询医生,查找的是两个表的，还有排班表的时间,以及号源
router.post('/associationQuery', (req, res) => {
  const sql = $sql.Stu.associationQuery
  const params = req.body
  console.log('查询医生 id', params)
  if (!params.id) {
    throw new Error('id必须传')
  }
  conn.query(sql, [params.id], function (err, result) {
    if (err) {
      throw new Error(err)
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})
// 接口：根据时间和科室或者就时间查找排班信息
router.post('/searchSchedu', (req, res) => {
  const params = req.body
  console.log('查询医生 科室', params)
  if (params.part) {
    const sql = $sql.Stu.searchSchedu
    conn.query(sql, [params.part, params.startTime, params.endTime], function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        console.log(111, result)
        jsonWrite(res, result)
      }
    })
  } else {
    const sql = $sql.Stu.searchScheduOfTime
    conn.query(sql, [params.startTime, params.endTime], function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        console.log(result)
        jsonWrite(res, result)
      }
    })
  }

})
//接口，查询医学知识
router.get('/searchKnowledge', (req, res) => {
  const sql = $sql.Stu.searchKnowledge
  const params = req.body
  console.log('查询医学常识', params)
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
//接口,添加预约信息
router.post('/addOrder', (req, res) => {
  let id = createId()
  const params = req.body
  console.log('添加预约信息', params)
  //就诊卡或者医保卡信息填入
  if (params.medicalCard) {
    const sql = $sql.Stu.addOrderOfMedicalCard
    conn.query(sql, [params.userId, id, params.allergicHistory, params.medicalCard, params.detail, params.time, params.doctorId, params.doctorName, params.part], function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        console.log(result)
        jsonWrite(res, result)
      }  // 
    })
  } else {
    const sql = $sql.Stu.addOrderOfMedicalInsuranceCard
    conn.query(sql, [params.userId, id, params.allergicHistory, params.medicalInsuranceCard, params.deatil, params.time, params.doctorId, params.doctorName, params.part], function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        console.log(result)
        jsonWrite(res, result)
      }  // 
    })
  }
})
//接口，预约成功之后医生的号源需要减一
router.post('/substrSignalSource', (req, res) => {
  const sql = $sql.Stu.substrSignalSource
  const params = req.body
  console.log('减号源', params)
  if (params.signalSource < 0) {
    jsonWrite(res, '真不巧，晚一步，号被别人抢走了，再预约一下其他时间吧')
  } else {
    conn.query(sql, [params.signalSource, params.doctorId, params.date], function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        console.log(result)
        jsonWrite(res, result)
      }  // 
    })
  }

})
module.exports = router