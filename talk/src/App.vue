<template>
  <div id="app">
    <div class="bgcBottom"></div>
    <div class="bgc"></div>
    <div class="bgcPink"></div>
    <div class="bgcBlue"></div>
    <router-view></router-view>
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
// import Login from "./components/Login"
export default {
  name: "App",
  components: {
    // HelloWorld,
    // Login,
  },
  data() {
    return {
      test: [{}],
      ip: "http://localhost:3000/api/Stu/",
    };
  },
  created() {
    // this.$axios.get(this.ip + "showStu").then((response) => {
    //   this.test = response.data;
    //   // console.log(response.data);
    // });
    // this.$axios
    //   .post(this.ip + "addStu", {
    //     userId: 123,
    //     userName: "xiaoxiao",
    //     password: "123456",
    //     text: "text",
    //   })
    //   .then((response) => {
    //     console.log(response);
    //     this.$axios.get(this.ip + "showStu").then((response) => {
    //       this.test = response.data;
    //       console.log(response.data);
    //     });
    //   });
  },
};
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
}
.bgc {
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
  /* right: -19%; */
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
  /* right: -19%; */
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
  /* right: -19%; */
  left: 15%;
}
form.el-form.demo-ruleForm {
  margin-top: 12%;
  width: 29%;
  z-index: 9999;
}

</style>
