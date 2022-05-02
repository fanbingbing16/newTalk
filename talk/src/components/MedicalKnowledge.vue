<template>
  <div class="knoledge" :style="seartResult.length > 0 ? 'overflow-y: scroll;' : ''">
    <div>
      <el-autocomplete popper-class="my-autocomplete" @keyup.enter.native="searchArticle" v-model="searchText" :fetch-suggestions="querySearch" placeholder="请输入内容进行搜索" @select="handleSelect">
        <template slot-scope="{ item }">
          <div class="name">{{ item.value }}</div>
        </template>
      </el-autocomplete>
      <el-button style="position: absolute; top: 10px" @click="showAddMessage = true" v-if="isDoctor === 'true'">增加数据</el-button>
    </div>
    <template v-if="seartResult.length > 0">
      <div class="article" v-for="item in seartResult" :key="item.id">
        <p v-if="item.classification !== '1'" class="bigTitle">{{ item.classification }}</p>
        <p class="title">{{ item.title }}</p>
        <p class="content">{{ item.content }}</p>
      </div>
      <div class="background-grey" v-if="showAddMessage"></div>
      <el-dialog title="增加数据" :visible.sync="showAddMessage" width="30%">
        <el-form ref="Form" :rules="rules" status-icon :model="add" label-width="100px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="add.title"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input v-model="add.content"></el-input>
          </el-form-item>
          <el-form-item label="类别" prop="classification">
            <el-input v-model="add.classification"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cangcle">取 消</el-button>
          <el-button type="primary" @click="addMessage">确 定</el-button>
        </span>
      </el-dialog>
    </template>
    <div v-else class="noMessage">暂无数据,请尝试搜索其他关键词</div>
  </div>
</template>
<script>
export default {
  // inject: ['reload'],
  data() {
    return {
      //fullData存储数据库返回的所有信息，knowedge根据路由存储生活常识或者医学常识，seartResult存储搜素结果
      knowedge: [],
      restaurants: [],
      searchText: '',
      seartResult: [],
      add: {
        classification: '',
        title: '',
        content: ''
      },
      rules: {
        title: [{ required: true, message: '标题必填', trigger: 'blur' }],
        content: [{ required: true, message: '内容必填', trigger: 'blur' }]
      },
      fullData: [],
      showAddMessage: false,
      path: location.hash.split('/'),
      isDoctor: localStorage.getItem('isDoctor')
    }
  },
  created() {
    this.$axios.get('http://localhost:3000/api/Stu/searchKnowledge').then(response => {
      this.fullData = response.data
      this.changeKnowledge()
    })
  },
  methods: {
    cangcle() {
      this.showAddMessage = false
      this.$refs['Form'].resetFields()
    },
    addMessage() {
      this.$refs['Form'].validate(valid => {
        if (valid) {
          this.$axios.post('http://localhost:3000/api/Stu/addKnowledge', this.add).then(response => {
            if (response.status === 200) {
              this.cangcle()
              // this.reload()
            }
          })
        }
      })
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    loadAll() {
      return [{ value: '早产' }, { value: '新生儿' }, { value: '脑瘤' }, { value: '血红蛋白' }, { value: '糖尿病' }, { value: '心率' }, { value: '体温' }]
    },
    handleSelect() {
      this.searchArticle()
    },
    searchArticle() {
      this.seartResult = this.knowedge.filter(item => {
        if (this.path[this.path.length - 2])
          if (item.title.includes(this.searchText) || item.content.includes(this.searchText) || item.classification.includes(this.searchText)) {
            return item
          }
      })
    },
    changeKnowledge() {
      this.path = location.hash.split('/')
      //区分医学常识和生活常识页面
      if (this.path[this.path.length - 2] === '1') {
        this.knowedge = this.fullData.filter(item => item.classification === '1')
      } else {
        this.knowedge = this.fullData.filter(item => item.classification !== '1')
      }
      this.seartResult = this.knowedge
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
  },
  watch: {
    $route(to) {
      if (to.path.split('/').slice(-1)[0] === 'medicalKnowledge') {
        this.searchText = ''
        this.changeKnowledge()
      }
    }
  }
}
</script>
<style scoped>
p.title {
  font-family: '微软雅黑';
  color: green;
  font-weight: 500;
}
p.content {
  width: 900px;
}
.knoledge {
  height: 88%;
  width: 125%;
  margin-top: 58px;
}
/* .knoledge .article:nth-child(2) {
  margin-top: 68px;
} */
.article {
  width: 80%;
}
.noMessage {
  margin-top: 100px;
  font-size: 50px;
}
p.bigTitle {
  width: 155px;
  color: red;
}
</style>
<style>
.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}
.my-autocomplete .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.el-autocomplete {
  position: fixed;
  top: 10px;
  margin-left: -212px;
}
</style>
