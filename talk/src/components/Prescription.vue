<template>
  <div>
    <div class="search">
      <span>诊断：</span><el-input v-model="searchText"></el-input>
      <el-button type="primary" style="margin-left: 10px" @click="search">搜索</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="dialogVisible = true" v-if="power === 'all'">新增</el-button>
    </div>
    <div class="prescription" v-for="prescript in searchPrescriptions" :key="prescript.prescriptionNumber">
      <p>电子处方</p>
      <div>
        <span>处方号：{{ prescript.prescriptionNumber }}&nbsp;&nbsp;</span>
        <span>&nbsp;科室：{{ prescript.part }}&nbsp; </span>
        <span>&nbsp;日期：{{ prescript.date | formDate }}</span>
      </div>
      <div>
        <span>姓名：{{ prescript.userName }}&nbsp;&nbsp;</span>
        <span>&nbsp;性别：{{ prescript.sex }}&nbsp;</span>
        <span>&nbsp;年龄：{{ prescript.age }}</span>
      </div>
      <div>
        <span>诊断：{{ prescript.diagnosis }}</span
        >&nbsp;&nbsp;&nbsp;<span>诊断医生：{{ prescript.name }}</span>
      </div>
      <div v-for="item in JSON.parse(prescript.drugs)" :key="item.key">
        <span>药品：{{ item.value }}&nbsp; 数量：{{ item.number }}盒 &nbsp;使用方法：{{ item.methods }}&nbsp;单价：{{ item.money }}元</span>
      </div>
      <div style="padding-bottom: 8px">是否由本医院提供药品：{{ prescript.isProduct }}</div>
    </div>
    <div class="background-grey" v-if="dialogVisible"></div>
    <el-dialog title="开处方" :visible.sync="dialogVisible" width="30%" :before-close="cancle" style="margin-top: -80px; height: 700px; overflow-y: scroll">
      <el-form ref="Form" :rules="rules" status-icon :model="prescription" label-width="100px">
        <el-form-item label="病人" prop="diagnosis">
          <el-select v-model="prescription.patientId" clearable filterable placeholder="请选择">
            <el-option v-for="item in patientOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item label="额外费用" prop="money" style="margin-top: 10px">
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
import { getDetailTime } from './getTime'
export default {
  props: ['isManage'],
  created() {
    this.userId = localStorage.getItem('userId')
    if (!this.isManage) {
      this.$axios.post('http://localhost:3000/api/Stu/searchPrescription', { patientId: this.userId }).then(response => {
        if (response.status === 200) {
          this.prescriptions = response.data
          this.prescriptions = this.prescriptions.sort((a, b) => b.date - a.date)
          this.searchPrescriptions = this.prescriptions
        }
      })
    } else {
      this.$axios.get('http://localhost:3000/api/Manage/searchPrescription').then(response => {
        if (response.status === 200) {
          this.prescriptions = response.data
          this.prescriptions = this.prescriptions.sort((a, b) => b.date - a.date)
          this.prescriptions = this.prescriptions.map(pre => {
            if (!pre.userName) {
              let result = this.getUserName(pre.patientId)
              console.log(result, 'result')
              result.then(res => {
                if (res.data[0]) {
                  pre.userName = res.data[0].real_name || res.data[0].userName
                } else {
                  pre.userName = ''
                }
              })
            }
            return pre
          })
          this.searchPrescriptions = this.prescriptions
        }
      })
    }
    this.$axios.get('http://localhost:3000/api/Stu/showStu').then(res => {
      console.log(res, '用户')
      if (res.status === 200) {
        res.data.map(data => {
          this.patientOptions.push({ label: data.real_name || data.userName, value: data.userId })
        })
      }
    })
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
  data() {
    return {
      patientOptions: [],
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
      },
      dialogVisible: false,
      power: localStorage.getItem('power'),
      userId: '',
      prescriptions: [],
      searchText: '',
      searchPrescriptions: []
    }
  },
  filters: {
    formDate(date) {
      return getDetailTime(date)
    }
  },
  methods: {
    async getUserName(id) {
      let result
      result = await this.$axios.post('http://localhost:3000/api/Stu/showOfId', { userId: id })
      return result
    },
    //确定开处方
    // prescription
    prescriptionAdd() {
      let prescriptionNumber = new Date().getTime() + 2000000 + Math.floor(Math.random() * 100000)
      let message = {
        doctorId: this.userId,
        patientId: this.prescription.patientId,
        prescriptionNumber: prescriptionNumber,
        date: Date.now(),
        wellPayment: this.prescription.totalPay,
        diagnosis: this.prescription.diagnosis,
        isProduct: this.prescription.product,
        drugs: JSON.stringify(this.prescription.drugs)
      }
      this.$axios.post('http://localhost:3000/api/Stu/addPrescription', message).then(response => {
        if (response.status === 200) {
          this.dialogVisible = false
          this.$message.success('开处方成功')
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
    search() {
      this.searchPrescriptions = this.prescriptions.filter(item => {
        return item.diagnosis.includes(this.searchText)
      })
    }
  }
}
</script>
<style scoped>
.search {
  display: flex;
  margin-top: 10px;
  width: 350px;
}
.search span {
  width: 145px;
  margin-top: 10px;
}
.prescription {
  background: white;
  width: 98%;
  margin-top: 10px;
  border: 1px solid #e9e1e1;
  box-shadow: 1px 1px 8px 1px #e7e6e6;
}
.prescription p {
  padding: 4px;
  margin: 4px;
  font-size: 20px;
}
</style>
