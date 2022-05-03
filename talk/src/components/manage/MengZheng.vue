<template>
  <div style="width: 100%; height: 100%; margin-top: 20px">
    <el-button type="primary" @click="addMz">新增</el-button>
    <div class="mz">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      <el-table :data="doctorData" style="width: 100%; margin-left: 20px">
        <el-table-column label="日期" width="180">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <span>{{ scope.row.date | filterTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getDetailTime } from '../getTime'
export default {
  name: 'ManageMengZheng',
  created() {
    this.$axios.get('http://localhost:3000/api/Stu/showAllDoctor').then(response => {
      console.log(response, 'meng zheng')
      if (response.status === 200) {
        response.data.map(res => {
          this.data = this.data.map(data => {
            if (data.label === res.title) {
              data.children.push({ label: res.name, id: res.id })
            }
            return data
          })
        })
        console.log(this.data)
      }
    })
  },
  data() {
    return {
      dialogVisible: false,
      selectDoctor: [],
      data: [
        {
          label: '主任医师',
          children: []
        },
        {
          label: '主治医师',
          children: []
        },
        {
          label: '副主任医师',
          children: []
        },
        {
          label: '住院医师',
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      doctorData: []
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    handleNodeClick(data) {
      this.selectDoctor = data
      this.$axios.post('http://localhost:3000/api/Stu/associationQuery', { id: data.id }).then(res => {
        console.log(res, 'mengzheng')
        this.doctorData = res.data
        let date = new Date().getTime()
        this.doctorData = this.doctorData.filter(doctor => doctor.date >= date)
      })
    },
    addMz() {
      if (this.selectDoctor.length === 0) {
        this.$message.error('请先选择医师')
      } else {
        this.dialogVisible = true
      }
    }
  },
  filters: {
    filterTime(data) {
      return getDetailTime(data)
    }
  }
}
</script>
<style scoped>
.mz {
  display: flex;
  width: 60%;
  /* align-content: center; */
  /* justify-content: center; */
  margin: auto;
  height: 69%;
  margin-top: 30px;
}
</style>
