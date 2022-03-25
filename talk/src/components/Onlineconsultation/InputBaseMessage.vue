<template>
  <div class="baseMessage">
    <input-reservation-information v-if="showReservation" :disable="true"></input-reservation-information>
    <div v-else>
      <p>请您先输入您的基本信息！</p>
      <el-form ref="Form" :rules="rules" status-icon :model="edit" label-width="100px">
        <el-form-item label="身份证号码" prop="id_number">
          <el-input v-model="edit.id_number"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="edit.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="id_number">
          <el-input v-model="edit.id_number"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="name">
          <el-input v-model="edit.name"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="name">
          <el-input v-model="edit.name"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址" prop="name">
          <el-input v-model="edit.name"></el-input>
        </el-form-item>
        <el-form-item label="病情" prop="name">
          <el-input v-model="edit.name"></el-input>
        </el-form-item>
        <el-form-item label="是否看过医生" prop="name">
          <el-input v-model="edit.name"></el-input>
        </el-form-item>
        <el-form-item label="医生的诊断书" prop="name">
          <el-input v-model="edit.name"></el-input>
        </el-form-item>
        <el-form-item label="是否在吃药" prop="name">
          <el-input v-model="edit.name"></el-input>
        </el-form-item>
        <el-form-item label="吃的什么药" prop="name">
          <el-input v-model="edit.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('Form')">返回</el-button>
          <el-button type="primary" @click="submitForm('Form')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import InputReservationInformation from '../InputReservationInformation.vue'
export default {
  components: { InputReservationInformation },
  created() {
    const userId = localStorage.getItem('userId')
    this.$axios.post('http://localhost:3000/api/Stu/showOfId', { userId }).then(response => {
      if (response.status === 200) {
        console.log(response)
      }
    })
  },
  data() {
    return {
      edit: {
        id_number: '',
        name
      },
      rules: {},
      text: '',
      showReservation: true
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('authentication', this.edit)
          this.$message({
            message: '认证成功，祝您生活愉快',
            type: 'success'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
