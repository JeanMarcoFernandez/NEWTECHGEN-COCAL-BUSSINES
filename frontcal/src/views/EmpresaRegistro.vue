<template>
  <div class="empresa-container">
    <!-- 🔹 Barra superior -->
    <header class="top-bar">
      <div class="logo">
        <span class="logo-icon">🏢</span>
        <span class="logo-text">Cocal Business</span>
      </div>

      <button class="btn-login" @click="$router.push('/login')">
        <span>🔒</span> Iniciar sesión
      </button>
    </header>

    <!-- 🔹 Contenedor del formulario -->
    <div class="empresa-card">
      <h1>Registro de Empresa</h1>
      <p class="subtitle">Completa la información básica de tu empresa</p>

      <form class="empresa-form">
        <div class="form-grid">
          <div class="form-group">
            <label>Nombre de la Empresa</label>
            <input type="text" placeholder="Ej: Cocal Business S.R.L." />
          </div>

          <div class="form-group">
            <label>NIT</label>
            <input type="text" placeholder="Ej: 12345678" />
          </div>

          <div class="form-group">
            <label>Rubro</label>
            <input type="text" placeholder="Ej: Tecnología, Servicios..." />
          </div>

          <div class="form-group">
            <label>Dirección</label>
            <input type="text" placeholder="Ej: Av. Busch #1234" />
          </div>

          <div class="form-group">
            <label>Teléfono</label>
            <input type="text" placeholder="Ej: +591 76543210" />
          </div>

          <div class="form-group">
            <label>Sitio Web</label>
            <input type="text" placeholder="Ej: https://miempresa.com" />
          </div>
        </div>

        <button class="btn-primary" @click.prevent="goNext">
          Registrar Empresa
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmpresaRegistro",
  methods: {
    goNext() {
      this.$router.push("/usuario");
    },
  },
};
</script>

<style scoped>
/* 🔹 Fondo general */
.empresa-container {
  background: linear-gradient(135deg, #0d1b2a, #1b263b);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 🔹 Barra superior */
.top-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
}

.logo-icon {
  font-size: 1.5rem;
}

.btn-login {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

/* 🔹 Tarjeta principal */
.empresa-card {
  background: white;
  margin-top: 8rem;
  padding: 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 700px;
  text-align: center;
}

h1 {
  color: #0d1b2a;
  margin-bottom: 0.4rem;
  font-size: 1.9rem;
}

.subtitle {
  color: #6c757d;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.form-group {
  text-align: left;
}

label {
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 0.3rem;
}

input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: all 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.4);
}

/* 🔹 Botón principal */
.btn-primary {
  margin-top: 2rem;
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #007bff, #0099ff);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(90deg, #006ae0, #0085e0);
  transform: translateY(-1px);
}
</style>
