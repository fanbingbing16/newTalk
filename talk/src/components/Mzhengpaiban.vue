<template>
  <div class="mzpb">
    <el-form ref="Form" :inline="true" status-icon :model="search" label-width="100px" style="margin-top: 10px">
      <el-form-item label="科室" prop="part">
        <el-input v-model="search.part"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchFun">搜索</el-button>
      </el-form-item>
    </el-form>
    <header>
      <div :class="{ 'click-week': currentWeek === 1 }" @click="selectWeek(1)">星期一</div>
      <div :class="{ 'click-week': currentWeek === 2 }" @click="selectWeek(2)">星期二</div>
      <div :class="{ 'click-week': currentWeek === 3 }" @click="selectWeek(3)">星期三</div>
      <div :class="{ 'click-week': currentWeek === 4 }" @click="selectWeek(4)">星期四</div>
      <div :class="{ 'click-week': currentWeek === 5 }" @click="selectWeek(5)">星期五</div>
      <div :class="{ 'click-week': currentWeek === 6 }" @click="selectWeek(6)">星期六</div>
      <div :class="{ 'click-week': currentWeek === 0 }" @click="selectWeek(0)">星期日</div>
    </header>
    <!-- <el-table :data="tableData" style="width: 1100px" height="660px" @cell-click="selectDoctor">
      <el-table-column prop="part" label="科室" width="80"></el-table-column>
      <el-table-column label="上午" prop="name[0].val"> </el-table-column>
      <el-table-column label="下午" prop="name[1].val"> </el-table-column>
    </el-table> -->
    <div class="table-header" style="width: 1100px; background: #f6f6f7; border-bottom: 1px solid #ebeef5; height: 50px; line-height: 50px; display: flex">
      <div style="width: 100px; border-right: 1px solid #ebeef5">科室</div>
      <div style="width: 500px; border-right: 1px solid #ebeef5">上午</div>
      <div style="width: 500px; border-right: 1px solid #ebeef5">下午</div>
    </div>
    <div class="el-table">
      <div class="row" v-for="item in searchData" :key="item.part">
        <div class="part">{{ item.part }}</div>
        <ol>
          <li v-for="name in item.name[0]" :key="name.id" @click="goToDetail(name)">{{ name.val }}&nbsp;</li>
        </ol>
        <ol>
          <li v-for="name in item.name[1]" :key="name.id" @click="goToDetail(name)">{{ name.val }}&nbsp;</li>
        </ol>
      </div>
    </div>
    <!-- <div class="background-grey" v-if="showModel && (this.tableSelect.name[0].length > 0 || this.tableSelect.name[1].length > 0)"></div>
    <div class="model" v-if="showModel && (this.tableSelect.name[0].length > 0 || this.tableSelect.name[1].length > 0)">
      <p>请您选择一位医生</p>
      <span v-for="(name1, index1) in tableSelect.name[0]" :key="index1" :class="{ 'click-doctor': selectName === name1 }" @click="changeClick(name1)">{{ name1 }}&nbsp;</span>
      <span v-for="(name2, index2) in tableSelect.name[1]" :key="index2 * 2 + 1" :class="{ 'click-doctor': selectName === name2 }" @click="changeClick(name2)">{{ name2 }}&nbsp;</span>
      <br />
      <el-button style="margin-top: 10px" @click="cancleModel">取消</el-button>
      <el-button type="primary" @click="goToDetail">确定</el-button>
    </div> -->
  </div>
</template>
<script>
import { schedule } from './part.js'
import { getWeekDay } from './getWeekDay.js'
export default {
  data() {
    return {
      tableData: schedule,
      searchData: [],
      ip: 'http://localhost:3000/api/Stu/',
      schedu: [],
      week: [],
      currentWeek: new Date().getDay(),
      tableSelect: [],
      selectName: '',
      search: {
        part: ''
      }
    }
  },
  created() {
    let date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    const time = getWeekDay(date)
    this.week = time
    this.$axios
      .post(this.ip + 'searchSchedu', {
        startTime: new Date(time[1]).getTime(),
        endTime: new Date(`${time[0]} 23:59:59`).getTime()
      })
      .then(response => {
        if (response.status === 200) {
          this.schedu = response.data
          this.changeWeekData(response.data, this.currentWeek)
        } else {
          console.log(response, '获取排班信息错误')
        }
      })
  },
  methods: {
    searchFun() {
      this.searchData = this.tableData.filter(item => (this.search.part ? item.part.includes(this.search.part) : true))
    },
    goToDetail(name) {
      localStorage.setItem('doctorId', name.id)
      this.$router.push({ path: `/doctor` })
    },
    changeClick(name) {
      this.selectName = name
    },
    selectWeek(number) {
      //不能选择小于今天的日子，也就是说周二不能选择周一
      if ((number !== 0 && number >= new Date().getDay()) || number === 0) {
        console.log(111)
        this.currentWeek = number
        this.changeWeekData(this.schedu, this.currentWeek)
      }
    },
    changeWeekData(data, day) {
      this.tableData = this.tableData.map(item => {
        item.name = [[], []]
        return item
      })
      console.log(this.tableData, 'tableData')
      this.tableData = this.tableData.map(item => {
        data.forEach(element => {
          let start = new Date(`${this.week[day]} 00:00:00`).getTime()
          let end = new Date(`${this.week[day]} 23:59:59`).getTime()
          console.log(start, end, new Date(element.date).getTime(), item.part === element.part, new Date(element.date).getTime() >= start, new Date(element.date).getTime() <= end)
          //获取周一的数据 号源大于1的医生 科室对应科室
          if (element.signalSource > 0) {
            if (item.part === element.part && new Date(element.date).getTime() >= start && new Date(element.date).getTime() <= end) {
              let time = new Date(element.date).getHours()
              if (time >= 4 && time <= 12) {
                item.name[0].push({ val: element.name, id: element.doctorId })
              } else {
                item.name[1].push({ val: element.name, id: element.doctorId })
              }
              item.doctorId = element.doctorId
            }
          }
        })
        return item
      })
      this.searchData = this.tableData
    }
  }
}
</script>
<style scoped>
header {
  display: flex;
  width: 1100px;
  background: #f5f7fa;
}
header div {
  border: 1px solid #ebeef5;
  width: 157px;
  height: 50px;
  line-height: 50px;
  color: #909399;
  font-weight: bold;
  font-size: 16px;
  cursor: context-menu;
}
.click-week {
  background: #909399;
  color: white;
}
.background-grey {
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background: grey;
  top: 0;
  opacity: 0.5;
}
.model {
  z-index: 111;
  padding: 10px;
  position: absolute;
  background: white;
  top: 300px;
  left: 600px;
}
.click-doctor {
  color: aqua;
}
ol {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 500px;
  border-right: 1px solid #ebeef5;
  display: flex;
}
.el-table {
  height: 550px;
  overflow: scroll;
  background: #f6f6f7;
  width: 1100px;
}
.row {
  display: flex;
  /* margin-top: 6px; */
  border-bottom: 1px solid #ebeef5;
  height: 30px;
  line-height: 30px;
}
.part {
  width: 100px;
  border-right: 1px solid #ebeef5;
}
.row li:hover {
  color: aqua;
  border-bottom: 1px solid aqua;
}
.row li {
  cursor: context-menu;
}
</style>
<style>
.el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-right: 1px solid #ebeef5;
}
.tac.el-row {
  width: 200px !important;
  border: 1px solid #d9d9d9;
  box-shadow: 4px 8px 17px #eeeeee;
}
.el-col-12 {
  width: 100%;
}
</style>
