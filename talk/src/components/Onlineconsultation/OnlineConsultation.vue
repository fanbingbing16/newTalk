<template>
  <div class="online">
    <div class="background-grey" v-if="showValidRz || showBaseMessage"></div>
    <Sfz v-if="showValidRz" @authentication="authentication" @cancle="cancle"></Sfz>
    <InputBaseMessage v-if="!showValidRz && showBaseMessage" @confirm="conform"></InputBaseMessage>
  </div>
</template>
<script>
import Sfz from '../Sfz'
import InputBaseMessage from './InputBaseMessage'
export default {
  components: {
    Sfz,
    InputBaseMessage
  },
  inject: ['reload'],
  created() {
    let authentication = localStorage.getItem('authentication')
    //验证是否认证身份证
    if (authentication) {
      this.showValidRz = true
    } else {
      this.alert()
    }
  },
  data() {
    return {
      showValidRz: false,
      showBaseMessage: false
    }
  },
  methods: {
    authentication(authentication) {
      this.showValidRz = false
      localStorage.removeItem('authentication')
      let userId = localStorage.getItem('userId')
      this.$axios.post('http://localhost:3000/api/Stu/addAuthentication', { sfz_number: authentication.id_number, real_name: authentication.name, userId: userId }).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.alert()
        }
      })
    },
    alert() {
      console.log(121)
      this.$alert('线上问诊因为是线上的原因医生无法准备判断，如果您的病情较为严重请到医院就诊', '提示', {
        confirmButtonText: '确定',
        callback: () => {
          this.$message({
            type: 'info',
            message: `确定信息`
          })
          this.showBaseMessage = true
        }
      })
    },
    cancle() {
      this.showValidRz = false
      this.$router.push({ path: 'mengzhengpaiban' })
      this.reload()
    },
    conform() {
      this.showBaseMessage = false
      this.$router.push({ path: '/talkdoctor' })
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
</style>
