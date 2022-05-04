<template>
  <div>
    <div class="background-grey"></div>
    <div class="model">
      <p>请您填写一下个人信息</p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="使用医保卡?" prop="isMedicalInsuranceCard">
          <el-switch v-model="ruleForm.isMedicalInsuranceCard"></el-switch>
        </el-form-item>
        <el-form-item label="医保卡" prop="edicalInsuranceCard" v-if="ruleForm.isMedicalInsuranceCard">
          <el-input v-model="ruleForm.medicalInsuranceCard"></el-input>
        </el-form-item>
        <el-form-item label="就诊卡" prop="medicalCard" v-else class="medicalCard">
          <el-input v-model="ruleForm.medicalCard"></el-input>
        </el-form-item>
        <el-form-item label="是女生吗?" prop="sex">
          <el-switch v-model="ruleForm.sex"></el-switch>
        </el-form-item>
        <el-form-item label="过敏史" prop="allergiHistory">
          <el-input v-model="ruleForm.allergiHistory"></el-input>
        </el-form-item>
        <el-form-item label="请简单描述一下您的病情" prop="detail">
          <el-input v-model="ruleForm.detail"></el-input>
        </el-form-item>
        <el-form-item label="发烧发热吗?" prop="fever">
          <el-switch v-model="ruleForm.fever"></el-switch>
        </el-form-item>
      </el-form>
      <el-button style="margin-top: 10px" @click="cancleModel">取消</el-button>
      <el-button type="primary" @click="order('ruleForm')">确定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['date', 'time', 'doctorMessage', 'signalSource'],
  // inject: ['reload'],
  created() {
    let userId = localStorage.getItem('userId')
    this.$axios.post('http://localhost:3000/api/Stu/showOfId', { userId }).then(response => {
      this.userMessage = response.data[0]
      console.log(response.data)
    })
  },
  data() {
    return {
      ruleForm: {
        allergiHistory: '',
        medicalInsuranceCard: '',
        medicalCard: '',
        isMedicalInsuranceCard: false,
        detail: '',
        fever: false,
        sex: false
      },
      rules: {
        allergiHistory: { required: true, message: '请输入过敏史', trigger: 'blur' },
        medicalInsuranceCard: { message: '请输入医保卡', trigger: 'blur' },
        medicalCard: { message: '请输入就诊卡', trigger: 'blur' }
      },
      userMessage: []
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    cancleModel() {
      this.$emit('cancle', false)
    },
    order(formName) {
      if (this.ruleForm.fever) {
        this.$message({
          type: 'info',
          message: '发热请及时到医院就诊，无需预约,无法线上就诊'
        })
      } else {
        this.$refs[formName].validate(valid => {
          console.log(valid, 'valid')
          if (valid) {
            if (this.ruleForm.isMedicalInsuranceCard) {
              if (this.userMessage.edicalInsurance_card) {
                if (this.userMessage.edicalInsurance_card === parseInt(this.ruleForm.medicalInsuranceCard)) {
                  this.addOrder()
                } else {
                  this.$message({
                    type: 'info',
                    message: '医保卡输入错误'
                  })
                }
              } else {
                this.$message({
                  type: 'info',
                  message: '您还没有医保卡,请到医院绑定'
                })
              }
            } else {
              if (this.userMessage.medical_card) {
                if (this.userMessage.medical_card === parseInt(this.ruleForm.medicalCard)) {
                  this.addOrder()
                } else {
                  this.$message({
                    type: 'info',
                    message: '就诊卡输入错误'
                  })
                }
              } else {
                this.$message({
                  type: 'info',
                  message: '您还没有就诊卡,请到医院办理'
                })
              }
            }
          } else {
            this.$message({
              type: 'info',
              message: '请将信息填写完整再提交'
            })
          }
        })
      }
    },
    addOrder() {
      // 如果父亲传了时间过来那就是预约，号源要减一，否则是线上问诊，还有其他信息需要做
      if (this.date) {
        let date = new Date(this.date)
        let time = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${this.time}`).getTime()
        let userId = localStorage.getItem('userId')
        let params
        if (this.ruleForm.isMedicalInsuranceCard) {
          params = {
            userId,
            allergiHistory: this.ruleForm.allergiHistory,
            medicalInsuranceCard: parseInt(this.ruleForm.medicalInsuranceCard),
            detail: this.ruleForm.detail,
            time,
            doctorId: this.doctorMessage.id,
            doctorName: this.doctorMessage.name,
            part: this.doctorMessage.part,
            sex: this.ruleForm.sex ? '女' : '男'
          }
        } else {
          params = {
            userId,
            allergiHistory: this.ruleForm.allergiHistory,
            medicalCard: parseInt(this.ruleForm.medicalCard),
            detail: this.ruleForm.detail,
            time,
            doctorId: this.doctorMessage.id,
            doctorName: this.doctorMessage.name,
            part: this.doctorMessage.part,
            sex: this.ruleForm.sex ? '女' : '男'
          }
        }

        this.$axios.post('http://localhost:3000/api/Stu/addOrder', params).then(response => {
          if (response.status === 200) {
            this.$axios
              .post('http://localhost:3000/api/Stu/substrSignalSource', { signalSource: this.signalSource - 1, doctorId: this.doctorMessage.id, date: this.date })
              .then(res => {
                console.log(res, '减号源')
                if (typeof res.data === 'string') {
                  this.$message({
                    type: 'info',
                    message: res.data
                  })
                } else if (res.status === 200) {
                  this.$message({
                    message: '恭喜你,预约成功',
                    type: 'success'
                  })
                  // this.reload()
                }
              })
              .catch(err => console.log(err))
          }
        })
      } else {
        this.$emit('isOnlie', this.ruleForm)
      }
    }
  }
}
</script>
<style scoped>
/* .background-grey {
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background: grey;
  top: 0;
  opacity: 0.5;
} */
.model {
  z-index: 111;
  padding: 10px;
  position: absolute;
  background: white;
  top: 300px;
  left: 600px;
  width: 376px;
  margin-top: -200px;
}
.click-Time {
  color: aqua;
}
</style>
<style>
div .model .el-form-item__content {
  width: 200px;
}
div .model form.el-form.demo-ruleForm {
  margin-top: 0;
}
</style>
