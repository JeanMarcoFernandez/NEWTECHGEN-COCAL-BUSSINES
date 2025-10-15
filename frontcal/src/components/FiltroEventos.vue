<template>
  <div class="filtro-eventos">
    <h3>🔍 Filtrar Eventos</h3>

    <div class="filtro-grid">
      <div class="filtro-item">
        <label>Tipo</label>
        <select v-model="localFiltros.tipo">
          <option value="TODOS">Todos</option>
          <option value="REUNION">Reunión</option>
          <option value="CAPACITACION">Capacitación</option>
          <option value="PROYECTO">Proyecto</option>
          <option value="REVISION">Revisión</option>
        </select>
      </div>

      <div class="filtro-item">
        <label>Área</label>
        <select v-model="localFiltros.area">
          <option value="TODAS">Todas</option>
          <option value="GERENCIA">Gerencia</option>
          <option value="CONTABILIDAD">Contabilidad</option>
          <option value="RECURSOS_HUMANOS">Recursos Humanos</option>
          <option value="SISTEMAS">Sistemas</option>
          <option value="MARKETING">Marketing</option>
          <option value="PRODUCCION">Producción</option>
        </select>
      </div>

      <div class="filtro-item">
        <label>Visibilidad</label>
        <select v-model="localFiltros.visibilidad">
          <option value="TODOS">Todos</option>
          <option value="PUBLICO">Público</option>
          <option value="INTERNO">Interno</option>
          <option value="PRIVADO">Privado</option>
        </select>
      </div>

      <div class="filtro-boton">
        <button @click="emitirFiltros">Aplicar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FiltroEventos",
  props: {
    filtros: Object,
  },
  data() {
    return {
      localFiltros: { ...this.filtros },
    };
  },
  methods: {
    emitirFiltros() {
      this.$emit("filtrar", this.localFiltros);
    },
  },
};
</script>

<style scoped>
.filtro-eventos {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  color: #fff;
}

.filtro-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.filtro-item {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 150px;
}

.filtro-item label {
  font-size: 0.9rem;
  color: #ddd;
  margin-bottom: 0.3rem;
}

select {
  padding: 0.4rem;
  border-radius: 6px;
  border: none;
  background: #1b263b;
  color: #fff;
}

button {
  padding: 0.6rem 1.2rem;
  background: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  color: #fff;
}

button:hover {
  background: #339cff;
}
</style>
