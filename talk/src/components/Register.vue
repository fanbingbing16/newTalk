<template>
  <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="register-ruleForm demo-ruleForm">
    <el-alert title="您的输入有误" type="error" description="请您再检查一下您的用户名和密码" show-icon v-if="haveError"> </el-alert>
    <el-form-item label="用户名" prop="age">
      <el-input v-model.number="ruleForm2.age"></el-input>
    </el-form-item>
    <el-form-item label="账号" prop="name">
      <el-input v-model.number="ruleForm2.name"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="pass">
      <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="秘密文本" prop="text" class="text">
      <el-input type="password" v-model="ruleForm2.text" auto-complete="off"></el-input>
      <span>该秘密文本将用于您的密码找回，请您一定要记住！</span>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="returnLogin">返回</el-button>
      <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
      <router-link to="/doctor/register" style="margin-left: 2px">医生?注册医生账号</router-link>
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
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      }
      //   !Number.isInteger(value) String(value).length < 3 || String(value).length > 10
      setTimeout(() => {
        if (!/[0-9a-zA-z]{3,10}/.exec(value)) {
          callback(new Error('只能输入3-10位数字和字母的组合'))
        } else {
          callback()
        }
      }, 1000)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
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
        name: '',
        text: ''
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        age: [{ validator: checkAge, trigger: 'blur' }],
        name: [{ validator: checkName, trigger: 'blur' }],
        text: [{ validator: checkText, trigger: 'blur' }]
      },
      haveError: false,
      ip: 'http://localhost:3000/api/Stu/',
      test: [{}]
    }
  },
  created() {
    this.$axios.get(this.ip + 'showStu').then(response => {
      this.test = response.data
      // console.log(response.data);
    })
  },
  methods: {
    submitForm(formName) {
      console.log(this.test, 'test')
      this.$refs[formName].validate(valid => {
        if (valid) {
          let check = this.test.filter(item => item.userId === String(this.ruleForm2.age))
          if (check.length > 0) {
            alert('该用户已经存在！')
            this.resetForm('ruleForm2')
          } else {
            this.$axios
              .post(this.ip + 'addStu', {
                userId: String(this.ruleForm2.age),
                userName: String(this.ruleForm2.name),
                password: String(this.ruleForm2.pass),
                text: String(this.ruleForm2.text)
              })
              .then(response => {
                console.log(response, 'response')
                if (response.status === 200) {
                  alert('注册成功，欢迎您的加入！')
                  this.returnLogin()
                }
              })
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
.el-alert--error.is-light {
  position: fixed;
  top: 100px;
  width: 34%;
}
.register-ruleForm {
  height: 54%;
}
.text span {
  position: absolute;
  width: 75%;
  color: red;
}
</style>
