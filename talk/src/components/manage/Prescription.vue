<template>
  <Prescription :isManage="true"></Prescription>
</template>
<script>
import Prescription from '../Prescription.vue'
export default {
  components: { Prescription },
  name: 'ManagePrescription'
}
</script>
