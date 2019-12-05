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
  import storageUtils from "./utils/storageUtils";
  import store from "./store";
  export default {
    name: 'app',
    mounted() {
      if (storageUtils.getUser().username){
        store.commit("setUser",storageUtils.getUser().username)
        console.log("获取用户=>",storageUtils.getUser())
        this.$router.push("/message")
      }else {
        console.log("无用户");
        this.$router.push("/")
      }
    }
  }
</script>
