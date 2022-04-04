<template>
  <div>
    <div class="search">
      <span>诊断：</span><el-input v-model="searchText"></el-input>
      <el-button type="primary" style="margin-left: 10px" @click="search">搜索</el-button>
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
      <div>诊断：{{ prescript.diagnosis }}</div>
      <div v-for="item in JSON.parse(prescript.drugs)" :key="item.key">
        <span>药品：{{ item.value }}&nbsp; 数量：{{ item.number }}盒 &nbsp;使用方法：{{ item.methods }}&nbsp;单价：{{ item.money }}元</span>
      </div>
      <div style="padding-bottom: 8px">是否由本医院提供药品：{{ prescript.isProduct }}</div>
    </div>
  </div>
</template>
<script>
import { getDetailTime } from './getTime'
export default {
  created() {
    this.userId = localStorage.getItem('userId')
    this.$axios.post('http://localhost:3000/api/Stu/searchPrescription', { patientId: this.userId }).then(response => {
      if (response.status === 200) {
        this.prescriptions = response.data
        this.prescriptions = this.prescriptions.sort((a, b) => b.date - a.date)
        this.searchPrescriptions = this.prescriptions
      }
    })
  },
  data() {
    return {
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
    search() {
      this.searchPrescriptions = this.prescriptions.filter(item => {
        item.diagnosis.includes(this.searchText)
      })
    }
  }
}
</script>
<style scoped>
.search {
  display: flex;
  margin-top: 10px;
}
.search span {
  width: 80px;
  margin-top: 10px;
}
.prescription {
  background: white;
  width: 137%;
  margin-top: 10px;
}
.prescription p {
  padding: 4px;
  margin: 4px;
  font-size: 20px;
}
</style>
