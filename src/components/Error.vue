<template>
  <div class="err">
    <h1>
      {{msg}}
    </h1>
  </div>
</template>

<script>
export default {
  name: 'err',
  data () {
    return {
      msg: 'Error 404'
    }
  }
}
</script>

<style scoped>

</style>
