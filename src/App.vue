<template>
<div id="app">
    <left-nav />
    <router-view></router-view>
</div>
</template>

<script>
import LeftNav from '@/components/common/LeftNav';

export default {
  name: 'App',
  components: {
    LeftNav
  }
}
</script>

<style>
#app{
  height: 100%;
  overflow: hidden;
}
</style>
