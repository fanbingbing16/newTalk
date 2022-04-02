<template>
  <div class="history" v-if="historyTalk.length > 0">
    <p>线上问诊历史记录</p>
    <el-table :data="historyTalk" style="width: 100%">
      <el-table-column prop="userName" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="isPrescription" label="是否开具药方" width="180"> </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="180"> </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="180"> </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="detail(scope.$index)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="background-grey" v-if="dialogVisible"></div>
    <el-dialog title="聊天内容" :visible.sync="dialogVisible" width="30%">
      <el-table :data="selectTalk">
        <el-table-column prop="talkFrom" label="发送人"> </el-table-column>
        <el-table-column prop="talkTo" label="接收人"> </el-table-column>
        <el-table-column prop="text" label="内容"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      historyTalk: [],
      userId: '',
      dialogVisible: false,
      selectTalk: []
    }
  },
  created() {
    this.userId = localStorage.getItem('userId')
    this.$axios.post('http://localhost:3000/api/Stu/searchHistoryTalk', { doctorId: this.userId }).then(response => {
      if (response.status === 200) {
        this.historyTalk = response.data.map(item => {
          item.isPrescription = item.isPrescription !== '0' ? '是' : '否'
          item.startTime = `${new Date(item.startTime).getFullYear()}-${new Date(item.startTime).getMonth() + 1}-${new Date(item.startTime).getDate()}`
          item.endTime = `${new Date(item.endTime).getFullYear()}-${new Date(item.endTime).getMonth() + 1}-${new Date(item.endTime).getDate()}`
          return item
        })
      }
    })
  },
  methods: {
    detail(index) {
      this.selectTalk = JSON.parse(this.historyTalk[index].info)
      this.dialogVisible = true
    }
  }
}
</script>
