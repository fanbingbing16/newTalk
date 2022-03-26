/* 是否邮箱*/
export function isEmail(rule, value, callback) {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (value == '' || value == undefined || value == null) {
    callback();
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱地址'));
    } else {
      callback();
    }
  }
}
/* 是否手机号码*/
export function isPhone(rule, value, callback) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (value == '' || value == undefined || value == null) {
    callback();
  } else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的电话号码'));
    } else {
      callback();
    }
  }
}
export function validateSfz(rule, value, callback) {
  if (!value) {
    return callback(new Error('身份证号码不能为空'));
  }
  function validataCredentials(num) {
    // var boo; //  msg身份证验证友情提示,boo返回值
    var num2 = num.toUpperCase(); // 身份证为末尾可能是X
    //   身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，
    //   最后一位是校验位，可能为数字或字符X。
    const arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    const arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    var nTemp = 0,
      i;
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num2))) {
      //  输入的身份证号长度不对，或者号码不符合规定;
      return [false, "输入的身份证号长度不对，或者号码不符合规定"];
    }
    //   校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //   下面分别分析出生日期和校验位
    var len, re;
    len = num2.length;
    if (len == 15) {
      re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
      var arrSplit = num2.match(re);
      //   检查生日日期是否正确
      var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
      var bGoodDay;
      bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
      if (!bGoodDay) {
        //   输入的身份证号里出生日期不对！
        return [false, "输入的身份证号里出生日期不对！"];

      } else {
        //   将15位身份证转成18位
        //   校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。   
        num2 = num2.substr(0, 6) + '19' + num2.substr(6, num2.length - 6);
        for (i = 0; i < 17; i++) {
          nTemp += num2.substr(i, 1) * arrInt[i];
        }
        num2 += arrCh[nTemp % 11];
        return [true, num2];
      }
    }
    if (len == 18) {
      re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
      var arrSplit2 = num2.match(re);
      //  检查生日日期是否正确
      var dtmBirth2 = new Date(arrSplit2[2] + "/" + arrSplit2[3] + "/" + arrSplit2[4]);
      var bGoodDay2;
      bGoodDay2 = (dtmBirth2.getFullYear() == Number(arrSplit2[2])) && ((dtmBirth2.getMonth() + 1) == Number(arrSplit2[3])) && (dtmBirth2.getDate() == Number(arrSplit2[4]));
      if (!bGoodDay2) {
        //  输入的身份证号里出生日期不对！ 

        return [false, " 输入的身份证号里出生日期不对"];
      } else {
        //  检验18位身份证的校验码是否正确。
        //  校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        var valnum;
        for (i = 0; i < 17; i++) {
          nTemp += num2.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[nTemp % 11];
        if (valnum != num2.substr(17, 1)) {
          //  18位身份证的校验码不正确！
          return [false, "身份证的校验码不正确！"];
        }
        return [true, "验证成功"]
      }
    }
    return [false, "身份证的长度不正确！"];
  }
  var res = validataCredentials(value);
  setTimeout(() => {
    res = validataCredentials(value);
    if (!res[0]) {
      callback(new Error(res[1]));
    } else {
      callback();
    }
  }, 200)
}

/* 合法真实姓名 */
export function validateRealName(rule, value, callback) {
  const realnameReg = /[a-zA-Z\u4E00-\u9FA5]+$/
  if (!value) {
    return callback(new Error('真实姓名不能为空!!'))
  }
  setTimeout(() => {
    if (!realnameReg.test(value)) {
      return callback(new Error('您的真实姓名格式错误,请输入英文或汉字!'))
    } else {
      callback()
    }
  }, 100)
}
