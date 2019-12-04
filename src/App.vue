<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
body,html{
  height: 100%;
}
#app{
  height: 100%;
  .battery{
    position: fixed;
  }
}
</style>
<script>
  import Vue from 'vue'
  export default {
    name: 'app',
  }
</script>
