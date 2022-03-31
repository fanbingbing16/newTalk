<template>
  <div class="chat-box">
    <div class="msg-box" ref="msg-box">
      <div v-for="(i, index) in list" :key="index" class="msg" :style="i.talkFrom == userId ? 'flex-direction:row-reverse' : ''">
        <div class="user-head">
          <div
            class="head"
            :style="` background: hsl(${getUserHead(i.userId, 'bck')}, 88%, 62%); clip-path:polygon(${getUserHead('polygon')}% 0,100% 100%,0% 100%); transform: rotate(${getUserHead(i.userId, 'rotate')}deg);border-radius: ${getUserHead(i.userId, 'boderRadius')[0]}% ${
              getUserHead(i.userId, 'boderRadius')[0]
            }% ${getUserHead(i.userId, 'boderRadius')[1]}% ${getUserHead(i.userId, 'boderRadius')[1]}%;`"
            v-if="i.talkFrom !== i.doctorId"
          ></div>
          <img :src="i.image" alt="" v-else style="max-width: 80%" />
          <span v-if="i.talkFrom !== userId" :class="'leftSpan'">{{ i.talkFrom === i.doctorId ? i.doctorName : i.userName }}</span>
        </div>
        <div class="user-msg">
          <!-- :style="i.userId == userId ? ' float: right;' : ''" -->
          <span :class="i.talkFrom == userId ? 'right' : 'left'">{{ i.text }}</span>
        </div>
      </div>
    </div>
    <div class="input-box">
      <input type="text" ref="sendMsg" v-model="contentText" @keyup.enter="sendText()" />
      <div class="btn" :class="{ ['btn-active']: contentText }" @click="sendText()">发送</div>
    </div>
  </div>
</template>

<script>
import { getUserHead } from '../getUserHead'
export default {
  data() {
    return {
      //这里的user不一定指的就是病人，也可能是医生，是当前用户的意思
      ws: null,
      userId: null, //当前用户ID
      userName: '',
      list: [], //聊天记录的数组
      contentText: '', //input输入的值
      talk: [],
      isDoctor: '',
      doctorImage: '',
      doctorName: '',
      patientName: '',
      doctorMessage: [],
      anotherUsers: '',
      anotherUserName: '',
      endTime: 0
    }
  },
  created() {
    this.getUserID()
    this.isDoctor = localStorage.getItem('isDoctor')
    this.$axios.get('http://localhost:3000/api/Stu/showAllDoctor').then(response => {
      if (response.status === 200) {
        this.doctorMessage = response.data
        this.doctorMessage.map(item => {
          if ((this.isDoctor === 'true' && item.id === this.userId) || (this.isDoctor !== 'true' && item.id === this.anotherUsers)) {
            this.doctorImage = item.image
            this.doctorName = item.name
          }
        })
      }
    })
    let patientId = ''
    patientId = this.isDoctor === 'true' ? this.anotherUsers : this.userId
    this.$axios.post('http://localhost:3000/api/Stu/showOfId', { userId: patientId }).then(response => {
      if (response.status === 200) {
        this.patientName = response.data[0].userName
      }
    })
  },
  mounted() {
    this.initWebSocket()
  },
  methods: {
    //根据url(用户名)作为当前用户ID
    getUserID() {
      // let time = new Date().getTime();
      this.userId = localStorage.getItem('userId')
      this.anotherUsers = location.hash.split('/').slice(-1)[0]
    },
    //滚动条到底部
    scrollBottm() {
      let el = this.$refs['msg-box']
      el.scrollTop = el.scrollHeight
    },
    //发送聊天信息
    sendText() {
      let _this = this
      _this.$refs['sendMsg'].focus()
      if (!_this.contentText) {
        return
      }
      let params = {
        userId: _this.isDoctor === 'true' ? _this.anotherUsers : _this.userId,
        time: new Date().getTime(),
        doctorId: _this.isDoctor === 'true' ? _this.userId : _this.anotherUsers,
        doctorName: _this.doctorName,
        isDoctor: _this.isDoctor,
        image: _this.doctorImage,
        talkTo: _this.anotherUsers,
        talkFrom: _this.userId,
        userName: _this.patientName,
        text: this.contentText,
        endTime: this.endTime
      }
      _this.ws.send(JSON.stringify(params)) //调用WebSocket send()发送信息的方法
      _this.contentText = ''
      setTimeout(() => {
        _this.scrollBottm()
      }, 500)
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
                endTime: resData.endTime
              }
            ]
          }
          let doctorId
          let patientId
          if (_this.isDoctor === 'true') {
            doctorId = _this.userId
            patientId = location.hash.split('/').slice(-1)[0]
          } else {
            doctorId = location.hash.split('/').slice(-1)[0]
            patientId = _this.userId
          }
          //只筛选出当前用户和其另外一个人聊天的记录
          _this.list = _this.list.filter(item => {
            return (item.talkTo === doctorId && item.talkFrom === patientId) || (item.talkFrom === doctorId && item.talkTo === patientId)
          })
          _this.list = _this.list.sort((a, b) => a.time - b.time)
        }
      }
    }
  }
}
</script>

<style scoped>
.chat-box header {
  position: fixed;
  width: 100%;
  height: 3rem;
  background: #409eff;
  max-width: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: white;
  font-size: 1rem;
}
.chat-box .msg-box {
  position: absolute;
  height: calc(100% - 7.5rem);
  width: 100%;
  margin-top: 4rem;
  overflow-y: scroll;
}
.user-head {
  min-width: 2.5rem;
  width: 20%;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;

  /* // position: absolute; */
}
.head {
  width: 1.2rem;
  height: 1.2rem;
}
.msg {
  width: 95%;
  min-height: 2.5rem;
  margin: 1rem 0.5rem;
  position: relative;
  display: flex;
  justify-content: flex-start !important;
}
.user-msg span {
  display: inline-block;
  padding: 0.5rem 0.7rem;
  border-radius: 0.5rem;
  margin-top: 0.2rem;
  font-size: 0.88rem;
}
.rightSpan[data-v-469af010] {
  width: 1%;
  font-size: 10px;
  /* margin-right: 50px; */
  right: 60px;
  position: absolute;
}
.leftSpan {
  width: 6%;
  font-size: 10px;
  /* margin-left: 20px; */
  position: absolute;
  left: 46px;
}

.left {
  background: white;
  animation: toLeft 0.5s ease both 1;
}
.right {
  background: #53a8ff;
  color: white;
  animation: toright 0.5s ease both 1;
}
@keyframes toLeft {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
@keyframes toright {
  0% {
    opacity: 0;
    transform: translateX(10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
.user-msg {
  width: 80%;
  /* // position: absolute; */
  word-break: break-all;
  position: relative;
  z-index: 5;
}
.chat-box {
  margin: 0 auto;
  background: #fafafa;
  position: absolute;
  height: 100%;
  width: 100%;
  max-width: 700px;
  margin-left: -301px;
}
.input-box input {
  height: 2.3rem;
  display: inline-block;
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 0.2rem;
  font-size: 0.88rem;
  outline: none;
}
.input-box {
  /* padding: 0 0.5rem; */
  width: 45.4%;
  position: absolute;
  bottom: 0;
  height: 3.5rem;
  background: #fafafa;
  box-shadow: 0 0 5px #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
}
.btn {
  height: 2.3rem;
  min-width: 4rem;
  background: #e0e0e0;
  padding: 0.5rem;
  font-size: 0.88rem;
  color: white;
  text-align: center;
  border-radius: 0.2rem;
  margin-left: 0.5rem;
  transition: 0.5s;
  line-height: 2.3rem;
}
.btn-active {
  background: #409eff;
}
.welcome {
  background-color: #fff;
  position: fixed;
  right: 100px;
  top: 10%;
  padding: 10px 10px;
}
.input-box input:active {
  border: 1px solid #66b1ff;
}
</style>
<style>
.searchInput input {
  width: auto;
}
.table {
  max-width: 32%;
  position: fixed;
  right: 10px;
  width: 32%;
  top: 25%;
}

.demo-input-suffix {
  display: flex;
  margin-left: -28px;
  margin-bottom: 10px;
}
button.el-button.search.el-button--primary {
  margin-left: 25%;
  margin-top: 10px;
}
.el-input--prefix .el-input__inner {
  width: 200px;
  margin-top: 10px;
}
</style>
