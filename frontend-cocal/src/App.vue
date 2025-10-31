<template>
  <router-view />
  <TokenStatus />
</template>

<script setup>
import TokenStatus from './components/TokenStatus.vue'
</script>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
</style>
