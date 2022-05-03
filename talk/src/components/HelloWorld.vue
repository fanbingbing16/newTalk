<template>
  <div class="chat-box">
    <div class="welcome">
      <p>欢迎您进入聊天室，您可以在这里畅所欲言</p>
      <el-button type="primary" icon="el-icon-back" circle @click="quitLogin()"></el-button>
      <el-button type="primary" @click="seeHistory(true)" v-if="!isHistory">查看历史聊天记录</el-button>
      <el-button type="primary" @click="seeHistory(false)" v-if="isHistory">隐藏历史聊天记录</el-button>
    </div>
    <header>聊天室 目前聊天人数{{ count }}</header>
    <div class="msg-box" ref="msg-box">
      <div v-for="(i, index) in list" :key="index" class="msg" :style="i.userId == userId ? 'flex-direction:row-reverse' : ''">
        <div class="user-head">
          <div
            class="head"
            :style="` background: hsl(${getUserHead(i.userId, 'bck')}, 88%, 62%); clip-path:polygon(${getUserHead('polygon')}% 0,100% 100%,0% 100%); transform: rotate(${getUserHead(i.userId, 'rotate')}deg);border-radius: ${getUserHead(i.userId, 'boderRadius')[0]}% ${
              getUserHead(i.userId, 'boderRadius')[0]
            }% ${getUserHead(i.userId, 'boderRadius')[1]}% ${getUserHead(i.userId, 'boderRadius')[1]}%;`"
            v-if="i.isDoctor !== 'true'"
          ></div>
          <img :src="i.image" alt="" v-else style="max-width: 80%" />
          <span v-if="i.userId !== userId" :class="'leftSpan'">{{ i.isDoctor === 'true' ? i.userName : i.userId }}</span>
        </div>
        <div class="user-msg">
          <!-- :style="i.userId == userId ? ' float: right;' : ''" -->
          <span :class="i.userId == userId ? 'right' : 'left'">{{ i.content }}</span>
        </div>
      </div>
    </div>
    <div class="input-box">
      <input type="text" ref="sendMsg" v-model="contentText" @keyup.enter="sendText()" />
      <div class="btn" :class="{ ['btn-active']: contentText }" @click="sendText()">发送</div>
    </div>
    <div class="table" v-if="isHistory">
      <div class="demo-input-suffix searchInput">
        <div class="block">
          <el-date-picker v-model="date" type="date" placeholder="选择日期"> </el-date-picker>
        </div>
        <el-input placeholder="请输入用户名" prefix-icon="el-icon-search" v-model="searchText" maxlength="10" minlength="3" style="width: 20%"> </el-input>
        <el-button type="primary" class="search" @click="search">搜索</el-button>
      </div>
      <el-table ref="singleTable" :data="curentHistory" style="width: 100%">
        <el-table-column property="userId" label="用户名" width="120"> </el-table-column>
        <el-table-column property="talk" label="内容" width="150"> </el-table-column>
        <el-table-column property="date" label="日期" width="150"> </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination layout="prev, pager, next" :current-page="page" :total="history.length" background :page-sizes="[100, 200, 300, 400]" :page-size="pageSize" @current-change="pageChange"> </el-pagination>
        <span v-if="isSearch" style="color: red">仅仅展示搜索到的{{ pageSize }}条信息 </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserHead } from './getUserHead'
export default {
  data() {
    return {
      ws: null,
      count: 0, //记录聊天人数
      connectCount: 0, //记录在线人数
      userId: null, //当前用户ID
      list: [], //聊天记录的数组
      contentText: '', //input输入的值
      isHistory: false, //是否打开历史记录
      history: [], //存放所有的历史聊天记录
      curentHistory: [], //当前页数的历史聊天记录
      pageSize: 5, //每页的数据
      date: '',
      page: 0,
      searchText: '',
      isSearch: false,
      isDoctor: localStorage.getItem('isDoctor'),
      doctorMessage: [],
      currentImage: '',
      currentName: ''
    }
  },
  created() {
    this.getUserID()
    this.$axios.get('http://localhost:3000/api/Stu/showAllDoctor').then(response => {
      if (response.status === 200) {
        this.doctorMessage = response.data
        this.doctorMessage.map(item => {
          if (item.id === this.userId) {
            this.currentImage = item.image
            this.currentName = item.name
          }
        })
      }
    })
  },
  mounted() {
    this.initWebSocket()
    this.scrollBottm()
  },
  methods: {
    //搜索历史记录
    search() {
      this.isSearch = true
      let temp = this.curentHistory
      this.curentHistory = []
      this.history.map(item => {
        if (this.searchText && this.date) {
          if (item.date.split(' ')[0] === `${this.date.getFullYear()}-${this.date.getMonth() + 1 >= 10 ? this.date.getMonth() + 1 : '0' + (this.date.getMonth() + 1)}-${this.date.getDate() >= 10 ? this.date.getDate() : '0' + this.date.getDate()}` && item.userId === this.searchText) {
            this.curentHistory.push(item)
          }
        } else if (this.searchText) {
          if (item.userId === this.searchText) {
            this.curentHistory.push(item)
          }
        } else if (this.date) {
          if (item.date.split(' ')[0] === `${this.date.getFullYear()}-${this.date.getMonth() + 1 >= 10 ? this.date.getMonth() + 1 : '0' + (this.date.getMonth() + 1)}-${this.date.getDate() >= 10 ? this.date.getDate() : '0' + this.date.getDate()}`) {
            this.curentHistory.push(item)
          }
        } else {
          this.curentHistory = temp
        }
      })
      if (this.curentHistory.length > this.pageSize) {
        this.curentHistory = this.curentHistory.slice(0, this.pageSize)
      }
    },
    //页码改变触发，val是对应的页码
    pageChange(val) {
      this.date = ''
      this.searchText = ''
      this.isSearch = false
      this.curentHistory = this.history.slice(this.pageSize * (val - 1), this.pageSize + this.pageSize * (val - 1))
    },
    //退出登录
    quitLogin() {
      this.$confirm('您确定要退出聊天室吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '点错了'
      })
        .then(() => {
          this.$message({
            type: 'info',
            message: '您已退出聊天室'
          })
          // localStorage.removeItem("userId"); //退出登录，将localStorage的信息清除。没有登录无法再次进入
          // this.$router.push({ path: "/login" });
          // this.$router.push({ path: '/navigation/welcome' })
          this.$router.go(-1)
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: action === 'cancel' ? '停留在该页面' : '您已取消'
          })
        })
    },
    beforeRouteEnter(to, from, next) {
      console.log(to, from, next, 123)
    },
    //根据url(用户名)作为当前用户ID
    getUserID() {
      // let time = new Date().getTime();
      this.userId = window.location.hash.split('/').slice(-1)[0]
    },
    //查看历史聊天记录
    seeHistory(boo) {
      this.isHistory = boo
    },
    //根据userID生成一个随机头像
    getUserHead(id, type) {
      //将获取用户头像的方法移到外部的js文件，这样的话多个组件之间就可以互相使用
      return getUserHead(id, type)
    },
    //滚动条到底部
    scrollBottm() {
      let el = this.$refs['msg-box']
      el.scrollTop = el.scrollHeight
    },
    //发送聊天信息
    sendText() {
      let _this = this
      //将焦点集中在这里
      _this.$refs['sendMsg'].focus()
      if (!_this.contentText) {
        return
      }
      let params = {
        userId: String(_this.userId),
        msg: String(_this.contentText),
        date: `${new Date().getFullYear()}-${new Date().getMonth() + 1 >= 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()} ${
          new Date().getHours() >= 10 ? new Date().getHours() : '0' + new Date().getHours()
        }:${new Date().getMinutes() >= 10 ? new Date().getMinutes() : '0' + new Date().getMinutes()}:${new Date().getSeconds() >= 10 ? new Date().getSeconds() : '0' + new Date().getSeconds()}`, //将日期转成年-月-日  时：分：秒的形式
        isDoctor: this.isDoctor,
        image: this.currentImage,
        userName: this.currentName
      }
      _this.ws.send(JSON.stringify(params)) //调用WebSocket send()发送信息的方法，向服务端发送数据
      _this.contentText = ''
      setTimeout(() => {
        _this.scrollBottm()
      }, 500)
    },
    //进入页面创建websocket连接
    initWebSocket() {
      let _this = this
      //判断页面有没有存在websocket连接
      if (window.WebSocket) {
        //是我本地IP地址 此处的 :8181 端口号 要与后端配置的一致
        let ws = new WebSocket(`ws://${location.hostname}:8181`)
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
          _this.history = resData.history
          // _this.history = _this.history.sort((a, b) => a.id - b.id) //历史记录根据id排序
          _this.curentHistory = _this.history.slice(0, _this.pageSize) //截取第一页的数据
          if (resData.funName == 'userCount') {
            _this.connectCount = resData.users
            _this.list = resData.chat
            //聊天人数根据list里面的userId统计，利用Set的特性不会把重复的数据放到set里面
            let userNum = new Set()
            _this.list.map(item => {
              userNum.add(item.userId)
            })
            _this.count = userNum.size
          } else {
            _this.list = [
              ..._this.list,
              {
                userId: resData.userId,
                content: resData.msg,
                date: resData.date,
                isDoctor: resData.isDoctor,
                image: resData.image,
                userName: resData.userName
              }
            ]
          }
          _this.list = _this.list.sort((a, b) => a.date - b.date)
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
  overflow: hidden;
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
  border: 1px solid #f1eded;
  box-shadow: 1px 1px 16px 2px #f3f0f0;
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
  background-color: #f4f4f4;
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
