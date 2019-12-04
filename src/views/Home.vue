<template>
  <div class="home">
    <Button class="home-btn" @click="$router.push('/message')">Guest</Button>
    <Button class="home-btn" @click="$router.push('/login')">Admin</Button>
  </div>
</template>


<style scoped lang="less">
  .home{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #515a6e;
    .home-btn{
      width: 90%;
      max-width: 350px;
      height: 49px;
      margin: 5% 0;
    }
  }
</style>
<script>
// @ is an alias to /src

export default {
  name: 'home',
  components: {
  }
}
</script>
