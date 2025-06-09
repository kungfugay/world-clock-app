<template>
  <div id="app">
    <WorldClock />
  </div>
</template>

<script setup lang="ts">
import WorldClock from './components/WorldClock.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  min-height: 100vh;
  padding: 20px 0;
}
</style>