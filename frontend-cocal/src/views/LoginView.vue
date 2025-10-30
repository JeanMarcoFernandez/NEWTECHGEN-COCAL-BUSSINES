<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-80">
      <h2 class="text-center text-xl font-bold mb-6 text-gray-800">Iniciar sesión</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- CORREO -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            placeholder="usuario@correo.com"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.email }"
          />
          <p v-if="errores.email" class="error-text">{{ errores.email }}</p>
        </div>

        <!-- CONTRASEÑA -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Contraseña</label>
          <input
            v-model="password"
            type="password"
            placeholder="********"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.password }"
          />
          <p v-if="errores.password" class="error-text">{{ errores.password }}</p>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg mt-2 hover:bg-blue-700 transition duration-200 shadow-sm"
        >
          Entrar
        </button>
      </form>

      <div class="text-center mt-4 text-sm">
        <router-link to="/register" class="text-blue-600 hover:underline">Crear cuenta</router-link>
        <br />
        <router-link to="/reset" class="text-gray-500 hover:underline">¿Olvidaste tu contraseña?</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { login } from '../api/auth';

const email = ref('');
const password = ref('');
const errores = ref({});

const handleLogin = async () => {
  errores.value = {};

  if (!email.value) errores.value.email = 'El correo es obligatorio';
  if (!password.value) errores.value.password = 'La contraseña es obligatoria';
  if (Object.keys(errores.value).length > 0) return;

  try {
    const { data } = await login({ email: email.value, password: password.value });
    alert('Inicio de sesión exitoso ✅');
    console.log('Token:', data.token);
  } catch (err) {
    alert('Error al iniciar sesión ❌');
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
