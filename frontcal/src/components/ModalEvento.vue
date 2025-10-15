<template>
  <div class="overlay" @click.self="cerrar">
    <div class="modal">
      <h3>Nuevo Evento</h3>
      <form @submit.prevent="guardar">
        <input v-model="evento.title" placeholder="Título" required />
        <select v-model="evento.tipo">
          <option>REUNION</option>
          <option>PROYECTO</option>
          <option>CAPACITACION</option>
          <option>REVISION</option>
        </select>
        <input type="datetime-local" v-model="evento.start" />
        <input type="datetime-local" v-model="evento.end" />
        <button class="btn btn-primary" type="submit">Guardar</button>
        <button class="btn btn-danger" type="button" @click="cerrar">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ["evento"],
  emits: ["guardar", "cerrar"],
  methods: {
    guardar() {
      this.$emit("guardar", this.evento);
    },
    cerrar() {
      this.$emit("cerrar");
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
