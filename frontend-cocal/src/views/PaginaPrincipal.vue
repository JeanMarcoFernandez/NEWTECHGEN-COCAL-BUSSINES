<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">
        ¡Bienvenido a la página principal! 🎉
      </h1>
      <p class="text-gray-600 mb-6">
        Has iniciado sesión correctamente.
      </p>

      <!-- Botón solo para ADMIN -->
      <button
        v-if="rol === 'ADMIN'"
        @click="goToCreateUser"
        class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm mb-4"
      >
        Crear Usuario
      </button>

      <!-- Botón de logout -->
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const rol = ref(null);

onMounted(() => {
  // Leer rol desde localStorage
  rol.value = localStorage.getItem('rol');
  console.log(rol.value)

  // Si no hay token, redirigir al login
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
  }
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('rol'); // Limpiar rol
  router.push('/login');
};

const goToCreateUser = () => {
  router.push('/create-user');
};
</script>
