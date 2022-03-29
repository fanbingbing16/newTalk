// sqlMap.js  sql语句
const sqlMap = {
  Stu: {
    add: 'insert into talk(userId,userName,password,text) values (?,?,?,?)',
    show: 'select * from talk',
    del: 'delete from talk where userId = ?',
    updatePassword: 'update talk set password = ? where userId = ?',
    showOfId: 'select * from talk where userId = ?',
    showDoctor: 'select * from doctor limit ?,?',
    showAllDoctor: 'select * from doctor',
    searchDoctorOfId: 'select * from doctor where id = ?',
    searchSchedu: 'select * from scheduling where part=? and date > ? and date < ?',
    searchScheduOfTime: 'select * from scheduling where date > ? and date < ?',
    associationQuery: 'select doctor.*,scheduling.date,scheduling.signalSource from doctor,scheduling where doctor.id=? and doctor.id=scheduling.doctorId;',
    searchKnowledge: 'select * from knowledge',
    addAuthentication: "update talk set sfz_number=?,authentication='1',real_name=? where userId=?",
    addOrderOfMedicalInsuranceCard: "insert into reservationInformation(userId,id,allergicHistory,medicalInsuranceCard,detail,time,doctorId,doctorName,part,sex) values (?,?,?,?,?,?,?,?,?,?)",
    addOrderOfMedicalCard: "insert into reservationInformation(userId,id,allergicHistory,medicalCard,detail,time,doctorId,doctorName,part,sex) values (?,?,?,?,?,?,?,?,?,?)",
    searchOrderOfDoctor: 'select reservationInformation.*,talk.*   from reservationInformation,talk where reservationInformation.doctorId = ? and reservationInformation.userId = talk.userId',
    substrSignalSource: 'update scheduling set signalSource = ? where doctorId = ? and date = ?',
    addOnlineMessage: 'insert into onlinepatientinformation(id,userId,userName,sex,age,email,phone,address,dignosis,drug,infectedImage,allergiHistory,medicalInsuranceCard,medicalCard,detail,fever) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    searchTalk: 'select * from talkDoctor',
    searchTalkOfTime: 'select * from talkDoctor where time >= ? and time <= ?',
    searchTalkOfFrom: 'select * from talkDoctor where from = ?',
    searchTalkOfTo: 'select * from talkDoctor where to = ?',
    searchTalkOfFromTo: 'select * from talkDoctor where to = ? and from = ?',
    addTalk: 'insert into talkDoctor(doctorId,doctorName,userId,userName,time,text,id,endTime,to,from) values (?,?,?,?,?,?,?,?,?,?)',
    searchMedicalMessage: 'select * from userMedicalMessage where userId = ?',
    updateMedicalMessage: 'update userMedicalMessage set totalPay = ?,wellPayment = ? where id = ?',
    searchDoctorUser: 'select * from doctorUser',
    updataPassOfDoctor: 'update doctorUser set password = ? where id = ?',
    addDoctorUser: 'insert into doctorUser(id,name,password,text,sf_number,phone,email) values (?,?,?,?,?,?,?)',
    addDoctor: 'insert into doctor(id,name,part,title,sex,image,detail) values (?,?,?,?,?,?,?)'
  }
}


module.exports = sqlMap