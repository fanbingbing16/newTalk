<template>
  <div class="doctor-manage" style="display: flex; margin-top: 20px">
    <el-tree ref="tree" :data="treeData" :props="defaultProps" @node-click="handleNodeClick" node-key="id" style="width: 10%"></el-tree>
    <el-form ref="form" v-if="selectData.detail || selectData.name" :rules="rules" :model="selectData">
      <el-form-item label="名字" label-width="80px" prop="name">
        <el-input v-model="selectData.name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="职称" label-width="80px" prop="title">
        <el-select v-model="selectData.title">
          <el-option label="主任医师" value="主任医师"> </el-option>
          <el-option label="副主任医师" value="副主任医师"> </el-option>
          <el-option label="住院医师" value="住院医师"> </el-option>
          <el-option label="主治医师" value="主治医师"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室" label-width="80px" prop="part">
        <el-select v-model="selectData.part">
          <el-option v-for="partOne in schedule" :key="partOne.part" :value="partOne.part" :label="partOne.part"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" label-width="80px" prop="sex">
        <el-select v-model="selectData.sex">
          <el-option value="女" label="女"></el-option>
          <el-option value="男" label="男"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" label-width="80px" prop="email">
        <el-input v-model="selectData.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" label-width="80px" prop="phone">
        <el-input v-model="selectData.phone"></el-input>
      </el-form-item>
      <el-form-item label="详细描述" label-width="80px" prop="detail">
        <el-input type="textarea" v-model="selectData.detail" autosize></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="edit">修改</el-button>
        <el-button @click="dialogVisible = true">新增</el-button>
        <el-popconfirm title="确定删除该医生吗？" @confirm="deteleDoctor">
          <el-button slot="reference">删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>
    <div class="image" v-if="selectData.detail || selectData.name">
      <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1" :on-change="changeImage">
        <img class="el-upload-list__item-thumbnail" :src="selectData.image" alt="" />
      </el-upload>
    </div>
    <el-dialog title="新增" :visible.sync="dialogVisible" :before-close="handleClose">
      <RegisterDoctor :isManage="true" @getForm="getAddForm" :confim="confim"></RegisterDoctor>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { schedule } from '../part'
import RegisterDoctor from '../RegisterDoctor.vue'
export default {
  components: {
    RegisterDoctor
  },
  data() {
    return {
      addFormData: [],
      dialogVisible: false,
      schedule: schedule,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      confim: false,
      selectData: {
        phone: null,
        name: null,
        email: null,
        image: null,
        part: null,
        title: null,
        detail: null
      },
      rules: {
        phone: { required: true, message: '必须输入', trigger: 'blur' },
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        image: { required: true, message: '请上传照片', trigger: 'blur' },
        part: { required: true, message: '请选择科室', trigger: 'blur' },
        title: { required: true, message: '请选择职称', trigger: 'blur' },
        detail: { required: true, message: '请简要描述一下医生', trigger: 'blur' }
      }
    }
  },
  created() {
    this.getDoctor()
  },
  methods: {
    addForm() {
      this.$axios
        .post('http://localhost:3000/api/Stu/addDoctorUser', {
          ...this.addFormData
        })
        .then(response => {
          console.log(response, 'response')
          if (response.status === 200) {
            this.dialogVisible = false
            this.addFormData = {}
            this.$message.success('添加成功')
            this.selectData = {}
            this.getDoctor()
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    getAddForm(form) {
      this.addFormData = form
    },
    handleClose() {
      this.dialogVisible = false
    },
    getDoctor() {
      this.$axios
        .get('http://localhost:3000/api/Manage/searchDoctorDoctorUser')
        .then(res => {
          let partObj = {}
          schedule.forEach(part => {
            partObj[part.part] = part.part
          })
          let treeData = {}
          res.data.forEach(item => {
            if (partObj[item.part]) {
              if (!treeData[item.part]) {
                treeData[item.part] = {
                  label: '',
                  children: []
                }
              }
              treeData[item.part].children.push({ label: item.name, ...item })
              treeData[item.part].label = item.part
            }
          })
          this.treeData = Object.values(treeData)
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    deteleDoctor() {
      this.$axios
        .post('http://localhost:3000/api/Manage/deleteDoctor', { id: this.selectData.id })
        .then(res => {
          if (res.status === 200) this.$message.success('删除成功')
          this.getDoctor()
          this.selectData = {}
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    edit() {
      this.$refs['form'].validate(valid => {
        console.log(valid, this.rules, this.selectData)
        if (valid) {
          console.log(this.selectData)
          this.$axios
            .post('http://localhost:3000/api/Manage/editDoctor', { ...this.selectData })
            .then(res => {
              if (res.status === 200) this.$message.success('修改成功')
            })
            .catch(err => {
              this.$message.error(err)
            })
        } else {
          this.$message.error('请填写正确再提交')
          return false
        }
      })
    },
    handleNodeClick(data) {
      this.selectData = data
    },
    changeImage(file) {
      console.log(file, 'file res')
      //将blob图片转成base64的格式，存储到数据库就以字符串的形式
      let that = this
      this.blobToDataURI(file.raw, function (data) {
        that.selectData.image = data
      })
    },
    blobToDataURI(blob, callback) {
      var reader = new FileReader()
      reader.onload = function (e) {
        callback(e.target.result)
      }
      reader.readAsDataURL(blob)
    }
  }
}
</script>
<style>
.doctor-manage .el-form-item__content {
  width: 600px;
}
.doctor-manage .el-input {
  width: 600px;
}
.doctor-manage img {
  max-width: 170px;
}
</style>
<style scoped>
img {
  max-width: 170px;
}
.image {
  width: 170px;
  height: 100px;
  overflow: hidden;
  margin-left: 80px;
}
</style>
