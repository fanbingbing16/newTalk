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
  conn.query(sql, [], function (err, result) {
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
// 接口：根据id查询医生
router.post('/searchDoctorOfId', (req, res) => {
  const sql = $sql.Stu.searchDoctorOfId
  const params = req.body
  console.log('查询医生 id', params)
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
// 接口：根据id查询医生,查找的是两个表的，还有排班表的时间,以及号源
router.post('/associationQuery', (req, res) => {
  const sql = $sql.Stu.associationQuery
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

// searchScheduFromId
// 接口：根据医生id查询排班表，时间查询是本周内
router.post('/searchScheduFromId', (req, res) => {
  const sql = $sql.Stu.searchScheduFromId
  const params = req.body
  console.log('根据医生id查询排班表，时间查询是本周内', params)
  conn.query(sql, [params.doctorId, params.startTime, params.endTime], function (err, result) {
    if (err) {
      throw new Error(err)
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
//接口，增加医学知识
router.post('/addKnowledge', (req, res) => {
  const sql = $sql.Stu.addKnowledge
  const params = req.body
  const id = createId()
  const classification = params.classification && params.classification.length > 0 ? params.classification : '1'
  console.log('医学常识', params)
  conn.query(sql, [params.title, params.content, classification, id], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      console.log(result)
      jsonWrite(res, result)
    }  // 
  })
})

//接口，根据医生的id查询预约记录
router.post('/searchOrderOfDoctor', (req, res) => {
  const sql = $sql.Stu.searchOrderOfDoctor
  const params = req.body
  console.log('根据医生的id查询预约记录', params)
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
//接口,添加预约信息
router.post('/addOrder', (req, res) => {
  let id = createId()
  const params = req.body
  console.log('添加预约信息', params)
  //就诊卡或者医保卡信息填入
  if (params.medicalCard) {
    const sql = $sql.Stu.addOrderOfMedicalCard
    conn.query(sql, [params.userId, id, params.allergiHistory, params.medicalCard, params.detail, params.time, params.doctorId, params.doctorName, params.part, params.sex], function (err, result) {
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
    conn.query(sql, [params.userId, id, params.allergicHistory, params.medicalInsuranceCard, params.deatil, params.time, params.doctorId, params.doctorName, params.part, params.sex], function (err, result) {
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
//接口，添加用户的线上问诊的信息
router.post('/addOnlineMessage', (req, res) => {
  const sql = $sql.Stu.addOnlineMessage
  const params = req.body
  const id = createId()
  console.log('添加问诊信息', params)
  conn.query(sql, [id, params.userId, params.userName, params.sex,
    params.age, params.email, params.phone, params.address, params.dignosis, params.drug,
    params.infectedImage, params.allergiHistory, params.medicalInsuranceCard, params.medicalCard,
    params.detail, params.fever, params.prescriptionNumber], function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        console.log(result)
        jsonWrite(res, result)
      }  // 
    })
})
//接口，根据病人id查询病人的信息
router.post('/searchOnlineMessage', (req, res) => {
  const sql = $sql.Stu.searchOnlineMessage
  const params = req.body
  console.log('添加问诊信息', params)
  conn.query(sql, [params.patientId], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      console.log(result)
      jsonWrite(res, result)
    }  // 
  })
})
// 接口：查询全部聊天记录
router.get('/searchTalk', (req, res) => {
  const sql = $sql.Stu.searchTalk
  const params = req.body
  console.log(params, '查询病人和医生的聊天记录')
  conn.query(sql, [], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})
// 接口：根据时间查询聊天记录
router.post('/searchTalkOfTime', (req, res) => {
  const sql = $sql.Stu.searchTalkOfTime
  const params = req.body
  console.log('时间 查询聊天记录', params)
  if (!params.startTime || !params.endTime) {
    throw new Error('时间必须传')
  }
  conn.query(sql, [params.startTime, params.endTime], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})
// 接口：查询指定病人的未结束的聊天记录
router.post('/searchPatientTalk', (req, res) => {
  const sql = $sql.Stu.searchPatientTalk
  const params = req.body
  console.log('查询指定病人的未结束的聊天记录', params)
  conn.query(sql, [params.userId], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})
// 接口：根据发送人查询聊天记录
router.post('/searchTalkOfFrom', (req, res) => {
  const sql = $sql.Stu.searchTalkOfFrom
  const params = req.body
  console.log('searchTalkOfFrom 查询聊天记录', params)
  conn.query(sql, [params.talkFrom], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})
// 接口：根据接收人查询聊天记录
router.post('/searchTalkOfTo', (req, res) => {
  const sql = $sql.Stu.searchTalkOfFrom
  const params = req.body
  console.log('searchTalkOfTo 查询聊天记录', params)
  conn.query(sql, [params.talkTo], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})
// 接口：根据接收人和发送人查询聊天记录
router.post('/searchTalkOfFromTo', (req, res) => {
  const sql = $sql.Stu.searchTalkOfFromTo
  const params = req.body
  console.log('searchTalkOfFromTo 查询聊天记录', params)
  conn.query(sql, [params.talkFrom, params.talkTo], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})
// 接口：根据用户id查询用户需要交钱的订单
router.post('/searchMedicalMessage', (req, res) => {
  const sql = $sql.Stu.searchMedicalMessage
  const params = req.body
  console.log('searchMedicalMessage 查询订单', params)
  conn.query(sql, [params.userId], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})
//接口，交钱之后更新数据
router.post('/updateMedicalMessage', (req, res) => {
  const sql = $sql.Stu.updateMedicalMessage
  const params = req.body
  console.log('更新订单数据', params)
  // totalPay = ?,wellPayment = ? where id = ?
  conn.query(sql, [params.totalPay, params.wellPayment, params.prescriptionNumber], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      console.log(result)
      jsonWrite(res, result)
    }  // 
  })
})
// 接口：查询医生 医生登录所用
router.get('/searchDoctorUser', (req, res) => {
  const sql = $sql.Stu.searchDoctorUser
  const params = req.body
  console.log('searchDoctorUser 查询医生', params)
  conn.query(sql, [], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})
// 接口：修改医生登录密码
router.post('/updataPassOfDoctor', (req, res) => {
  const sql = $sql.Stu.updataPassOfDoctor
  const params = req.body
  console.log('updataPassOfDoctor 查询医生', params)
  conn.query(sql, [params.password, params.id], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})
// 接口：增加医生
router.post('/addDoctorUser', (req, res) => {
  const sql = $sql.Stu.addDoctorUser
  const params = req.body
  const id = createId()
  console.log('addDoctorUser 增加医生', params)
  conn.query(sql, [id, params.name, params.password, params.text, params.sf_number, params.phone, params.email], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      // jsonWrite(res, result)
      conn.query($sql.Stu.addDoctor, [id, params.name, params.part, params.title, params.sex, params.image, params.detail], function (err, result) {
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
// 接口：病人主动结束问诊，删除问诊的聊天信息，将其存储到history中 涉及三句sql
// searchPatientTalk endTalk addHistoryTalk
// history_online_consultion(userId,userName,doctorId,id,endTime,startTime,info) values (?,?,?,?,?,?,?)',
// 
router.post('/endTalk', (req, res) => {
  const sql1 = $sql.Stu.searchPatientTalk
  const sql2 = $sql.Stu.endTalk
  const sql3 = $sql.Stu.addHistoryTalk
  const params = req.body
  const id = createId()
  console.log('结束问诊，删除问诊的聊天信息，将其存储到history中', params)
  conn.query(sql1, [params.userId], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      let talk = JSON.parse(JSON.stringify(result))
      let history = []
      talk.map(item => {
        let index = history.findIndex(element =>
          element.doctorId === item.doctorId && element.userId === item.userId
        )
        if (index > -1) {
          console.log(history[index])
          history[index].info.push({ text: item.text, talkTo: item.talkTo, talkFrom: item.talkFrom, time: item.time })
          history[index].startTime = Math.min(history[index].startTime, item.time)
        } else {
          history.push({
            userId: item.userId, userName: item.userName, doctorId: item.doctorId, doctorName: item.doctorName, id, endTime: new Date().getTime(), startTime: item.time,
            info: [{ text: item.text, talkTo: item.talkTo, talkFrom: item.talkFrom, time: item.time }], endOf: params.endOf, prescriptionNumber: params.prescriptionNumber
          })
        }
      })
      // userId,userName,doctorId,doctorName,id,endTime,startTime,info
      history.map(item => {
        item.info = JSON.stringify(item.info)
        item.id = createId()
        conn.query(sql3, Object.values(item), function (err2, result2) {
          if (err2) {
            console.log(err2)
          }
        })
      })
      conn.query(sql2, [params.userId], function (err3, result3) {
        if (err)
          console.log(err3)
        if (result3) {
          jsonWrite(res, result3)
        }
      })
    }  // 
  })
})

// 接口：根据病人id查询病人的处方
router.post('/searchPrescription', (req, res) => {
  const sql = $sql.Stu.searchPrescription
  const params = req.body
  console.log('searchPrescription 根据病人id查询病人的处方', params)
  conn.query(sql, [params.patientId], function (err, result) {
    if (err) {
      console.log(err)
      throw new Error(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})
// 接口：查询历史线上问诊记录，根据医生查询
router.post('/searchHistoryTalk', (req, res) => {
  const sql = $sql.Stu.searchHistoryTalk
  const params = req.body
  console.log('searchHistoryTalk 查询历史线上问诊记录，根据医生查询', params)
  conn.query(sql, [params.doctorId], function (err, result) {
    if (err) {
      throw new Error(err)
    }
    if (result) {
      jsonWrite(res, result)
    }  // 
  })
})
// 接口：医生给病人开处方
router.post('/addPrescription', (req, res) => {
  const sql = $sql.Stu.addPrescription
  const params = req.body
  // prescriptionNumber,date,diagnosis,drugs,doctorId,patientId,isProduct
  console.log('addPrescription 医生给病人开处方', params)
  conn.query(sql, [params.prescriptionNumber, params.date, params.diagnosis, params.drugs, params.doctorId, params.patientId, params.isProduct], function (err, result) {
    if (err) {
      console.log(err)
      throw new Error(err)
    }
    if (result) {
      conn.query($sql.Stu.addBill, [params.doctorId, params.wellPayment, params.patientId, params.prescriptionNumber], function (err2, result2) {
        if (err2) {
          console.log(err2)
          throw new Error(err2)
        }
        if (result2) {
          jsonWrite(res, result2)
        }
      })
    }  // 
  })
})
module.exports = router