<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-blue-700 mb-6">🔐 Verificación en dos pasos</h2>

      <p class="text-gray-600 text-center mb-4">
        Hemos enviado un código de verificación a tu correo electrónico:
        <span class="font-semibold">{{ correo }}</span>
      </p>

      <form @submit.prevent="verificarCodigo">
        <input
          v-model="codigo"
          type="text"
          maxlength="6"
          placeholder="Ingresa tu código de 6 dígitos"
          class="w-full text-center text-xl tracking-widest border border-gray-300 rounded-lg py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          :disabled="cargando"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {{ cargando ? "Verificando..." : "Verificar Código" }}
        </button>
      </form>

      <p v-if="mensaje" :class="mensajeError ? 'text-red-600' : 'text-green-600'" class="text-center mt-4 font-medium">
        {{ mensaje }}
      </p>

      <div class="text-center mt-6">
        <button @click="reenviarCodigo" class="text-blue-600 hover:underline">
          Reenviar código 🔁
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { verificar2FA, reenviar2FA } from "../api/auth.js";

const route = useRoute();
const router = useRouter();

const correo = route.query.correo || "";
const usuario_id = route.query.usuario_id || "";
const nombre = route.query.nombre || "";

const codigo = ref("");
const mensaje = ref("");
const mensajeError = ref(false);
const cargando = ref(false);

async function verificarCodigo() {
  if (!codigo.value || codigo.value.length !== 6) {
    mensaje.value = "Por favor, ingresa un código válido de 6 dígitos.";
    mensajeError.value = true;
    return;
  }

  cargando.value = true;
  try {
    const { data } = await verificar2FA(correo, codigo.value);
    mensaje.value = "✅ Verificación exitosa. Redirigiendo...";
    mensajeError.value = false;
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    setTimeout(() => router.push("/pagina-principal"), 1500);
  } catch (err) {
    mensaje.value = err.response?.data?.message || "Error al verificar el código.";
    mensajeError.value = true;
  } finally {
    cargando.value = false;
  }
}

async function reenviarCodigo() {
  try {
    await reenviar2FA(usuario_id, correo, nombre);
    mensaje.value = "Nuevo código enviado al correo.";
    mensajeError.value = false;
  } catch (err) {
    mensaje.value = "No se pudo reenviar el código.";
    mensajeError.value = true;
  }
}
</script>
