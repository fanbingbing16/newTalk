<template>
  <div>
    <div>
      <template v-for="(item, index) in dataMessage">
        <div class="card" :key="item.id" v-if="item.wellPayment > 0">
          <p>未缴费用:{{ parseInt(item.wellPayment) }}</p>
          <p>交易时间:{{ item.date | formatDate }}</p>
          <p>主治医生:{{ doctorName[index] }}</p>
          <el-button @click="goToMoney(item)">去缴清</el-button>
        </div>
      </template>
      <div class="none" v-if="!haveWellPayment">暂无数据</div>
    </div>
  </div>
</template>
<script>
import { getDetailTime } from './getTime.js'
export default {
  created() {
    let userId = localStorage.getItem('userId')
    this.$axios.post('http://localhost:3000/api/Stu/searchMedicalMessage', { userId }).then(response => {
      this.dataMessage = response.data
      this.haveWellPayment = this.dataMessage.some(item => item.wellPayment > 0)
      this.dataMessage.map(item => {
        this.$axios.post('http://localhost:3000/api/Stu/searchDoctorOfId', { id: item.doctorId }).then(res => {
          if (res.status === 200) {
            this.doctorName.push(res.data[0].name)
          }
        })
      })
    })
  },
  data() {
    return {
      dataMessage: [],
      haveWellPayment: true,
      doctorName: []
    }
  },
  methods: {
    goToMoney(message) {
      this.$router.push({ path: '/chargeMoney/' + message.patientId, name: 'ChargeMoney', params: message })
    }
  },
  filters: {
    formatDate(date) {
      return getDetailTime(date)
    }
  }
}
</script>
<style scoped>
.card {
  width: 300px;
  background: white;
  padding: 10px;
  margin-top: 10px;
}
.none {
  font-size: 100px;
  margin-top: 100px;
}
</style>
