<template>
  <div class="empresa-container">
    <div class="empresa-card">
      <h1>Registro de Empresa</h1>
      <p class="subtitle">Por favor, completa los datos de tu empresa</p>

      <form class="empresa-form">
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
      // simulamos avance al siguiente paso
      this.$router.push("/usuario");
    },
  },
};
</script>

<style scoped>
@import "../assets/styles.css";
</style>
