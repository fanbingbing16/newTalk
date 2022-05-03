<template>
  <div id="app">
    <!-- <div class="background-full">
      <div class="bgcBottom"></div>
      <div class="bgc"></div>
      <div class="bgcPink"></div>
      <div class="bgcBlue"></div>
    </div> -->
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
// import Login from "./components/Login"
// import SelectPeople from './components/SelectPeople.vue'
export default {
  name: 'App',
  components: {
    // HelloWorld,
    // Login,
    // SelectPeople
  },
  data() {
    return {
      isRouterAlive: true
    }
  }
  //provide inject 实现组件的局部加载，预约成功之后号源会减一，这个时候就需要局部加载一下页面，其他页面需要局部加载的时候也可以这样
  // provide() {
  //   return {
  //     reload: this.reload
  //   }
  // },
  // methods: {
  //   reload() {
  //     this.isRouterAlive = false
  //     this.$nextTick(() => {
  //       this.isRouterAlive = true
  //     })
  //   }
  // }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  display: flex;
  align-content: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: relative;
  margin-top: 0.1px;
}
/* .bgc {
  background-color: yellow;
  height: 91%;
  width: 53%;
  transform: rotate(45deg);
  box-shadow: 10px 10px 5px #888888;
  position: fixed;
  top: 0;
  right: 73%;
}
.bgcPink {
  background-color: pink;
  height: 80%;
  width: 100%;
  transform: rotate(45deg);
  box-shadow: 10px 10px 5px #888888;
  position: fixed;
  top: 41%;
  right: -19%;
  left: 65%;
}
.bgcBlue {
  background-color: #17b3f7;
  height: 142%;
  width: 71%;
  transform: rotate(45deg);
  box-shadow: 10px 10px 5px #888888;
  position: fixed;
  top: -87%;
   right: -19%; 
  left: 15%;
}
.bgcBottom {
  background-color: #cfe7f3;
  height: 142%;
  width: 71%;
  transform: rotate(45deg);
  box-shadow: 10px 10px 5px 5px #888888;
  position: fixed;
  top: 34%;
   right: -19%; 
  left: 15%;
} */
form.el-form.demo-ruleForm {
  padding-top: 2%;
  padding-right: 2%;
  margin-top: 12%;
  width: 29%;
  /* height: 40%; */
  z-index: 9999;
  border: 1px solid #e7e3e3;
  box-shadow: 1px 1px 9px 1px #e9e7e7;
}
</style>
