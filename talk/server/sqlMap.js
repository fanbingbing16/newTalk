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
    addOrderOfMedicalInsuranceCard: "insert into reservationInformation(userId,id,allergicHistory,medicalInsuranceCard,deatil,time,doctorId,doctorName,part) values (?,?,?,?,?,?,?,?,?)",
    addOrderOfMedicalCard: "insert into reservationInformation(userId,id,allergicHistory,medicalCard,detail,time,doctorId,doctorName,part) values (?,?,?,?,?,?,?,?,?)",
    substrSignalSource: 'update scheduling set signalSource = ? where doctorId = ? and date = ?',
    addOnlineMessage: 'insert into onlinepatientinformation(id,userId,userName,sex,age,email,phone,address,dignosis,drug,infectedImage,allergiHistory,medicalInsuranceCard,medicalCard,detail,fever) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    searchTalk: 'select * from talkDoctor',
    searchTalkOfTime: 'select * from talkDoctor where time>=? and time<=?',
    searchTalkOfFrom: 'select * from talkDoctor where from = ?',
    searchTalkOfTo: 'select * from talkDoctor where to = ?',
    searchTalkOfFromTo: 'select * from talkDoctor where to = ? and from =?',
    addTalk:'insert into talkDoctor(doctorId,doctorName,userId,userName,time,text,id,endTime,to,from) values (?,?,?,?,?,?,?,?,?,?)'
  }
}

module.exports = sqlMap