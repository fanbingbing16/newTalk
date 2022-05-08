let date = new Date().getTime()
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
    searchScheduFromId: 'select * from scheduling where doctorId=? and date>? and date< ?',
    searchScheduOfTime: 'select * from scheduling where date > ? and date < ?',
    associationQuery: 'select doctor.*,scheduling.date,scheduling.signalSource from doctor,scheduling where doctor.id=? and doctor.id=scheduling.doctorId;',
    searchKnowledge: 'select * from knowledge',
    addKnowledge: 'insert into knowledge(title,content,classification,id) values (?,?,?,?)',
    addAuthentication: "update talk set sfz_number=?,authentication='1',real_name=? where userId=?",
    addOrderOfMedicalInsuranceCard: "insert into reservationInformation(userId,id,allergiHistory,medicalInsuranceCard,detail,time,doctorId,doctorName,part,sex) values (?,?,?,?,?,?,?,?,?,?)",
    addOrderOfMedicalCard: "insert into reservationInformation(userId,id,allergiHistory,medicalCard,detail,time,doctorId,doctorName,part,sex) values (?,?,?,?,?,?,?,?,?,?)",
    searchOrderOfDoctor: 'select reservationInformation.*,talk.*   from reservationInformation,talk where reservationInformation.doctorId = ? and reservationInformation.userId = talk.userId',
    substrSignalSource: 'update scheduling set signalSource = ? where doctorId = ? and date = ?',
    addOnlineMessage: 'insert into onlinepatientinformation(id,userId,userName,sex,age,email,phone,address,dignosis,drug,infectedImage,allergiHistory,medicalInsuranceCard,medicalCard,detail,fever,prescriptionNumber) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    searchOnlineMessage: 'select * from onlinepatientinformation where userId=?',
    searchTalk: 'select * from talkDoctor',
    searchTalkOfTime: 'select * from talkDoctor where time >= ? and time <= ?',
    searchTalkOfFrom: 'select * from talkDoctor where talkFrom = ?',
    searchPatientTalk: 'select * from talkDoctor where userId=? and endTime=0',
    searchTalkOfTo: 'select * from talkDoctor where talkTo = ?',
    endTalk: 'delete from talkDoctor where userId=?',
    searchTalkOfFromTo: 'select * from talkDoctor where talkTo = ? and talkFrom = ?',
    addTalk: 'insert into talkDoctor(doctorId,doctorName,userId,userName,time,text,id,endTime,talkTo,talkFrom) values (?,?,?,?,?,?,?,?,?,?)',
    addHistoryTalk: 'insert into history_online_consultion(userId,userName,doctorId,doctorName,id,endTime,startTime,info,endOf,prescriptionNumber) values (?,?,?,?,?,?,?,?,?,?)',
    searchHistoryTalk: 'select * from history_online_consultion where doctorId=?',
    searchMedicalMessage: 'select * from userMedicalMessage where patientId = ?',
    updateMedicalMessage: 'update userMedicalMessage set totalPay = ?,wellPayment = ? where prescriptionNumber = ?',
    searchDoctorUser: 'select * from doctorUser',
    updataPassOfDoctor: 'update doctorUser set password = ? where id = ?',
    addDoctorUser: 'insert into doctorUser(id,name,password,text,sf_number,phone,email) values (?,?,?,?,?,?,?)',
    addDoctor: 'insert into doctor(id,name,part,title,sex,image,detail) values (?,?,?,?,?,?,?)',
    addPrescription: 'insert into prescription(prescriptionNumber,date,diagnosis,drugs,doctorId,patientId,isProduct) values(?,?,?,?,?,?,?)',
    searchPrescription: 'select * from onlinepatientinformation,prescription,doctor where onlinepatientinformation.userId=prescription.patientId and prescription.patientId = ? and  prescription.prescriptionNumber = onlinepatientinformation.prescriptionNumber and doctor.id=prescription.doctorId',
    addBill: 'insert into usermedicalmessage(doctorId,wellPayment,patientId,prescriptionNumber) values (?,?,?,?)'
  },
  manage: {
    searchLogin: 'select * from manageLogin where name=?',
    searchPrescription: 'select *,prescription.prescriptionNumber as prescriptionNumber,onlinepatientinformation.prescriptionNumber as oPrescriptionNumber from prescription left join onlinepatientinformation on onlinepatientinformation.userId=prescription.patientId and  prescription.prescriptionNumber = onlinepatientinformation.prescriptionNumber left join doctor on doctor.id=prescription.doctorId',
    addScheduling: 'insert into scheduling(date,name,id,doctorId,part,signalSource) values (?,?,?,?,?,?)',
    searchOrder: 'select reservationInformation.*,talk.* from reservationInformation,talk where reservationInformation.userId = talk.userId',
    editScheduling: 'update scheduling set date =?,signalSource=? where id=?',
    deleteScheduling: 'delete from scheduling where id=?',
    associationQuery: 'select doctor.*,scheduling.* from doctor,scheduling where doctor.id=? and doctor.id=scheduling.doctorId',
    searchDoctorDoctorUser: 'select * from doctor,doctorUser where doctor.id=doctorUser.id',
    editDoctor: 'update doctor,doctorUser set doctorUser.email=? ,doctorUser.phone=?, doctor.part=?,doctor.title=?,doctor.sex=?,doctor.image=?,doctor.detail=? where doctor.id=? and doctor.id=doctorUser.id',
    deleteDoctor: 'delete from doctor where doctor.id=? ',
    deleteDoctorUser: 'delete from doctorUser where doctorUser.id=? '

  }
}


module.exports = sqlMap