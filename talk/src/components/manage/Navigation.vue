<template>
  <div style="z-index: 2; width: 100%">
    <el-button type="primary" @click="GoBackSelect(1)" class="reback">退出</el-button>

    <el-row class="tac">
      <el-col :span="12">
        <el-menu :default-active="curentMenu" :unique-opened="true" class="el-menu-vertical-demo" @select="changeSelect">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>医生管理</span>
            </template>
            <el-menu-item-group index="1">
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span slot="title">医生管理</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">处方管理</span>
            </template>
            <el-menu-item-group index="3">
              <el-menu-item index="3-2">
                <i class="el-icon-setting"></i>
                <span slot="title">查看处方</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">预约记录</span>
          </el-menu-item>
          <el-menu-item index="6">
            <i class="el-icon-setting"></i>
            <span slot="title">门诊排班</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
    <div class="content"><router-view></router-view></div>
  </div>
</template>
<script>
export default {
  name: 'ManageNavigation',
  data() {
    return {
      menuArr: [
        { value: 'mengzhengpaiban', index: '2-1' },
        { value: 'doctor', index: '1-1' },
        { value: 'onlineconsultation', index: '3-1' },
        { value: 'prescription', index: '3-2' },
        { value: 'reservation', index: '4' },
        { value: '/talk' + localStorage.getItem('userId'), index: '5' },
        { value: 'mengzheng', index: '6' },
        { value: 'prescription', index: '7' },
        { value: 'welcome', index: '0' }
      ],
      curentMenu: '1-1'
    }
  },
  created() {
    this.curentMenu = this.menuArr.filter(item => {
      let value = item.value.split('/')
      let path = location.hash.split('/')
      if (value.length > 1) {
        if (item.value === path[path.length - 2] + '/' + path[path.length - 1]) {
          return item
        }
      } else {
        if (item.value === path.slice(-1)[0]) {
          return item
        }
      }
    })[0].index
  },
  methods: {
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath, 1)
    // },
    // handleClose(key, keyPath) {
    //   console.log(key, keyPath, 2)
    // },
    changeSelect(index) {
      //点击菜单跳转到对应的子路由页面
      if (index !== '5') {
        let select = this.menuArr.filter(item => item?.index === index)[0]?.value
        this.$router.push({ path: `/manage/navigation/${select}` })
      } else {
        this.$router.push({ path: '/talk/' + localStorage.getItem('userId') })
      }
    },
    GoBackSelect(num) {
      if (num === 0) this.$router.push({ path: '/select/' + localStorage.getItem('userId') })
      else {
        this.$confirm('您确定要退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            localStorage.removeItem('userId')
            localStorage.removeItem('doctorId')
            localStorage.removeItem('authentication')
            localStorage.removeItem('power')
            localStorage.removeItem('prescriptionNumber')
            this.$router.push({ path: '/login' })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      }
    }
  }
}
</script>
<style>
.tac.el-row {
  width: 400px;
  position: absolute;
  left: 0;
  top: 10px;
}
.reback {
  position: absolute;
  right: 96px;
  top: 10px;
}
</style>
<style scoped>
.content {
  margin-left: 300px;
}
</style>
