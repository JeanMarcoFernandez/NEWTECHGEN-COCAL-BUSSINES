<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-80">
      <h2 class="text-center text-xl font-bold mb-6 text-gray-800">Restablecer contraseña</h2>

      <form @submit.prevent="handleReset" class="space-y-4">
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

        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg mt-2 hover:bg-blue-700 transition duration-200 shadow-sm"
        >
          Enviar enlace de restablecimiento
        </button>
      </form>

      <div class="text-center mt-4 text-sm">
        <router-link to="/login" class="text-blue-600 hover:underline">Volver al inicio</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { resetPassword } from '../api/auth';

const correo = ref('');
const errores = ref({});

const handleReset = async () => {
  errores.value = {};
  if (!correo.value) {
    errores.value.correo = 'El correo es obligatorio';
    return;
  }

  try {
    await resetPassword({ correo: correo.value });
    alert('Se envió un enlace para restablecer tu contraseña ✅');
    correo.value = '';
  } catch (err) {
    alert('Error al enviar el correo ❌');
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
