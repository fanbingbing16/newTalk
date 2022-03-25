<template>
  <qrcode-vue id="qrcodeBox" :size="qrcodeVue.size" :value="qrcodeVue.value" :logo="qrcodeVue.logo" :bgColor="qrcodeVue.bgColor" :fgColor="qrcodeVue.fgColor"></qrcode-vue>
</template>
<script>
import qrcodeVue from 'qrcode-vue'
export default {
  components: {
    qrcodeVue
  },

  data() {
    return {
      qrcodeVue: {
        size: 250,
        bgColor: '#fff',
        fgColor: '#000',
        value: 'http://192.168.31.42:8080/#/erweima', //二维码地址
        logo: require('@/assets/logo.jpg') //logo图片
      }
    }
  },
  methods: {
    //生成二维码
    getQRcode() {
      // this.qrcodeVue.value = 'www.baidu.com' // 二维码内容
    }
  }
}
</script>
<style scoped>
#qrcodeBox{
  z-index: 2;
}
</style>
