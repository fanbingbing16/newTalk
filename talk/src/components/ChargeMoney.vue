<template>
  <div style="z-index: 2; margin-top: 10px">
    <img src="../assets/wechat.jpg" alt="" style="width: 40%" />
    <p>支付剩余时间{{ time }}秒 <span style="color: blue" @click="back">返回</span></p>
  </div>
</template>
<script>
export default {
  created() {
    console.log(this.$route.params, 'query', this.$router, this.$route)
    this.inter = setInterval(() => {
      if (this.time > 0) {
        this.time--
      } else {
        this.back()
      }
    }, 1000)
    let params = this.$route.params
    this.$axios.post('http://localhost:3000/api/Stu/updateMedicalMessage', { totalPay: parseInt(params.totalPay) + parseInt(params.wellPayment), wellPayyment: 0, prescriptionNumber: params.prescriptionNumber })
  },
  data() {
    return {
      time: 30,
      inter: null
    }
  },
  methods: {
    back() {
      clearInterval(this.inter)
      this.inter = null
      this.$router.go(-1)
      // this.$router.push({ path: '/navigation/charge' })
    }
  }
}
</script>
