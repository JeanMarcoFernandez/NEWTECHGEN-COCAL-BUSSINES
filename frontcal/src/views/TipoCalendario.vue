<template>
  <div class="tipo-container">
    <header class="tipo-header">
      <h1>Selecciona tu tipo de Calendario</h1>
      <p class="subtitle">
        Elige si deseas crear un calendario <strong>personal</strong> o <strong>de grupo</strong>.
      </p>
    </header>

    <section class="tipo-options">
      <div class="card-option" @click="goPersonal">
        <div class="icon">👤</div>
        <h2>Calendario Personal</h2>
        <p>
          Administra tus tareas, eventos y recordatorios personales en un entorno organizado.
        </p>
      </div>

      <div class="card-option" @click="goGrupo">
        <div class="icon">👥</div>
        <h2>Calendario de Grupo</h2>
        <p>
          Coordina proyectos y eventos con tu equipo o departamento de forma colaborativa.
        </p>
      </div>
    </section>
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
      alert("🧩 Próximamente: Calendario de grupo (Sprint 5).");
    },
  },
};
</script>

<style scoped>
@import "../assets/styles.css";

/* === Contenedor general === */
.tipo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  background: linear-gradient(135deg, #0d1b2a, #1b263b);
  color: white;
  padding: 2rem;
}

/* === Encabezado === */
.tipo-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #d1d5db;
  font-size: 1rem;
  margin-bottom: 2rem;
}

/* === Tarjetas de opciones === */
.tipo-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.card-option {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2.2rem;
  width: 300px;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  cursor: pointer;
}

.card-option:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 8px 30px rgba(0, 153, 255, 0.5);
}

.icon {
  font-size: 3rem;
}

.card-option h2 {
  color: #00b0ff;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
}

.card-option p {
  color: #e0e0e0;
  font-size: 0.95rem;
  line-height: 1.4;
}

/* === Responsive === */
@media (max-width: 768px) {
  .tipo-options {
    flex-direction: column;
  }
}
</style>
