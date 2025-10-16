<template>
  <div class="filtros">
    <select v-model="f.tipo">
      <option value="TODOS">Todos</option>
      <option value="REUNION">Reunión</option>
      <option value="CAPACITACION">Capacitación</option>
    </select>
    <select v-model="f.area">
      <option value="TODAS">Todas</option>
      <option value="GERENCIA">Gerencia</option>
      <option value="RECURSOS_HUMANOS">RRHH</option>
    </select>
    <select v-model="f.visibilidad">
      <option value="TODOS">Todos</option>
      <option value="INTERNO">Interno</option>
      <option value="PUBLICO">Público</option>
    </select>
    <button @click="$emit('filtrar', f)">Aplicar</button>
  </div>
</template>

<script>
export default {
  data() {
    return { f: { tipo: "TODOS", area: "TODAS", visibilidad: "TODOS" } };
  },
};
</script>

<style scoped>
.filtros {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
