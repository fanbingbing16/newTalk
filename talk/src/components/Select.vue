<template>
  <div class="select">
    <div class="bgc"></div>
    <div class="doctor">欢迎您的到来</div>
    <div class="img" @mouseover="overImg" @mouseleave="leaveImg">
      <img src="../assets/doctor.jpg" alt="image" v-if="currentImg === 0" />
      <img src="../assets/doctor2.jpg" alt="image" v-if="currentImg === 1" />
      <img src="../assets/doctor3.jpg" alt="image" v-if="currentImg === 2" />
      <div class="block" v-if="enterImg">
        <div class="pre" @click="preImg">&lt;</div>
        <div class="next" @click="nextImg">&gt;</div>
      </div>
      <div class="bottom" v-if="enterImg">
        <div v-for="(item, i) in img" :key="item" :style="'left:' + (220 + i * 15) + 'px'" @click="goToImg(i)"></div>
      </div>
    </div>
    <div class="cancle">
      <el-button type="primary" @click="cancle">退出</el-button>
    </div>
    <div class="caid">
      <div @click="jumpPage('talk', 1)"><i class="iconfont icon-liaotian" style="font-size: 30px"></i>聊天室</div>
      <div @click="jumpPage('1/medicalKnowledge')"><i class="iconfont icon-jiankangchangshi" style="font-size: 30px"></i>医学常识</div>
      <div @click="jumpPage('onlineconsultation')"><i class="iconfont icon-shouye" style="font-size: 30px"></i>线上问诊</div>
      <div @click="jumpPage('charge')"><i class="iconfont icon-shoufeizhan" style="font-size: 30px"></i>收费站</div>
      <div @click="jumpPage('mengzhengpaiban')"><i class="iconfont icon-menzhenpaiban" style="font-size: 30px"></i>门诊排班</div>
      <div @click="jumpPage('mengzhengpaiban')"><i class="iconfont icon-yuyueguahaomianxing" style="font-size: 30px"></i>预约挂号</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      img: [0, 1, 2],
      currentImg: 0,
      time: null,
      enterImg: false
    }
  },
  created() {
    this.begin()
  },
  methods: {
    jumpPage(page, num) {
      if (num) {
        this.$router.push({ path: '/' + page + '/' + localStorage.getItem('userId') })
      } else {
        this.$router.push({ path: '/navigation/' + page })
        // localStorage.setItem('router', page)
      }
    },
    goToImg(number) {
      this.currentImg = number
    },
    preImg() {
      if (this.currentImg > this.img[0]) {
        this.currentImg--
      } else {
        this.currentImg = this.img.slice(-1)[0]
      }
    },
    nextImg() {
      if (this.currentImg < this.img.slice(-1)[0]) {
        this.currentImg++
      } else {
        this.currentImg = 0
      }
    },
    // 进入轮播图
    overImg() {
      clearInterval(this.time)
      this.time = null
      this.enterImg = true
    },
    // 离开轮播图
    leaveImg() {
      this.enterImg = false
      this.begin()
    },
    begin() {
      this.time = setInterval(() => {
        if (this.currentImg < this.img.slice(-1)[0]) {
          this.currentImg++
        } else {
          this.currentImg = 0
        }
      }, 2000)
    },
    cancle() {
      this.$confirm('您确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('userId')
          localStorage.removeItem('doctorId')
          localStorage.removeItem('authentication')
          localStorage.removeItem('isDoctor')
          localStorage.removeItem('prescriptionNumber')
          this.$router.push({ path: '/login' })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
</script>
<style scoped>
.select {
  z-index: 2;
}
.select .doctor {
  margin-top: 100px;
  font-size: 32px;
  /* color: white; */
}
.img {
  position: relative;
  /* height: 334px; */
  /* width: 500px; */
  height: 600px;
  width: 1200px;
  overflow: hidden;
}
.img img {
  width: 100%;
}
.img .pre {
  top: 0;
  width: 27px;
  background: white;
  height: 600px;
  opacity: 0.5;
  line-height: 600px;
  position: absolute;
  cursor: context-menu;
  user-select: none;
}
.img .next {
  top: 0;
  width: 27px;
  right: 0;
  background: white;
  height: 600px;
  opacity: 0.5;
  line-height: 600px;
  position: absolute;
  cursor: context-menu;
  user-select: none;
}
.bottom div {
  width: 10px;
  border-radius: 100%;
  height: 10px;
  position: absolute;
  background: white;
  bottom: 6px;
  /* margin: auto; */
  /* left: 303px; */
}
.caid {
  position: fixed;
  top: 489px;
  right: 200px;
  /* display: flex; */
  margin-left: 530px;
  margin-top: -273px;
  flex-wrap: wrap;
  width: 210px;
  /* z-index: 999; */
  background: #fff;
  width: 90px;
  box-shadow: -2px 2px 10px 1px #d9d9d9;
}
.caid div {
  height: 60px;
  display: flex;
  margin: auto;
  line-height: 32px;
  width: 70px;
  flex-direction: column;
  margin-top: 10px;
  cursor: context-menu;
  user-select: none;
}
.caid div:hover {
  background: white;
}
.cancle {
  position: absolute;
  top: 10px;
  right: 100px;
}
</style>
