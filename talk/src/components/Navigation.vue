<template>
  <div style="z-index: 2">
    <el-button type="primary" @click="GoBackSelect" class="reback">返回首页</el-button>
    <el-row class="tac">
      <el-col :span="12">
        <el-menu :default-active="curentMenu" :unique-opened="true" class="el-menu-vertical-demo" @select="changeSelect">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>医学常识</span>
            </template>
            <el-menu-item-group index="1">
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span slot="title">医学常识</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group index="1">
              <el-menu-item index="1-2">
                <i class="el-icon-menu"></i>
                <span slot="title">生活常识</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">预约挂号</span>
            </template>
            <el-menu-item-group index="2">
              <el-menu-item index="2-1">
                <i class="el-icon-menu"></i>
                <span slot="title">门诊排班</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="3">
            <i class="el-icon-setting"></i>
            <span slot="title">线上问诊</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">门诊收银</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuArr: [
        { value: 'mengzhengpaiban', index: '2-1' },
        { value: '1/medicalKnowledge', index: '1-1' },
        { value: '2/medicalKnowledge', index: '1-2' },
        { value: 'onlineconsultation', index: '3' }
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
      let select = this.menuArr.filter(item => item?.index === index)[0]?.value
      this.$router.push({ path: `/navigation/${select}` })
    },
    GoBackSelect() {
      this.$router.push({ path: '/select/' + localStorage.getItem('userId') })
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
