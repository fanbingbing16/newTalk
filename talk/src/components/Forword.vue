<template>
  <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm forward-ruleForm">
    <div class="title"><span>修改密码</span></div>
    <el-alert title="您的输入有误" type="error" description="请您再检查一下您的用户名和密码，如果您的秘密文本忘记那很抱歉您可能需要注销账号了" show-icon v-if="haveError"> </el-alert>
    <el-form-item label="用户名" prop="age">
      <el-input v-model.number="ruleForm2.age"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="pass">
      <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="秘密文本" prop="text">
      <el-input type="password" v-model="ruleForm2.text" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="是否是医生?" prop="isDoctor">
      <el-switch v-model="ruleForm2.isDoctor"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="returnLogin">返回</el-button>
      <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    var checkText = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('秘密文本不能为空'))
      } else {
        callback()
      }
    }
    // var checkName = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error('账号不能为空'))
    //   } else {
    //     callback()
    //   }
    // }
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      }
      //   !Number.isInteger(value) String(value).length < 3 || String(value).length > 10
      setTimeout(() => {
        if (!/.{2,10}/.exec(value)) {
          callback(new Error('只能输入2-10位'))
        } else {
          callback()
        }
      }, 1000)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm2: {
        pass: '',
        checkPass: '',
        age: '',
        text: '',
        isDoctor: false
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        age: [{ validator: checkAge, trigger: 'blur' }],
        text: [{ validator: checkText, trigger: 'blur' }]
      },
      haveError: false,
      ip: 'http://localhost:3000/api/Stu/',
      test: [{}],
      doctorMessage: []
    }
  },
  created() {
    this.$axios.get(this.ip + 'showStu').then(response => {
      this.test = response.data
      // console.log(response.data);
    })
    this.$axios.get(this.ip + 'searchDoctorUser').then(response => {
      this.doctorMessage = response.data
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.ruleForm2.isDoctor) {
            let boo = this.test.some(item => {
              console.log(item.userId === String(this.ruleForm2.age), item.text === String(this.ruleForm2.text), 111)
              if (item.userId === String(this.ruleForm2.age)) {
                if (item.text === String(this.ruleForm2.text)) {
                  return true
                }
              }
            })
            if (boo) {
              this.$axios
                .post(this.ip + 'updateStu', {
                  password: this.ruleForm2.pass,
                  userId: String(this.ruleForm2.age)
                })
                .then(response => {
                  if (response.status === 200) {
                    alert('密码修改成功！')
                    setTimeout(this.returnLogin(), 2000)
                  }
                })
            } else {
              this.haveError = true
              return false
            }
          } else {
            let id = ''
            let boo = this.doctorMessage.some(item => {
              if (item.name === String(this.ruleForm2.age) && item.text === String(this.ruleForm2.text)) {
                id = item.id
                return true
              }
            })
            if (boo) {
              this.$axios
                .post(this.ip + 'updataPassOfDoctor', {
                  password: this.ruleForm2.pass,
                  id: id
                })
                .then(response => {
                  if (response.status === 200) {
                    alert('密码修改成功！')
                    setTimeout(() => {
                      this.returnLogin()
                    }, 2000)
                  }
                })
            }
          }
        } else {
          this.haveError = true
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    returnLogin() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
<style scoped>
.title {
  background-color: rgb(36 214 104);
  width: 29%;
  height: 30px;
  margin-left: 46%;
  margin-bottom: 10px;
}
.title span {
  color: #fff;
  line-height: 30px;
}
.el-alert--error.is-light {
  position: fixed;
  top: 100px;
  width: 34%;
}
</style>
<style>
.forward-ruleForm {
  height: 60%;
}
</style>
