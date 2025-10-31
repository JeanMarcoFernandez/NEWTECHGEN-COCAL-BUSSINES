<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">
        ¡Bienvenido a la página principal! 🎉
      </h1>
      <p class="text-gray-600 mb-6">
        Has iniciado sesión correctamente.
      </p>

      <button
        @click="logout"
        class="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 shadow-sm"
      >
        Cerrar sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  // 🧹 Eliminar token del almacenamiento local
  localStorage.removeItem('token');

  // 🔁 Redirigir al login
  router.push('/login');
};
</script>
