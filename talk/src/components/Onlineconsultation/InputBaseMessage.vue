<template>
  <div class="baseMessage">
    <input-reservation-information v-if="showReservation" @isOnlie="confirmReservation" @cancle="$router.push({ path: 'mengzhengpaiban' })"></input-reservation-information>
    <div v-else class="baseMessageDiv">
      <p>请您先输入您的基本信息！</p>
      <el-form ref="Form" :rules="rules" status-icon :model="edit" label-width="100px">
        <el-form-item label="身份证号码" prop="id_number">
          <el-input v-model="edit.id_number" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="edit.name" :disabled="true">></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="edit.sex">
            <el-radio label="女"></el-radio>
            <el-radio label="男"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="edit.age" :min="1" :max="130"></el-input-number>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="edit.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edit.email"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址" prop="address">
          <el-input v-model="edit.address"></el-input>
        </el-form-item>
        <el-form-item label="患处照片（如果有，请上传）" prop="infectedPart ">
          <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1" :on-change="changeInfected">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions"> </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否看过医生" prop="haveDcotor">
          <el-switch v-model="edit.haveDcotor"></el-switch>
        </el-form-item>
        <el-form-item label="医生的诊断书" prop="diagnosis" v-if="edit.haveDcotor">
          <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1" :on-change="changeImage">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions"> </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否在吃药" prop="haveDrug">
          <el-switch v-model="edit.haveDrug"></el-switch>
        </el-form-item>
        <el-form-item label="吃的什么药" prop="someDrug" v-if="edit.haveDrug">
          <el-input v-model="edit.someDrug"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="reBack">返回</el-button>
          <el-button type="primary" @click="submitForm('Form')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import InputReservationInformation from '../InputReservationInformation.vue'
import { isEmail, isPhone } from '../validateSfz'
export default {
  components: { InputReservationInformation },
  created() {
    const userId = localStorage.getItem('userId')
    this.$axios.post('http://localhost:3000/api/Stu/showOfId', { userId }).then(response => {
      if (response.status === 200) {
        this.edit.id_number = response.data[0].sfz_number
        this.edit.id_number = String(this.edit.id_number)
          .split('')
          .map((item, index) => {
            if (index > 0 && index <= 10) {
              item = 'x'
            }
            return item
          })
          .join('')
        this.edit.name = response.data[0].real_name
      }
    })
  },
  data() {
    return {
      reservationInformation: {},
      edit: {
        id_number: '',
        name: '',
        sex: '男',
        age: '',
        phone: '',
        email: '',
        address: '',
        haveDoctor: false,
        diagnosis: '',
        haveDrug: false,
        someDrug: ''
      },
      rules: {
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        email: [{ validator: isEmail, required: true, message: '请输入正确的邮箱', trigger: 'blur' }],
        phone: [{ validator: isPhone, required: true, message: '请输入正确的手机号码', trigger: 'blur' }]
      },
      dialogVisible: false,
      disabled: false,
      text: '',
      showReservation: true,
      fileList: '',
      infectedImage: ''
    }
  },
  methods: {
    changeInfected(file) {
      //将blob图片转成base64的格式，存储到数据库就以字符串的形式
      let that = this
      this.blobToDataURI(file.raw, function (data) {
        that.infectedImage = data
      })
    },
    changeImage(file) {
      //将blob图片转成base64的格式，存储到数据库就以字符串的形式
      let that = this
      this.blobToDataURI(file.raw, function (data) {
        that.fileList = data
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
          this.$message({
            message: '填写成功！',
            type: 'success'
          })
          let userId = localStorage.getItem('userId')
          let prescriptionNumber = Date.now() * 2 - Math.floor(Math.random() * 100)
          this.$emit('confirm', prescriptionNumber)
          this.$axios.post('http://localhost:3000/api/Stu/addOnlineMessage', {
            userId,
            userName: this.edit.name,
            sex: this.edit.sex === '男' ? '0' : '1',
            age: this.edit.age,
            email: this.edit.email,
            phone: this.edit.phone,
            address: this.edit.address,
            dignosis: this.fileList,
            drug: this.edit.someDrug,
            infectedImage: this.infectedImage,
            allergiHistory: this.reservationInformation.allergiHistory,
            medicalInsuranceCard: parseInt(this.reservationInformation.medicalInsuranceCard),
            medicalCard: parseInt(this.reservationInformation.medicalCard),
            detail: this.reservationInformation.detail,
            fever: this.reservationInformation.fever ? '0' : '1',
            prescriptionNumber
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    confirmReservation(reservation) {
      this.showReservation = false
      this.reservationInformation = reservation
    },
    reBack() {
      this.$router.push('mengzhengpaiban')
    }
  }
}
</script>
<style scoped>
.baseMessageDiv {
  background: white;
  width: 513px;
  padding-right: 30px;
  margin-top: -414px;
  padding-top: 4px;
  overflow-y: scroll;
  height: 684px;
  margin-left: 20px;
  padding-left: 10px;
  position: absolute;
}
</style>
