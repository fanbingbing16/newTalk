<template>
  <div>
    <el-tree ref="tree" :data="treeData" :props="defaultProps" @node-click="handleNodeClick" node-key="id"></el-tree>
  </div>
</template>
<script>
import { schedule } from '../part'
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: []
    }
  },
  created() {
    this.treeData = schedule.map(part => {
      part.label = part.part
      part.children = []
      part.name = null
      return part
    })
    this.$axios.get('http://localhost:3000/api/Manage/searchDoctorDoctorUser').then(res => {
      console.log(res, '医生')
    })
  },
  // [
  //       {
  //         label: '主任医师',
  //         children: []
  //       },
  //       {
  //         label: '主治医师',
  //         children: []
  //       },
  //       {
  //         label: '副主任医师',
  //         children: []
  //       },
  //       {
  //         label: '住院医师',
  //         children: []
  //       }
  //     ]
  methods: {
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>
