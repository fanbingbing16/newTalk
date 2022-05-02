<template>
  <div class="talk-user">
    <div class="online">
      <p v-if="talk.length > 0">线上问诊</p>
      <p v-else>赞无未结束的线上问诊记录</p>
      <div class="card" v-for="(item, index) in talk" :key="index" @click="gotoTalk(item)">
        <div class="user-head">
          <div
            class="head"
            :style="` background: hsl(${getUserHead(item.userId, 'bck')}, 88%, 62%); clip-path:polygon(${getUserHead('polygon')}% 0,100% 100%,0% 100%); transform: rotate(${getUserHead(item.userId, 'rotate')}deg);border-radius: ${getUserHead(item.userId, 'boderRadius')[0]}% ${
              getUserHead(item.userId, 'boderRadius')[0]
            }% ${getUserHead(item.userId, 'boderRadius')[1]}% ${getUserHead(item.userId, 'boderRadius')[1]}%;`"
          ></div>
          <span v-if="item.userId !== userId" :class="'leftSpan'">{{ item.userName }}</span>
        </div>
        <p>{{ item.lastTime | fromDate }}</p>
        <p style="top: 10px; font-size: 26px; color: #d0d0d0">{{ item.lastText }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { getDetailTime } from '../getTime'
import { getUserHead } from '../getUserHead'
export default {
  mounted() {
    this.initWebSocket()
  },
  data() {
    return {
      list: [],
      talk: [],
      userId: '',
      historyTalk: []
    }
  },
  created() {
    this.userId = localStorage.getItem('userId')
  },
  filters: {
    fromDate(date) {
      return getDetailTime(date)
    }
  },
  methods: {
    gotoTalk(data) {
      localStorage.setItem('prescriptionNumber', data.prescriptionNumber)
      this.$router.push({ path: '/talkDoctor/' + data.userId })
    },
    getUserHead(id, type) {
      return getUserHead(id, type)
    },
    //进入页面创建websocket连接
    initWebSocket() {
      let _this = this
      //判断页面有没有存在websocket连接
      if (window.WebSocket) {
        //是我本地IP地址 此处的端口号 要与后端配置的一致
        let ws = new WebSocket(`ws://${location.hostname}:8188`)
        _this.ws = ws
        // ws.onopen = function () {
        //   console.log("服务器连接成功");
        // };
        // ws.onclose = function () {
        //   console.log("服务器连接关闭");
        // };
        //通信发生错误
        ws.onerror = function () {
          alert('您的网络连接不上')
        }
        ws.onmessage = function (e) {
          //接收服务器返回的数据
          let resData = JSON.parse(e.data)
          if (resData.funName == 'userCount') {
            _this.list = resData.chat
          } else {
            _this.list = [
              ..._this.list,
              {
                userId: resData.userId,
                time: resData.time,
                doctorId: resData.doctorId,
                doctorName: resData.doctorName,
                isDoctor: resData.isDoctor,
                image: resData.image,
                talkTo: resData.talkTo,
                talkFrom: resData.talkFrom,
                userName: resData.userName,
                text: resData.text,
                endTime: resData.endTime,
                prescriptionNumber: resData.prescriptionNumber
              }
            ]
          }
          //只筛选出当前用户参与过的聊天 from表示发送消息的人，to表示接受消息的人
          _this.list = _this.list.filter(item => {
            return item.doctorId === _this.userId
          })
          _this.list.map(item => {
            let index = _this.talk.findIndex(element => {
              return (element.userName === item.talkTo && item.talkFrom === element.doctorName) || (element.doctorName === item.talkTo && item.talkFrom === element.userName)
            })
            if (index > -1) {
              _this.talk[index].info.push(item.text)
              _this.talk[index].talkTo.push(item.talkTo)
              _this.talk[index].talkFrom.push(item.talkFrom)
              _this.talk[index].time.push(item.time)
              _this.talk[index].endTime = item.endTime ? item.endTime : null
            } else {
              _this.talk.push({
                talkTo: [item.talkTo],
                talkFrom: [item.talkFrom],
                info: [item.text],
                time: [item.time],
                endTime: item.endTime ? item.endTime : null,
                userId: item.userId,
                doctorId: item.doctorId,
                userName: item.userName,
                doctorName: item.doctorName,
                prescriptionNumber: item.prescriptionNumber
              })
            }
          })
          _this.talk.map(item => {
            let max = 0
            let index = -1
            item.time.map((element, i) => {
              if (element >= max) {
                max = element
                index = i
              }
            })
            item.lastTime = item.time[index]
            item.lastText = item.info[index]
          })
        }
      }
    }
  }
}
</script>
<style scoped>
.card {
  background: white;
  width: 500px;
  height: 50px;
  margin-top: 10px;
  position: relative;
  padding: 10px;
}
.card:hover {
  background: #eaeaea;
}
.talk-user {
  margin-top: -400px;
}
.leftSpan {
  width: 6%;
  font-size: 18px;
  position: absolute;
  left: 62px;
  top: 10px;
}
.user-head {
  min-width: 46px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.card p {
  position: absolute;
  left: 100px;
  top: -5px;
}
.head {
  width: 1.2rem;
  height: 1.2rem;
}
</style>
