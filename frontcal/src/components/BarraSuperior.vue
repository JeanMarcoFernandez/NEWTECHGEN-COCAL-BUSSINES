<template>
  <header class="top-bar">
    <h2>{{ title }}</h2>
    <div>
      <button class="btn btn-primary" @click="$router.push('/calendario/grupo')">Grupo</button>
      <button class="btn btn-danger" @click="$router.push('/login')">Cerrar Sesión</button>
    </div>
  </header>
</template>

<script>
export default {
  props: ["title"],
};
</script>

<style scoped>
.top-bar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  color: white;
  z-index: 100;
}
</style>
