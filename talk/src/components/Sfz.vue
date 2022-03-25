!
<template>
  <div style="margin-top: -200px" class="sf">
    <p>请您先完成身份认证才能往下操作！</p>
    <el-form ref="Form" :rules="rules" status-icon :model="edit" label-width="100px">
      <el-form-item label="身份证号码" prop="id_number">
        <el-input v-model="edit.id_number"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="edit.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancle', true)">以后再进行身份认证</el-button>
        <el-button @click="resetForm('Form')">重置</el-button>
        <el-button type="primary" @click="submitForm('Form')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 引入封装的方法 -->
  <!-- 在使用页面当中进行使用 -->
</template>
<script>
import { validateSfz, validateRealName } from './validateSfz.js'
export default {
  data() {
    return {
      edit: {
        id_number: '',
        name
      },
      rules: {
        id_number: [{ validator: validateSfz, trigger: 'blur' }],
        name: [{ validator: validateRealName, trigger: 'blur' }]
      },
      text: ''
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
<style scoped>
div.sf {
  background: white;
  z-index: 111;
  position: absolute;
  width: 500px;
  padding: 20px;
}
</style>
