<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Crear Cuenta</h2>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- NOMBRE -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Nombre</label>
          <input
            v-model="nombre"
            type="text"
            placeholder="Tu nombre"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.nombre }"
          />
          <p v-if="errores.nombre" class="error-text">{{ errores.nombre }}</p>
        </div>

        <!-- APELLIDO -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Apellido</label>
          <input
            v-model="apellido"
            type="text"
            placeholder="Tu apellido"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.apellido }"
          />
          <p v-if="errores.apellido" class="error-text">{{ errores.apellido }}</p>
        </div>

        <!-- CORREO -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Correo electrónico</label>
          <input
            v-model="correo"
            type="email"
            placeholder="usuario@correo.com"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.correo }"
          />
          <p v-if="errores.correo" class="error-text">{{ errores.correo }}</p>
        </div>

        <!-- TELÉFONO -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Teléfono</label>
          <input
            v-model="telefono"
            type="text"
            placeholder="78123457"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.telefono }"
          />
          <p v-if="errores.telefono" class="error-text">{{ errores.telefono }}</p>
        </div>

        <!-- CARGO -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Cargo</label>
          <input
            v-model="cargo"
            type="text"
            placeholder="Gerente, Analista, etc."
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.cargo }"
          />
          <p v-if="errores.cargo" class="error-text">{{ errores.cargo }}</p>
        </div>

        <!-- CONTRASEÑA -->
        <div>
          <label class="flex items-center justify-between text-gray-700 font-medium mb-1">
            <span>Contraseña</span>
            <button type="button" @click="togglePassword" class="text-sm text-gray-500 hover:text-gray-700 focus:outline-none">
              {{ mostrarPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
          </label>
          <input
            :type="mostrarPassword ? 'text' : 'password'"
            v-model="contrasena"
            placeholder="********"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.contrasena }"
          />
          <p v-if="errores.contrasena" class="error-text">{{ errores.contrasena }}</p>
        </div>

        <!-- BOTÓN DE REGISTRO -->
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-sm"
        >
          Registrarse
        </button>
      </form>

      <div class="text-center mt-5 text-sm">
        <router-link to="/login" class="text-blue-600 hover:underline">Ya tengo una cuenta</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../api/auth';

const router = useRouter();

const nombre = ref('');
const apellido = ref('');
const correo = ref('');
const telefono = ref('');
const cargo = ref('');
const contrasena = ref('');
const mostrarPassword = ref(false);
const errores = ref({});

const togglePassword = () => {
  mostrarPassword.value = !mostrarPassword.value;
};

const handleRegister = async () => {
  errores.value = {};

  if (!nombre.value) errores.value.nombre = 'El nombre es obligatorio';
  if (!apellido.value) errores.value.apellido = 'El apellido es obligatorio';
  if (!correo.value) errores.value.correo = 'El correo es obligatorio';
  if (!telefono.value) errores.value.telefono = 'El teléfono es obligatorio';
  if (!cargo.value) errores.value.cargo = 'El cargo es obligatorio';
  if (!contrasena.value) errores.value.contrasena = 'La contraseña es obligatoria';

  if (Object.keys(errores.value).length > 0) return;

  try {
    await register({
      nombre: nombre.value,
      apellido: apellido.value,
      correo: correo.value,
      telefono: telefono.value,
      cargo: cargo.value,
      contrasena: contrasena.value
    });

    alert('Registro exitoso');
    // limpiar campos
    nombre.value = '';
    apellido.value = '';
    correo.value = '';
    telefono.value = '';
    cargo.value = '';
    contrasena.value = '';
    // redirigir a login
    router.push('/login');
  } catch (err) {
    const msg = err.response?.data?.message || 'Error al registrarse ❌';
    alert(msg);
  }
};
</script>

<style scoped>
.error-text {
  color: #e53e3e;
  font-size: 12px;
  font-style: italic;
  font-weight: 500;
  margin-top: 4px;
  margin-left: 4px;
}
</style>
