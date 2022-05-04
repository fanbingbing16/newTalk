<template>
  <div class="manage-login">
    <p>管理员登录</p>
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm" style="height: 40%">
      <el-alert title="您的输入有误" type="error" description="请您再检查一下您的用户名和密码" show-icon v-if="haveError"> </el-alert>
      <el-form-item label="用户名" prop="age">
        <el-input v-model.number="ruleForm2.age"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'ManageLogin',
  data() {
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
        age: ''
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        age: [{ validator: checkAge, trigger: 'blur' }]
      },
      haveError: false,
      ip: 'http://localhost:3000/api/Manage/'
    }
  },
  created() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post(this.ip + 'login', { name: this.ruleForm2.age }).then(response => {
            console.log(response)
            if (response.data.length === 0) {
              this.$message.error('不存在该账户')
            } else if (response.data[0].password !== this.ruleForm2.pass) {
              this.$message.error('密码错误')
            } else {
              localStorage.setItem('userId', response.data[0].id)
              localStorage.setItem('power', 'all')
              this.$router.push('/manage/navigation')
            }
          })
        } else {
          this.haveError = true
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
.forword {
  margin-left: 10px;
}
.register {
  margin-right: 10px;
}
.manage-login {
  height: 100%;
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
.manage-login p {
  position: absolute;
  top: 100px;
  font-size: 32px;
}
</style>
<style>
.el-form-item__error {
  color: #e13535;
  font-family: serif;
  font-weight: 100;
}
/* form.el-form.demo-ruleForm {
  height: 40%;
} */
</style>
