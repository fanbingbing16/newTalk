<template>
  <div class="chat-box">
    <el-button style="position: absolute; top: 10px; left: 800px" @click="$router.push({ path: '/navigation/welcome' })">返回</el-button>
    <div class="msg-box" ref="msg-box">
      <div v-for="(i, index) in list" :key="index" class="msg" :style="(isDoctor === 'true' && i.talkFrom === i.doctorName) || (isDoctor !== 'true' && i.talkFrom === i.userName) ? 'flex-direction:row-reverse' : ''">
        <div class="user-head">
          <div
            class="head"
            :style="` background: hsl(${getUserHead(i.userId, 'bck')}, 88%, 62%); clip-path:polygon(${getUserHead('polygon')}% 0,100% 100%,0% 100%); transform: rotate(${getUserHead(i.userId, 'rotate')}deg);border-radius: ${getUserHead(i.userId, 'boderRadius')[0]}% ${
              getUserHead(i.userId, 'boderRadius')[0]
            }% ${getUserHead(i.userId, 'boderRadius')[1]}% ${getUserHead(i.userId, 'boderRadius')[1]}%;`"
            v-if="i.talkFrom !== doctorName"
          ></div>
          <img :src="i.image" alt="" v-else style="max-width: 80%" />
          <span v-if="(isDoctor === 'true' && i.talkFrom !== i.doctorName) || (isDoctor !== 'true' && i.talkFrom !== i.userName)" :class="'leftSpan'">{{ i.talkFrom }}</span>
        </div>
        <div class="user-msg">
          <!-- :style="i.userId == userId ? ' float: right;' : ''" -->
          <span :class="(isDoctor === 'true' && i.talkFrom !== i.doctorName) || (isDoctor !== 'true' && i.talkFrom !== i.userName) ? 'right' : 'left'">{{ i.text }}</span>
        </div>
      </div>
    </div>
    <div class="input-box">
      <input type="text" ref="sendMsg" v-model="contentText" @keyup.enter="sendText()" />
      <div class="btn" :class="{ ['btn-active']: contentText }" @click="sendText()">发送</div>
    </div>
    <div class="patientMessageOfId">
      <p>病人信息</p>
      <el-form ref="Form" status-icon :model="patientMessage" label-width="100px" :disabled="true">
        <el-form-item label="姓名" prop="userName">
          <el-input :value="patientMessage.userName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input :value="patientMessage.sex === '0' ? '男' : '女'"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input :value="patientMessage.age"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input :value="patientMessage.email"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input :value="patientMessage.phone"></el-input>
        </el-form-item>
        <el-form-item label="上个医生的诊断书" prop="dignosis">
          <img :src="patientMessage.dignosis" alt="" />
        </el-form-item>
        <el-form-item label="吃过的药" prop="drug">
          <el-input :value="patientMessage.drug"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input :value="patientMessage.address"></el-input>
        </el-form-item>
        <el-form-item label="患处照片" prop="infectedImage">
          <img :src="patientMessage.infectedImage" alt="" />
        </el-form-item>
        <el-form-item label="病情的描述" prop="detail">
          <el-input :value="patientMessage.detail"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="patientMessage" v-if="isDoctor === 'true'"></div>
    <el-button v-if="isDoctor === 'true'" style="position: fixed; bottom: 10px; left: 64%" @click="dialogVisible = true">开处方</el-button>
    <el-button style="position: fixed; bottom: 60px; left: 63%" @click="endOnline">结束问诊</el-button>
    <div class="background-grey" v-if="dialogVisible"></div>
    <el-dialog title="开处方" :visible.sync="dialogVisible" width="30%" :before-close="cancle" style="margin-top: -80px; height: 700px; overflow-y: scroll">
      <el-form ref="Form" :rules="rules" status-icon :model="prescription" label-width="100px">
        <el-form-item label="诊断" prop="diagnosis">
          <el-input v-model="prescription.diagnosis"></el-input>
        </el-form-item>
        <div v-for="(drugs, index) in prescription.drugs" :key="drugs.key">
          <el-form-item
            style="margin-top: 10px"
            label="药品"
            :prop="'drugs.' + index + '.value'"
            :rules="{
              required: true,
              message: '名称不能为空',
              trigger: 'blur'
            }"
          >
            <el-input v-model="drugs.value"></el-input>
          </el-form-item>
          <el-form-item
            label="数量"
            :prop="'drugs.' + index + '.number'"
            :rules="{
              trigger: 'blur',
              validator: validNumber
            }"
          >
            <el-input v-model="drugs.number"></el-input>
          </el-form-item>
          <el-form-item label="使用方法" :prop="'drugs.' + index + '.methods'">
            <el-input v-model="drugs.methods"></el-input>
          </el-form-item>
          <el-form-item
            label="单价"
            :prop="'drugs.' + index + '.money'"
            :rules="{
              trigger: 'blur',
              validator: validNumber
            }"
          >
            <el-input v-model="drugs.money"></el-input>
          </el-form-item>
          <el-button @click.prevent="removeDomain(drugs)">删除</el-button>
          <el-button @click.prevent="addDomain(drugs)">增加</el-button>
        </div>
        <el-form-item label="医嘱" prop="medicalAdvice">
          <el-input v-model="prescription.medicalAdvice"></el-input>
        </el-form-item>
        <el-form-item label="是否提供药品？" prop="sex">
          <el-radio-group v-model="prescription.product">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="线上问诊费用" prop="money" style="margin-top: 10px">
          <el-input v-model="prescription.money"></el-input>
        </el-form-item>
        <el-form-item label="总费用" prop="totalPay">
          <el-input v-model="prescription.totalPay" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="prescriptionAdd">确 定</el-button>
      </span>
    </el-dialog>
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
      prescriptionNumber: 0,
      patientMessage: {},
      isDoctor: '',
      doctorImage: '',
      doctorName: '',
      patientName: '',
      doctorMessage: [],
      anotherUsers: '',
      anotherUserName: '',
      endTime: 0,
      dialogVisible: false,
      rules: {
        diagnosis: [{ required: true, message: '请输入诊断结果', trigger: 'blur' }]
      },
      // 处方
      prescription: {
        diagnosis: '',
        drugs: [{ value: '', number: 0, money: 0, methods: '', key: '' }],
        money: 0,
        totalPay: 0,
        medicalAdvice: '',
        product: '是'
      }
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
        this.patientName = response.data[0]?.userName
      }
    })
    this.prescriptionNumber = localStorage.getItem('prescriptionNumber')
    this.$axios.post('http://localhost:3000/api/Stu/searchOnlineMessage', { patientId }).then(response => {
      if (response.status === 200) {
        this.patientMessage = response.data.filter(item => {
          console.log(item.prescriptionNumber === +this.prescriptionNumber, item, +this.prescriptionNumber)
          return item.prescriptionNumber === +this.prescriptionNumber
        })?.[0]
      }
    })
  },
  mounted() {
    this.initWebSocket()
  },
  watch: {
    prescription: {
      handler(newValue) {
        let total = 0
        if (newValue.product === '是') {
          newValue.drugs.map(drugs => {
            total += drugs.money * drugs.number
          })
        }
        this.prescription.totalPay = total + +newValue.money
      },
      deep: true
    }
  },
  methods: {
    endOnline() {
      this.$confirm(' 您确定要结束线上问诊吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '点错了'
      })
        .then(() => {
          this.$message({
            type: 'info',
            message: '您已退出结束本次线上问诊'
          })
          this.$axios.post('http://localhost:3000/api/Stu/endTalk', { userId: this.userId, endOf: this.isDoctor === 'true' ? 'doctor' : 'patient', prescriptionNumber: this.prescriptionNumber }).then(response => {
            if (response.status === 200) {
              this.$router.push({ path: '/navigation/welcome' })
            }
          })
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: action === 'cancel' ? '停留在该页面' : '您已取消'
          })
        })
    },
    //确定开处方
    // prescription
    prescriptionAdd() {
      let message = {
        doctorId: this.userId,
        patientId: location.hash.split('/').slice(-1)[0],
        prescriptionNumber: this.prescriptionNumber,
        date: Date.now(),
        wellPayment: this.prescription.totalPay,
        diagnosis: this.prescription.diagnosis,
        isProduct: this.prescription.product,
        drugs: JSON.stringify(this.prescription.drugs)
      }
      this.$axios.post('http://localhost:3000/api/Stu/addPrescription', message).then(response => {
        if (response.status === 200) {
          this.dialogVisible = false
          this.$confirm('是否结束此次线上问诊?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$axios.post('http://localhost:3000/api/Stu/endTalk', { userId: location.hash.split('/').slice(-1)[0], endOf: 'doctor' }).then(response => {
                if (response.status === 200) {
                  this.$router.push('/navigation')
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '继续进行线上问诊'
              })
            })
        }
      })
    },
    cancle() {
      this.dialogVisible = false
      this.$refs['Form'].resetFields()
    },
    //验证表单必须为数字的项
    validNumber(rule, value, callback) {
      if (isNaN(value)) {
        callback(new Error('请输入数字值'))
      }
    },
    //删除处方中的一个药品
    removeDomain(item) {
      var index = this.prescription.drugs.indexOf(item)
      if (index !== -1) {
        this.prescription.drugs.splice(index, 1)
      }
    },
    //增加药品
    addDomain() {
      this.prescription.drugs.push({
        value: '',
        key: Date.now(),
        number: '',
        money: '',
        methods: ''
      })
    },
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
        image: _this.isDoctor === 'true' ? _this.doctorImage : '',
        talkTo: _this.isDoctor === 'true' ? _this.patientName : _this.doctorName,
        talkFrom: _this.isDoctor === 'true' ? _this.doctorName : _this.patientName,
        userName: _this.patientName,
        text: this.contentText,
        prescriptionNumber: this.prescriptionNumber,
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
                prescriptionNumber: resData.prescriptionNumber,
                text: resData.text,
                endTime: resData.endTime
              }
            ]
          }
          //只筛选出当前用户和其另外一个人聊天的记录
          setTimeout(() => {
            //因为获取到医生的姓名和病人的姓名是调用接口，需要一段时间，所以500毫秒之后执行
            _this.list = _this.list.filter(item => {
              return (item.talkTo === _this.doctorName && item.talkFrom === _this.patientName) || (item.talkFrom === _this.doctorName && item.talkTo === _this.patientName)
            })
            _this.list = _this.list.sort((a, b) => a.time - b.time)
          }, 500)
        }
      }
    }
  }
}
</script>

<style scoped>
.patientMessageOfId {
  top: 100px;
  position: absolute;
  left: 768px;
  width: 66%;
  background: white;
  height: 500px;
  overflow-y: scroll;
  border: 1px solid #e7e2e2;
  box-shadow: 0px 1px 5px 0px #ececec;
}
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
