<template>
  <div id="app">
    <simon-game/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SimonGame from './components/SimonGame.vue';

export default Vue.extend({
  name: 'App',
  components: {
    SimonGame
  },
});
</script>

<style>
@import "@/styles/main.css";

#app {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
