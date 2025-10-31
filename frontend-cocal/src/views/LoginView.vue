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
          <label class="flex items-center gap-1 text-gray-700 font-medium mb-1">
            <span>Contraseña</span>
            <button
              type="button"
              @click="togglePassword"
              class="inline-flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
              style="width: 20px; height: 20px;"
            >
              <svg v-if="!mostrarPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.643-4.362m3.09-1.939A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.969 9.969 0 01-4.102 5.292M15 12a3 3 0 00-3-3m0 0a3 3 0 013 3m-3-3L3 3"/>
              </svg>
            </button>
          </label>

          <input
            :type="mostrarPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="********"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.password }"
          />
          <p v-if="errores.password" class="error-text">{{ errores.password }}</p>
        </div>

        <!-- MENSAJE DE LOGIN -->
        <div v-if="errores.login" class="text-red-500 text-sm mt-1">{{ errores.login }}</div>
        <div v-if="intentosRestantes !== null && intentosRestantes > 0" class="text-red-500 text-sm mt-1">
          Intentos restantes: {{ intentosRestantes }}
        </div>
        <div v-if="bloqueadoHasta" class="text-red-600 text-sm mt-1">
          Cuenta bloqueada hasta {{ bloqueadoHasta }}
        </div>

        <!-- BOTÓN DE ENTRAR -->
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
import { useRouter } from 'vue-router';
import { login } from '../api/auth';

const router = useRouter();

const email = ref('');
const password = ref('');
const errores = ref({});
const mostrarPassword = ref(false);
const intentosRestantes = ref(null);
const bloqueadoHasta = ref(null);

const togglePassword = () => {
  mostrarPassword.value = !mostrarPassword.value;
};

const handleLogin = async () => {
  errores.value = {};
  intentosRestantes.value = null;
  bloqueadoHasta.value = null;

  if (!email.value) errores.value.email = 'El correo es obligatorio';
  if (!password.value) errores.value.password = 'La contraseña es obligatoria';
  if (Object.keys(errores.value).length > 0) return;

  try {
    const { data } = await login({ email: email.value, password: password.value });
    localStorage.setItem('token', data.token);
    router.push('/paginaprincipal');
  } catch (err) {
    const response = err.response?.data;
    errores.value.login = response?.message || 'Error al iniciar sesión ❌';
    if (response?.intentos_restantes !== undefined) {
      intentosRestantes.value = response.intentos_restantes;
    }
    if (response?.bloqueado_hasta) {
      bloqueadoHasta.value = new Date(response.bloqueado_hasta).toLocaleString();
    }
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
