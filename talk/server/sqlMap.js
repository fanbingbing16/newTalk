// sqlMap.js  sql语句
const sqlMap = {
  Stu: {
    add: 'insert into talk(userId,userName,password,text) values (?,?,?,?)',
    show: 'select * from talk',
    del: 'delete from talk where userId = ?',
    updatePassword: 'update talk set password = ? where userId = ?',
    showDoctor: 'select * from doctor limit ?,?',
    showAllDoctor: 'select * from doctor'
  }
}

module.exports = sqlMap