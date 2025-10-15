<template>
  <div id="app">
    <nav>
      <router-link to="/empresas">Empresas</router-link> |
      <router-link to="/departamentos">Departamentos</router-link> |
      <router-link to="/usuarios">Usuarios</router-link> |
      <router-link to="/login">Login</router-link>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
// No necesitamos lógica aún
</script>

<style scoped>
nav {
  background: #222;
  padding: 10px;
}
nav a {
  color: white;
  margin: 0 10px;
  text-decoration: none;
}
nav a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
