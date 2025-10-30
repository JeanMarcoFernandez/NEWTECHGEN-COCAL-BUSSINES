<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-96">
      <h2 class="text-center text-xl font-bold mb-6 text-gray-800">Cambiar contraseña</h2>

      <form @submit.prevent="handleChange" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Nueva contraseña</label>
          <input
            v-model="nuevaContrasena"
            type="password"
            placeholder="********"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.nuevaContrasena }"
          />
          <p v-if="errores.nuevaContrasena" class="error-text">{{ errores.nuevaContrasena }}</p>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Confirmar contraseña</label>
          <input
            v-model="confirmarContrasena"
            type="password"
            placeholder="********"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.confirmarContrasena }"
          />
          <p v-if="errores.confirmarContrasena" class="error-text">{{ errores.confirmarContrasena }}</p>
        </div>

        <button
          type="submit"
          class="w-full bg-green-600 text-white font-semibold py-2 rounded-lg mt-2 hover:bg-green-700 transition duration-200 shadow-sm"
        >
          Guardar nueva contraseña
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { changePassword } from '../api/auth';

const nuevaContrasena = ref('');
const confirmarContrasena = ref('');
const errores = ref({});

const handleChange = async () => {
  errores.value = {};

  if (!nuevaContrasena.value) errores.value.nuevaContrasena = 'La contraseña es obligatoria';
  if (!confirmarContrasena.value) errores.value.confirmarContrasena = 'Confirma tu contraseña';
  if (nuevaContrasena.value !== confirmarContrasena.value)
    errores.value.confirmarContrasena = 'Las contraseñas no coinciden';

  if (Object.keys(errores.value).length > 0) return;

  try {
    await changePassword({ nuevaContrasena: nuevaContrasena.value });
    alert('Contraseña cambiada exitosamente ✅');
    nuevaContrasena.value = confirmarContrasena.value = '';
  } catch (err) {
    alert('Error al cambiar contraseña ❌');
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
