<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-96">
      <h2 class="text-center text-2xl font-bold mb-6 text-emerald-700">Crear Usuario</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- CORREO -->
        <div>
          <input
            v-model="correo"
            type="email"
            placeholder="Correo electrónico"
            class="input-field"
            :class="{ 'border-red-500': errores.correo }"
          />
          <p v-if="errores.correo" class="error-text">{{ errores.correo }}</p>
        </div>

        <!-- CONTRASEÑA -->
        <div>
          <input
            v-model="contrasena"
            type="password"
            placeholder="Contraseña temporal"
            class="input-field"
            :class="{ 'border-red-500': errores.contrasena }"
          />
          <p v-if="errores.contrasena" class="error-text">{{ errores.contrasena }}</p>
        </div>

        <!-- NOMBRE -->
        <div>
          <input
            v-model="nombre"
            type="text"
            placeholder="Nombre"
            class="input-field"
            :class="{ 'border-red-500': errores.nombre }"
          />
          <p v-if="errores.nombre" class="error-text">{{ errores.nombre }}</p>
        </div>

        <!-- APELLIDO -->
        <div>
          <input
            v-model="apellido"
            type="text"
            placeholder="Apellido"
            class="input-field"
            :class="{ 'border-red-500': errores.apellido }"
          />
          <p v-if="errores.apellido" class="error-text">{{ errores.apellido }}</p>
        </div>

        <!-- CARGO -->
        <div>
          <input
            v-model="cargo"
            type="text"
            placeholder="Cargo"
            class="input-field"
            :class="{ 'border-red-500': errores.cargo }"
          />
          <p v-if="errores.cargo" class="error-text">{{ errores.cargo }}</p>
        </div>

        <!-- ROL -->
        <div>
          <select
            v-model="rol"
            class="input-field"
            :class="{ 'border-red-500': errores.rol }"
          >
            <option disabled value="">Seleccionar rol</option>
            <option value="ADMIN">ADMIN</option>
            <option value="EMPLEADO">EMPLEADO</option>
          </select>
          <p v-if="errores.rol" class="error-text">{{ errores.rol }}</p>
        </div>

        <!-- TELEFONO -->
        <div>
          <input
            v-model="telefono"
            type="text"
            placeholder="Teléfono"
            class="input-field"
            :class="{ 'border-red-500': errores.telefono }"
          />
          <p v-if="errores.telefono" class="error-text">{{ errores.telefono }}</p>
        </div>

        <!-- BOTÓN -->
        <button
          type="submit"
          class="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-semibold shadow-sm"
        >
          Crear cuenta
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createUser } from '../api/admin'; // tu función axios para el POST

const correo = ref('');
const contrasena = ref('');
const nombre = ref('');
const apellido = ref('');
const cargo = ref('');
const rol = ref('');
const telefono = ref('');
const errores = ref({});

const handleSubmit = async () => {
  errores.value = {};

  if (!correo.value) errores.value.correo = 'El correo es obligatorio';
  if (!contrasena.value) errores.value.contrasena = 'La contraseña es obligatoria';
  if (!nombre.value) errores.value.nombre = 'El nombre es obligatorio';
  if (!apellido.value) errores.value.apellido = 'El apellido es obligatorio';
  if (!cargo.value) errores.value.cargo = 'El cargo es obligatorio';
  if (!rol.value) errores.value.rol = 'Debe seleccionar un rol';
  if (!telefono.value) errores.value.telefono = 'El teléfono es obligatorio';

  if (Object.keys(errores.value).length > 0) return;

  try {
    const nuevoUsuario = {
      correo: correo.value,
      contrasena: contrasena.value,
      nombre: nombre.value,
      apellido: apellido.value,
      cargo: cargo.value,
      rol: rol.value,
      telefono: telefono.value,
    };

    await createUser(nuevoUsuario);

    alert('Usuario creado correctamente ');

    // Limpiar campos
    correo.value = '';
    contrasena.value = '';
    nombre.value = '';
    apellido.value = '';
    cargo.value = '';
    rol.value = '';
    telefono.value = '';
  } catch (error) {
    alert(error.response?.data?.mensaje || 'Error al crear usuario ❌');
  }
};
</script>

<style scoped>
.input-field {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.input-field:focus {
  outline: none;
  border-color: #34d399;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
}
.error-text {
  color: #dc2626;
  font-size: 12px;
  font-weight: 500;
  font-style: italic;
  margin-top: 3px;
  margin-left: 3px;
}
</style>
