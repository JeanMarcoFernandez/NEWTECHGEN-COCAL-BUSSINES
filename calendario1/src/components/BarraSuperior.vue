<template>
  <header class="barra">
    <div class="logo">🗓️</div>
    <h1>{{ title }}</h1>
  </header>
</template>

<script>
export default { props: { title: String } };
</script>

<style scoped>
.barra {
  position: fixed;
  top: 0;
  width: 100%;
  height: 65px;
  background: linear-gradient(90deg, #1e3a8a, #2563eb);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0 2rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
  z-index: 999;
}

.logo {
  font-size: 1.6rem;
}

h1 {
  font-size: 1.4rem;
  font-weight: 600;
}
</style>
