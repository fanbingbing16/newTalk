<template>
  <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="RegisterDoctor">
    <el-alert title="您的输入有误" type="error" description="请您再检查一下您的姓名和密码，身份信息必须是真实的" show-icon v-if="haveError"> </el-alert>
    <el-form-item label="姓名" prop="name">
      <el-input v-model.number="ruleForm2.name"></el-input>
    </el-form-item>
    <el-form-item label="身份证" prop="sfz">
      <el-input v-model="ruleForm2.sfz"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-radio-group v-model="ruleForm2.sex">
        <el-radio label="女"></el-radio>
        <el-radio label="男"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input type="email" v-model="ruleForm2.email"></el-input>
    </el-form-item>
    <el-form-item label="电话号码" prop="phone">
      <el-input v-model="ruleForm2.phone"></el-input>
    </el-form-item>
    <el-form-item label="职称" prop="title">
      <el-input v-model="ruleForm2.title"></el-input>
    </el-form-item>
    <el-form-item label="简要描述" prop="detail">
      <el-input v-model="ruleForm2.detail"></el-input>
    </el-form-item>
    <el-form-item label="最近的照片" prop="image">
      <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1" :on-change="changeImage">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{ file }">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions"> </span>
        </div>
      </el-upload>
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
    <el-form-item label="所属科室" prop="part">
      <el-select v-model="ruleForm2.part" placeholder="请选择科室">
        <el-option v-for="item in schedule" :key="item.part" :label="item.part" :value="item.part"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="!isManage">
      <el-button type="primary" @click="returnLogin">返回</el-button>
      <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { validateSfz } from './validateSfz.js'
import { schedule } from './part.js'
export default {
  props: ['isManage'],
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
      schedule: schedule,
      ruleForm2: {
        pass: '',
        checkPass: '',
        name: '',
        text: '',
        image: '',
        email: '',
        sfz: '',
        part: '',
        title: '',
        detail: '',
        sex: '女',
        phone: ''
      },
      rules2: {
        phone: { required: true, message: '必须输入', trigger: 'blur' },
        pass: [
          { validator: validatePass, trigger: 'blur' },
          { required: true, message: '必须输入', trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' },
          { required: true, message: '必须输入', trigger: 'blur' }
        ],
        name: [
          { validator: checkName, trigger: 'blur' },
          { required: true, message: '必须输入姓名', trigger: 'blur' }
        ],
        text: [
          { validator: checkText, trigger: 'blur' },
          { required: true, message: '必须输入', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        sfz: [
          { validator: validateSfz, trigger: 'blur' },
          { required: true, message: '身份证号码必须输入', trigger: 'blur' }
        ],
        image: { required: true, message: '请上传照片', trigger: 'blur' },
        part: { required: true, message: '请选择科室', trigger: 'blur' },
        title: { required: true, message: '请选择职称', trigger: 'blur' },
        detail: { required: true, message: '请简要描述一下自己', trigger: 'blur' }
      },
      haveError: false,
      ip: 'http://localhost:3000/api/Stu/',
      data: [{}]
    }
  },
  created() {
    this.$axios.get(this.ip + 'searchDoctorUser').then(response => {
      this.data = response.data
      // console.log(response.data);
    })
  },
  methods: {
    changeImage(file) {
      //将blob图片转成base64的格式，存储到数据库就以字符串的形式
      let that = this
      this.blobToDataURI(file.raw, function (data) {
        that.ruleForm2.image = data
      })
    },
    blobToDataURI(blob, callback) {
      var reader = new FileReader()
      reader.onload = function (e) {
        callback(e.target.result)
      }
      reader.readAsDataURL(blob)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let check = this.data.filter(item => item.sf_number === String(this.ruleForm2.sfz))
          if (check.length > 0) {
            alert('该用户已经存在！')
            this.resetForm('ruleForm2')
          } else {
            //  params.name, params.password, params.text, params.sf_number, params.phone, params.email]
            //  params.name, params.part, params.sex, params.image, params.detail
            this.$axios
              .post(this.ip + 'addDoctorUser', {
                name: this.ruleForm2.name,
                password: this.ruleForm2.pass,
                text: this.ruleForm2.text,
                sf_number: this.ruleForm2.sfz,
                phone: this.ruleForm2.phone,
                email: this.ruleForm2.email,
                part: this.ruleForm2.part,
                sex: this.ruleForm2.sex,
                image: this.ruleForm2.image,
                detail: this.ruleForm2.detail,
                title: this.ruleForm2.title
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
  },
  watch: {
    ruleForm2: {
      handler(newVal) {
        this.$refs['ruleForm2'].validate(valid => {
          if (valid) this.$emit('getForm', newVal)
        })
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.el-alert--error.is-light {
  position: fixed;
  top: 4%;
  width: 34%;
  z-index: 3;
}
.text span {
  position: absolute;
  width: 75%;
  color: red;
}
</style>
<style>
.RegisterDoctor {
  margin-top: 2% !important;
  z-index: 2;
  height: 120% !important;
}
.RegisterDoctor .is-checked span {
  color: white !important;
}
</style>
