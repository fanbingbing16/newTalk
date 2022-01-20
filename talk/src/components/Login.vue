<template>
  <el-form
    :model="ruleForm2"
    status-icon
    :rules="rules2"
    ref="ruleForm2"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-alert
      title="您的输入有误"
      type="error"
      description="请您再检查一下您的用户名和密码"
      show-icon
      v-if="haveError"
    >
    </el-alert>
    <el-form-item label="用户名" prop="age">
      <el-input v-model.number="ruleForm2.age"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="pass">
      <el-input
        type="password"
        v-model="ruleForm2.pass"
        auto-complete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input
        type="password"
        v-model="ruleForm2.checkPass"
        auto-complete="off"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <router-link to="/register" class="register">注册新账号</router-link>
      <el-button type="primary" @click="submitForm('ruleForm2')"
        >提交</el-button
      >
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
      <router-link to="/forword" class="forword">忘记密码</router-link>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      //   !Number.isInteger(value) String(value).length < 3 || String(value).length > 10
      setTimeout(() => {
        if (!/[0-9a-zA-z]{3,10}/.exec(value)) {
          callback(new Error("只能输入3-10位数字和密码的组合"));
        } else {
          callback();
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        pass: "",
        checkPass: "",
        age: "",
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        age: [{ validator: checkAge, trigger: "blur" }],
      },
      haveError: false,
      ip: "http://localhost:3000/api/Stu/",
      test: [{}],
    };
  },
  created() {
    this.$axios.get(this.ip + "showStu").then((response) => {
      this.test = response.data;
      // console.log(response.data);
    });
  },
  methods: {
    submitForm(formName) {
      console.log(this.test);
      console.log(this.$refs[formName]["_props"].model, this.ruleForm2, "for");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let inputData = this.$refs[formName]["_props"].model;
          let boo = this.test.some((item) => {
            console.log(
              +item.userId,
              this.ruleForm2.age,
              +item.userId === this.ruleForm2.age,
              item.password,
              this.ruleForm2.pass,
              item.password === this.ruleForm2.pass,
              "item"
            );
            if (
              +item.userId === this.ruleForm2.age &&
              item.password === this.ruleForm2.pass
            ) {
              return true;
            }
          });
          if (boo) {
            localStorage.setItem("userId", this.ruleForm2.age);//用户登录成功就将用户的id存储在localStorage
            this.$router.push({ path: "talk/" + this.ruleForm2.age });
          } else {
            this.haveError = true;
            return false;
          }
        } else {
          this.haveError = true;
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
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
</style>
<style>
.el-form-item__error {
  color: #e13535;
  font-family: serif;
  font-weight: 100;
}
</style>