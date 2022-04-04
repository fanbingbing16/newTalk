<template>
  <div class="online">
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="endOnline">
      <span>您还有一段尚未结束的线上问诊记录，是否继续？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endOnline">新的问诊</el-button>
        <el-button type="primary" @click="$router.push({ path: '/talkdoctor/' + onlineRecord[0].doctorId })">继续</el-button>
      </span>
    </el-dialog>
    <div class="user" v-if="isDoctor !== 'true' && onlineRecord.length === 0 && !showMoney">
      <div class="background-grey"></div>
      <Sfz v-if="showValidRz" @authentication="authentication" @cancle="cancle"></Sfz>
      <InputBaseMessage v-if="!showValidRz && showBaseMessage" @confirm="conform"></InputBaseMessage>
      <div class="selectDoctor" v-if="!showValidRz && !showBaseMessage">
        <p style="font-size: 20px">请选择一位医生</p>
        <div class="card" v-for="item in doctorMessage" :key="item.id" @click="selectDoctor(item)">
          <div class="image" style="">
            <img :src="item.image" alt="" />
          </div>
          <p>预约费用:{{ item.yuyueMoney }}</p>
          <p>医生姓名:{{ item.name }}</p>
          <p>医生性别:{{ item.sex }}</p>
          <p>医生职称:{{ item.title }}</p>
          <p>所属科室:{{ item.part }}</p>
          <p>简要描述:{{ item.detail }}</p>
        </div>
      </div>
    </div>
    <div class="money" v-else-if="isDoctor !== 'true' && onlineRecord.length === 0 && showMoney">
      <img src="../../assets/wechat.jpg" alt="" style="width: 40%" />
    </div>
    <talk-user v-else-if="isDoctor === 'true'"></talk-user>
  </div>
</template>
<script>
import Sfz from '../Sfz'
import InputBaseMessage from './InputBaseMessage'
import TalkUser from './TalkUser.vue'
export default {
  components: {
    Sfz,
    InputBaseMessage,
    TalkUser
  },
  inject: ['reload'],
  created() {
    let authentication = localStorage.getItem('authentication')
    this.userId = localStorage.getItem('userId')
    //验证是否认证身份证
    if (authentication) {
      this.showValidRz = true
    } else {
      this.alert()
    }
    this.$axios.get('http://localhost:3000/api/Stu/showAllDoctor').then(response => {
      if (response.status === 200) {
        this.doctorMessage = response.data
      }
    })
    this.$axios.post('http://localhost:3000/api/Stu/searchPatientTalk', { userId: this.userId }).then(response => {
      if (response.status === 200) {
        this.onlineRecord = response.data
        if (response.data.length > 0) {
          this.dialogVisible = true
        }
      }
    })
  },
  data() {
    return {
      selectDoctorMessage: {},
      showMoney: false,
      showValidRz: false,
      showBaseMessage: false,
      doctorMessage: [],
      isDoctor: localStorage.getItem('isDoctor'),
      onlineRecord: [],
      userId: '',
      dialogVisible: false
    }
  },
  methods: {
    endOnline() {
      this.$axios.post('http://localhost:3000/api/Stu/endTalk', { userId: this.userId, endOf: 'patient', isPrescription: '0' })
    },
    authentication(authentication) {
      this.showValidRz = false
      localStorage.removeItem('authentication')
      let userId = localStorage.getItem('userId')
      this.$axios.post('http://localhost:3000/api/Stu/addAuthentication', { sfz_number: authentication.id_number, real_name: authentication.name, userId: userId }).then(res => {
        if (res.status === 200) {
          this.alert()
        }
      })
    },
    alert() {
      // alert('线上问诊因为是线上的原因医生无法准备判断，如果您的病情较为严重请到医院就诊')
      this.showBaseMessage = true
    },
    cancle() {
      this.showValidRz = false
      this.$router.push({ path: 'mengzhengpaiban' })
      this.reload()
    },
    conform() {
      this.showBaseMessage = false
      // this.$router.push({ path: '/talkdoctor' })
    },
    selectDoctor(doctor) {
      this.showMoney = true
      this.selectDoctorMessage = doctor
      // this.$router.push({ name: 'ChargeMoney', path: '/chargeMoney/' + doctor.id, params: doctor })
      // this.$router.push({ path: '/talkdoctor/' + doctor.id })
    }
  }
}
</script>
<style scoped>
.online {
  z-index: 2;
  margin-top: 450px;
  margin-left: -250px;
}
img {
  max-width: 170px;
}
.selectDoctor {
  background: white;
  width: 50%;
  margin-top: -440px;
  margin-left: -140px;
  position: absolute;
  height: 86%;
  overflow-y: scroll;
}
.image[data-v-2b28aca2] {
  margin-left: 0;
  position: absolute;
  left: 100px;
  border: 1px solid #ebe7e7;
}
.card {
  width: 90%;
  margin: auto;
  padding-top: 10px;
  border: 1px solid #ece0e0;
}
.card:hover {
  background: rgb(230 230 230);
}
</style>
<style>
.v-modal {
  opacity: 0;
}
</style>
