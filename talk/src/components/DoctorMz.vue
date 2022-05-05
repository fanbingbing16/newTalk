<template>
  <div>
    <el-table :data="tableData" style="width: 100%; margin-top: 20px" ref="filterTable">
      <el-table-column label="日期" width="180">
        <template slot-scope="scope">
          <!-- {{ scope.row }} -->
          <span>{{ scope.row.date | filterTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getWeekDay } from './getWeekDay'
import { getYearDate, getTimeOfFour } from './getTime'
export default {
  created() {
    // params.doctorId, params.startTime, params.endTime
    let date = getWeekDay(getYearDate(new Date()))
    console.log(date, 'date')
    this.$axios.post('http://localhost:3000/api/Stu/searchScheduFromId', { startTime: new Date(date[new Date().getDay()]).getTime(), endTime: new Date(date[0]).getTime(), doctorId: this.doctorId }).then(response => {
      console.log(response, 'chaxun')
      if (response.status === 200) {
        this.tableData = response.data
      }
    })
  },
  data() {
    return {
      tableData: [],
      doctorId: localStorage.getItem('userId')
    }
  },
  methods: {},
  filters: {
    filterTime(data) {
      return getTimeOfFour(data)
    }
  }
}
</script>
