<template>
  <div class="tipo-container">
    <div class="tipo-header">
      <h1>Selecciona tu tipo de Calendario</h1>
      <p class="subtitle">
        Elige si deseas crear un calendario personal o uno de grupo
      </p>
    </div>

    <div class="tipo-options">
      <div class="card-option" @click="goPersonal">
        <div class="icon">👤</div>
        <h2>Calendario Personal</h2>
        <p>
          Ideal para gestionar tus tareas, reuniones y recordatorios
          individuales.
        </p>
      </div>

      <div class="card-option" @click="goGrupo">
        <div class="icon">👥</div>
        <h2>Calendario de Grupo</h2>
        <p>
          Colabora con tu equipo, coordina proyectos y visualiza eventos del
          departamento.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TipoCalendario",
  methods: {
    goPersonal() {
      this.$router.push("/calendario/personal");
    },
    goGrupo() {
      this.$router.push("/calendario/grupo");
    },
  },
};
</script>

<style scoped>
@import "../assets/styles.css";

/* ======== ESTILO PERSONALIZADO ======== */

.tipo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
}

.tipo-header {
  margin-bottom: 3rem;
}

.tipo-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.card-option {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 280px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 123, 255, 0.3);
}

.card-option h2 {
  margin-top: 1rem;
  color: #007bff;
}

.card-option p {
  color: #555;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

.icon {
  font-size: 3rem;
}
</style>
