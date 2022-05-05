<template>
  <div style="width: 100%; height: 100%; margin-top: 20px">
    <el-button type="primary" @click="addMz">新增</el-button>
    <div class="mz">
      <el-tree ref="tree" :data="data" :props="defaultProps" @node-click="handleNodeClick" node-key="id"></el-tree>
      <el-table :data="doctorData" style="width: 100%; margin-left: 20px">
        <el-table-column label="日期" width="180">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <span>{{ scope.row.date | filterTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
        <el-table-column prop="signalSource" label="号源" width="180"> </el-table-column>
        <el-table-column prop="part" label="科室" width="180"> </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="addMz(scope.row)">修改</el-button>
            <el-popconfirm title="您确定删除吗？" @confirm="deletePaib(scope.row)">
              <el-button slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form>
        <el-form-item label="医生名字" label-width="80px"><el-input type="text" v-model="selectDoctor.label" :disabled="true"></el-input></el-form-item>
        <el-form-item label="医生职称" label-width="80px"><el-input type="text" v-model="selectDoctor.title" :disabled="true"></el-input></el-form-item>
        <el-form-item label="医生号源" label-width="80px"> <el-input-number v-model="addForm.signalSource" :min="1" :max="25" label="选择号源"></el-input-number> </el-form-item>
        <el-form-item label="选择日期" label-width="80px"><el-date-picker :picker-options="pickerOptions" v-model="addForm.date" placeholder="选择日期时间"> </el-date-picker></el-form-item>
        <el-form-item label="选择时间" label-width="80px">
          <el-select v-model="addForm.time" clearable filterable placeholder="请选择">
            <el-option label="上午" value="08:30:00"> </el-option>
            <el-option label="下午" value="13:30:00"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addPaib">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getTimeOfFour } from '../getTime'
export default {
  name: 'ManageMengZheng',
  created() {
    this.getDoctor()
  },
  data() {
    return {
      dialogTitle: '',
      row: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      dialogVisible: false,
      addForm: { signalSource: 20 },
      selectDoctor: {},
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      doctorData: []
    }
  },
  methods: {
    setCheckedKeys(id) {
      this.$refs.tree.setCheckedKeys([id])
    },
    getDoctor() {
      this.data = [
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
      ]
      this.$axios.get('http://localhost:3000/api/Stu/showAllDoctor').then(response => {
        console.log(response, 'meng zheng')
        if (response.status === 200) {
          response.data.map(res => {
            this.data = this.data.map(data => {
              if (data.label === res.title) {
                data.children.push({ label: res.name, id: res.id, part: res.part, signalSource: res.signalSource, title: res.title })
              }
              return data
            })
          })
          console.log(this.data)
        }
      })
    },
    deletePaib(row) {
      this.$axios
        .post('http://localhost:3000/api/Manage/deleteScheduling', { id: row.id })
        .then(response => {
          console.log(response, 'delete')
          if (response.status === 200) {
            this.$message.success('删除成功')
            this.doctorData = this.doctorData.filter(data => data.id !== row.id)
          }
        })
        .catch(err => {
          console.log(err, 'err')
          this.$message.error('未删除成功，请稍后重试！')
        })
    },
    addPaib() {
      let selectTime = `${new Date(this.addForm.date).getFullYear()}-${new Date(this.addForm.date).getMonth() + 1}-${new Date(this.addForm.date).getDate()}`
      let date = new Date(selectTime + ' ' + this.addForm.time).getTime()
      console.log(date, 'date', selectTime + ' ' + this.addForm.time)
      if (!this.row.id) {
        this.$axios
          .post('http://localhost:3000/api/Manage/addScheduling', { date, name: this.selectDoctor.label, doctorId: this.selectDoctor.id, part: this.selectDoctor.part, signalSource: this.addForm.signalSource })
          .then(res => {
            console.log(res, 'addScheduling')
            if (res.status === 200) {
              if (res.data.msg) {
                this.$message.error(res.data.msg)
              } else {
                this.getDoctor()
                this.dialogVisible = false
                this.setCheckedKeys(this.selectDoctor.id)
                this.selectDoctor = {}
                this.doctorData = []
                this.addForm = { signalSource: 20 }
                console.log(this.selectDoctor, this.selectDoctor.$treeNodeId)
                this.$message.success('新增成功')
              }
            }
          })
          .catch(err => {
            console.log(err, 'err')
            this.$message.error('未知错误，请联系管理员')
          })
      } else {
        this.$axios
          .post('http://localhost:3000/api/Manage/editScheduling', { date, id: this.row.id, signalSource: this.addForm.signalSource, doctorId: this.selectDoctor.id })
          .then(res => {
            console.log(res, 'edit')
            if (res.status === 200) {
              if (res.data.msg) {
                this.$message.error(res.data.msg)
              } else {
                this.getDoctor()
                this.dialogVisible = false
                this.setCheckedKeys(this.selectDoctor.id)
                this.selectDoctor = {}
                this.doctorData = []
                this.addForm = { signalSource: 20 }
                console.log(this.selectDoctor, this.selectDoctor.$treeNodeId)
                this.$message.success('修改成功')
              }
            }
          })
          .catch(err => {
            console.log(err, 'err')
            this.$message.error('未知错误，请联系管理员')
          })
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.addForm = { signalSource: 20 }
    },
    handleNodeClick(data) {
      this.selectDoctor = data
      if (data.id) {
        this.$axios.post('http://localhost:3000/api/Manage/associationQuery', { id: data.id }).then(res => {
          console.log(res, 'mengzheng')
          this.doctorData = res.data
          let date = new Date().getTime()
          this.doctorData = this.doctorData.filter(doctor => doctor.date >= date)
        })
      }
    },
    addMz(row) {
      this.row = row
      console.log(row, 'row')
      if (row.id) {
        this.dialogTitle = '修改'
        let date = new Date(row.date)
        this.addForm.date = date
        this.addForm.time = date.getHours() >= 4 && date.getHours() <= 12 ? '08:30:00' : '13:30:00'
        this.addForm.signalSource = row.signalSource
      } else this.dialogTitle = '新增'
      if (!this.selectDoctor.id) {
        this.$message.error('请先选择医师')
      } else {
        this.dialogVisible = true
      }
    }
  },
  filters: {
    filterTime(data) {
      return getTimeOfFour(data)
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
