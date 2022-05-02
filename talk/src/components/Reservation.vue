<template>
  <div>
    <el-form ref="form" :inline="true" :model="form" label-width="80px">
      <el-form-item label="过敏史">
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="form.allergicHistory"> </el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <template v-for="item in searchData">
      <div class="card" :key="item.id">
        <p>预约时间：{{ item.time | formData }}</p>
        <p>姓名：{{ item.real_name }}</p>
        <p>就诊卡：{{ item.medicalCard }}</p>
        <p>医保卡：{{ item.medicalInsuranceCard }}</p>
        <p>简要描述：{{ item.detail }}</p>
        <p>过敏史：{{ item.allergiHistory }}</p>
        <p>身份证：{{ item.sfz_number }}</p>
        <p>性别：{{ item.sex }}</p>
      </div>
    </template>
    <p v-if="data.length === 0">暂无预约记录</p>
    <div style="width: 100%; height: 10px"></div>
  </div>
</template>
<script>
import { getDetailTime } from './getTime.js'
export default {
  created() {
    this.userId = localStorage.getItem('userId')
    this.$axios.post('http://localhost:3000/api/Stu/searchOrderOfDoctor', { id: this.userId }).then(response => {
      console.log(response, 'response')
      if (response.status === 200) {
        this.data = response.data.filter(item => {
          item.sfz_number = String(item.sfz_number)
          item.sfz_number = item.sfz_number.substr(0, 4) + 'xxxxxxxxxxxxxx'
          return item
        })
        this.searchData = this.data
      }
    })
  },
  methods: {
    search() {
      this.searchData = this.data.filter(item => (this.form.allergicHistory.length > 0 ? item.allergicHistory.includes(this.form.allergicHistory) : true && this.form.sex === item.sex))
    }
  },
  data() {
    return {
      userId: '',
      data: [],
      form: {
        allergicHistory: '',
        sex: '女'
      },
      searchData: []
    }
  },
  filters: {
    formData(date) {
      return getDetailTime(date)
    }
  }
}
</script>
<style scoped>
form.el-form {
  margin-top: 10px;
}
.card {
  background: white;
  display: flex;
  width: 87%;
  margin-left: 100px;
  height: 100px;
  flex-wrap: wrap;
  border: 1px solid rgb(206, 203, 203);
  margin-top: 10px;
}
.card p {
  width: 31%;
  margin-top: 4px;
  margin-bottom: 0;
  padding: 4px;
}
</style>
