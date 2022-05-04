<template>
  <Reservation :isManage="true"></Reservation>
</template>
<script>
import Reservation from '../Reservation.vue'
export default {
  components: { Reservation },
  name: 'ManageReservation'
}
</script>
