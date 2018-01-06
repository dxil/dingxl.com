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
    height: 100%;
  }
  #app {
    height: 100%;
    background-color: #f5f5f5;
  }
</style>
