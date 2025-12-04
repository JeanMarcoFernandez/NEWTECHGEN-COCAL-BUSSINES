<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-96">
      <h2 class="text-center text-xl font-bold mb-6 text-gray-800">
         Restablecer contraseña
      </h2>

      <form @submit.prevent="restablecer" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Nueva contraseña</label>
          <input
            v-model="nuevaContrasena"
            type="password"
            placeholder="********"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg mt-2 hover:bg-blue-700 transition duration-200 shadow-sm"
          :disabled="cargando"
        >
          {{ cargando ? "Actualizando..." : "Guardar nueva contraseña" }}
        </button>
      </form>

      <p
        v-if="mensaje"
        :class="mensajeError ? 'text-red-500' : 'text-green-600'"
        class="mt-4 text-center font-medium"
      >
        {{ mensaje }}
      </p>

      <div class="text-center mt-4">
        <router-link to="/login" class="text-blue-600 hover:underline text-sm">
          ← Volver al inicio de sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { restablecerContrasena } from "../api/auth.js";

const route = useRoute();
const router = useRouter();

const token = route.params.token;
const nuevaContrasena = ref("");
const mensaje = ref("");
const mensajeError = ref(false);
const cargando = ref(false);

async function restablecer() {
  if (!nuevaContrasena.value) {
    mensaje.value = "Por favor ingresa una nueva contraseña.";
    mensajeError.value = true;
    return;
  }

  cargando.value = true;
  try {
    const { data } = await restablecerContrasena(token, nuevaContrasena.value);
    mensaje.value = data.message;
    mensajeError.value = false;
    setTimeout(() => router.push("/login"), 2000);
  } catch (err) {
    mensaje.value = err.response?.data?.message || "Error al restablecer contraseña.";
    mensajeError.value = true;
  } finally {
    cargando.value = false;
  }
}
</script>
