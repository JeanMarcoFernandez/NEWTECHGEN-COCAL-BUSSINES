<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-96">
      <h2 class="text-center text-2xl font-bold mb-6 text-emerald-700">Crear Usuario</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- CORREO -->
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="Correo electrónico"
            class="input-field"
            :class="{ 'border-red-500': errores.email }"
          />
          <p v-if="errores.email" class="error-text">{{ errores.email }}</p>
        </div>

        <!-- CONTRASEÑA -->
        <div>
          <input
            v-model="password"
            type="password"
            placeholder="Contraseña temporal"
            class="input-field"
            :class="{ 'border-red-500': errores.password }"
          />
          <p v-if="errores.password" class="error-text">{{ errores.password }}</p>
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
import { createUser } from '../api/admin'; // asegúrate de tenerlo creado

const email = ref('');
const password = ref('');
const nombre = ref('');
const apellido = ref('');
const rol = ref('');
const errores = ref({});

const handleSubmit = async () => {
  errores.value = {};

  // Validación básica de campos
  if (!email.value) errores.value.email = 'El correo es obligatorio';
  if (!password.value) errores.value.password = 'La contraseña es obligatoria';
  if (!nombre.value) errores.value.nombre = 'El nombre es obligatorio';
  if (!apellido.value) errores.value.apellido = 'El apellido es obligatorio';
  if (!rol.value) errores.value.rol = 'Debe seleccionar un rol';

  if (Object.keys(errores.value).length > 0) return;

  try {
    const nuevoUsuario = {
      email: email.value,
      password: password.value,
      nombre: nombre.value,
      apellido: apellido.value,
      rol: rol.value
    };

    await createUser(nuevoUsuario);
    alert('Usuario creado correctamente ✅');

    // limpiar
    email.value = '';
    password.value = '';
    nombre.value = '';
    apellido.value = '';
    rol.value = '';
  } catch (error) {
    alert('Error al crear usuario ❌');
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
