<template>
  <div class="modal">
    <div class="contenido">
      <h3>Nuevo evento</h3>
      <input v-model="eventoLocal.title" placeholder="Título" />
      <input v-model="eventoLocal.start" type="datetime-local" />
      <input v-model="eventoLocal.end" type="datetime-local" />
      <button @click="$emit('guardar', eventoLocal)">Guardar</button>
      <button @click="$emit('cerrar')">Cerrar</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["evento"],
  data() {
    return { eventoLocal: { ...this.evento } };
  },
};
</script>

<style scoped>
.modal {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center;
}
.contenido {
  background: white;
  color: black;
  padding: 1rem;
  border-radius: 10px;
}
</style>
