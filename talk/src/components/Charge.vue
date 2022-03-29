<template>
  <div>
    <div>
      <template v-for="item in data">
        <div class="card" :key="item.id" v-if="item.wellPayment > 0">
          <p>未缴费用:{{ parseInt(item.wellPayment) }}</p>
          <p>交易时间:{{ item.time | formatDate }}</p>
          <p>主治医生:{{ item.doctorName }}</p>
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
      this.data = response.data
      this.haveWellPayment = this.data.some(item => item.wellPayment > 0)
    })
  },
  data() {
    return {
      data: [],
      haveWellPayment: true
    }
  },
  methods: {
    goToMoney(message) {
      this.$router.push({ path: '/chargeMoney/' + message.userId, name: 'ChargeMoney', params: message })
    }
  },
  filters: {
    formatDate(date) {
      return getDetailTime(date)
    }
  },
  watch: {
    $router(to, from) {
      console.log(to, from)
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
