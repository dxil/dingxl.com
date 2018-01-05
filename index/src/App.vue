<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  * {
    box-sizing: border-box;
  }
  html,body {
    overflow:hidden;
    overflow-y:auto;
  }
  #app {
    height: 100%;
  }
</style>
