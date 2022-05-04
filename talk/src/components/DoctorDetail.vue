<template>
  <div>
    <div class="bgc"></div>
    <div class="doctor-detail">
      <p class="title">专家介绍</p>
      <p class="name">{{ data.name }}&nbsp;{{ data.part }}&nbsp;{{ data.title }}</p>
      <div class="image"><img :src="image" alt="" /></div>
      <p class="content">{{ data.detail }}</p>
      <el-button type="primary" @click="$router.go(-1)">返回</el-button>
      <el-button type="success" @click="appointment">预约挂号</el-button>
      <div class="date">
        排班时间：<span v-for="time in date" :key="time">{{ time | formatDate }}&nbsp;</span>
        <span style="color: red; font-size: 15px">非急诊只能在8:30-18:30进行问诊</span>
      </div>
      <div class="background-grey" v-if="(showModel && this.date.length > 0) || showValidRz"></div>
      <Sfz v-if="showValidRz" @authentication="authentication" @cancle="showValidRz = false"></Sfz>
      <InputReservationInformation v-if="showInformation" @cancle="showInformation = false" :date="this.selectTime" :time="detailTime" :doctorMessage="data" :signalSource="selectSignalSource"></InputReservationInformation>
      <div class="model" v-if="showModel && this.date.length > 0">
        <p>请您选择一个时间</p>
        <span v-for="(dateOne, index) in date" :key="index" :class="{ 'click-Time': selectTime === dateOne }" @click="changeClick(dateOne, signalSource[index])">
          {{ new Date(dateOne).getMonth() + 1 }}-{{ new Date(dateOne).getDate() }} {{ dateOne | formatDate }} 号源{{ signalSource[index] }}&nbsp;
        </span>
        <br />
        <el-time-select
          :disabled="String(selectTime).length <= 0"
          v-model="detailTime"
          :picker-options="{
            start: getStartEndTime()[0],
            step: '00:15',
            end: getStartEndTime()[1]
          }"
          placeholder="选择时间"
        >
        </el-time-select>
        <br />
        <el-button style="margin-top: 10px" @click="cancleModel">取消</el-button>
        <el-button type="primary" @click="order">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Sfz from './Sfz'
import InputReservationInformation from './InputReservationInformation'
import { getTime } from './getTime.js'
import { getWeekDay } from './getWeekDay.js'

export default {
  components: {
    Sfz,
    InputReservationInformation
  },
  created() {
    let doctorId = localStorage.getItem('doctorId')
    let date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    const time = getWeekDay(date)
    const startTime = new Date().getTime()
    const endTime = new Date(`${time[0]} 23:59:59`).getTime()
    this.$axios
      .post('http://localhost:3000/api/Stu/associationQuery', { id: doctorId })
      .then(response => {
        // let arry = response.data[0].image.data
        if (response && response.status === 200) {
          this.image = this.image + response.data[0].image //转换字符串
          console.log(response, 'doctorDetail')
          this.data = response.data[0]
          this.date = response.data.filter(item => {
            if (item.signalSource > 0 && item.date >= startTime && item.date <= endTime) {
              this.signalSource.push(item.signalSource)
              return item.date
            }
          })
          this.date = this.date.map(item => item.date)
        } else {
          console.log(response, '错误')
        }
      })
      .catch(err => {
        console.log(err, '错误')
      })
  },
  data() {
    return {
      //医生的图片采用base64存储
      image: '',
      data: {},
      date: [],
      signalSource: [],
      showModel: false,
      selectTime: '',
      detailTime: '',
      //身份认证
      showValidRz: false,
      selectSignalSource: 0,
      //预约问诊要填写信息
      showInformation: false
    }
  },
  methods: {
    appointment() {
      let authentication = localStorage.getItem('authentication')
      //验证是否认证身份证
      if (authentication) {
        this.showValidRz = true
      } else {
        this.showModel = true
      }
    },
    getStartEndTime() {
      return [new Date(this.selectTime).getHours() >= 4 && new Date(this.selectTime).getHours() <= 12 ? '8:30' : '12:00', new Date(this.selectTime).getHours() >= 4 && new Date(this.selectTime).getHours() <= 12 ? '12:00' : '18:30']
    },
    changeClick(time, signalSource) {
      this.detailTime = ''
      this.selectTime = time
      this.selectSignalSource = signalSource
    },
    cancleModel() {
      this.showModel = false
    },
    order() {
      if (this.detailTime.length > 0) {
        this.showInformation = true
        this.showModel = false
      } else {
        alert('您必须选择一个时间进行预约')
      }
    },
    authentication(authentication) {
      this.showValidRz = false
      localStorage.removeItem('authentication')
      this.showModel = true
      let userId = localStorage.getItem('userId')
      this.$axios.post('http://localhost:3000/api/Stu/addAuthentication', { sfz_number: authentication.id_number, real_name: authentication.name, userId: userId }).then(res => {
        console.log(res, '成功')
      })
    }
  },
  filters: {
    formatDate(date) {
      // let time = new Date(date).getHours() >= 4 && new Date(date).getHours() <= 12 ? '上午' : '下午'
      // return '周' + '日一二三四五六'[new Date(date).getDay()] + time
      return getTime(date)
    }
  }
}
</script>
<style scoped>
.bgc {
  position: fixed;
  width: 70%;
  height: 70%;
  top: 26px;
  left: 162px;
  border: 1px solid #e1d8d8;
  box-shadow: 1px 1px 10px 2px #dadada;
  z-index: 1;
}
.doctor-detail {
  z-index: 2;
  position: relative;
}
img {
  max-width: 170px;
}
p.title {
  font-size: 66px;
  background: white;
  width: 283px;
}
p.content {
  width: 500px;
  margin-top: -100px;
  margin-left: 10px;
}
p.name {
  font-size: 30px;
}
.date {
  margin-top: 10px;
}
.date span {
  font-family: '微软雅黑';
  color: green;
  font-size: 18px;
}

.click-Time {
  color: aqua;
}
</style>
<style>
.doctor-detail .model {
  z-index: 111;
  padding: 30px;
  position: absolute;
  background: white;
  top: 240px;
  left: 46px;
}
.background-grey {
  left: 0;
  width: 100%;
  height: 100%;
  position: fixed !important;
  background: grey;
  top: 0;
  opacity: 0.5;
}
.image {
  width: 170px;
  height: 100px;
  overflow: hidden;
  margin-left: -176px;
}
</style>
