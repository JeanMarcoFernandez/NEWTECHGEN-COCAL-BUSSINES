<template>
  <div class="usuario-container">
    <div class="usuario-card">
      <h1>Registro de Usuario</h1>
      <p class="subtitle">Crea la cuenta del usuario principal del sistema</p>

      <form class="usuario-form">
        <div class="form-row">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" placeholder="Ej: Jean" />
          </div>
          <div class="form-group">
            <label>Apellido</label>
            <input type="text" placeholder="Ej: Fernandez" />
          </div>
        </div>

        <div class="form-group">
          <label>Correo Electrónico</label>
          <input type="email" placeholder="Ej: jean@cocal.com" />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" placeholder="********" />
        </div>

        <div class="form-group">
          <label>Cargo</label>
          <input type="text" placeholder="Ej: Gerente General" />
        </div>

        <div class="form-group">
          <label>Teléfono</label>
          <input type="text" placeholder="Ej: +591 76543210" />
        </div>

        <div class="form-group">
          <label>Rol en el sistema</label>
          <select>
            <option>ADMIN</option>
            <option>SUPERVISOR</option>
            <option>EMPLEADO</option>
            <option>RRHH</option>
            <option>CLIENTE</option>
          </select>
        </div>

        <button class="btn-primary" @click.prevent="goNext">
          Crear Usuario
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "UsuarioRegistro",
  methods: {
    goNext() {
      // Simulación de avance (ya luego conectamos a API)
      this.$router.push("/calendario/tipo");
    },
  },
};
</script>

<style scoped>
@import "../assets/styles.css";

/* Ajustes adicionales solo para esta pantalla */
.usuario-card {
  max-width: 550px;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}
</style>
