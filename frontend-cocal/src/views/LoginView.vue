<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-80">
      <h2 class="text-center text-xl font-bold mb-6 text-gray-800">Iniciar sesión</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
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

        <!-- CONTRASEÑA -->
        <div>
          <label class="flex items-center justify-between text-gray-700 font-medium mb-1">
            <span>Contraseña</span>
            <button
              type="button"
              @click="togglePassword"
              class="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
            >
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

        <!-- MENSAJES -->
        <p v-if="mensaje" class="text-sm text-center mt-2 text-gray-700">{{ mensaje }}</p>
        <p v-if="intentosRestantes !== null" class="text-sm text-center text-red-500">
          Intentos restantes: {{ intentosRestantes }}
        </p>

        <!-- BOTÓN -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg mt-2 hover:bg-blue-700 transition duration-200 shadow-sm"
        >
          Entrar
        </button>
      </form>

      <!-- LINKS -->
      <div class="text-center mt-4 text-sm">
        <router-link to="/register" class="text-blue-600 hover:underline">Crear cuenta</router-link>
        <br />
        <router-link to="/reset-password" class="text-gray-500 hover:underline">¿Olvidaste tu contraseña?</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/auth'

const router = useRouter()

const correo = ref('')
const contrasena = ref('')
const errores = ref({})
const mostrarPassword = ref(false)
const mensaje = ref('')
const intentosRestantes = ref(null)

const togglePassword = () => {
  mostrarPassword.value = !mostrarPassword.value
}

const handleLogin = async () => {
  errores.value = {}
  mensaje.value = ''
  intentosRestantes.value = null

  // Validaciones básicas
  if (!correo.value) errores.value.correo = 'El correo es obligatorio'
  if (!contrasena.value) errores.value.contrasena = 'La contraseña es obligatoria'
  if (Object.keys(errores.value).length > 0) return

  try {
    const { data } = await login({ correo: correo.value, contrasena: contrasena.value })

    // 🔹 Caso: requiere 2FA
    if (data.requiere2FA) {
      router.push({
        path: '/verificar-2fa',
        query: {
          correo: data.correo,
          usuario_id: data.usuario_id,
          nombre: data.nombre
        }
      })
      return
    }

    // 🔹 Caso: primer login (debe cambiar contraseña)
    if (data.requerirCambio) {
      alert('Debe cambiar su contraseña antes de continuar 🔒')
      localStorage.setItem('correo_cambio', correo.value)
      router.push('/password/primer-login')
      return
    }

    // 🔹 Caso: login normal
    localStorage.setItem('token', data.token)
    localStorage.setItem('rol', data.usuario.rol)
    localStorage.setItem('usuario', JSON.stringify(data.usuario))
    alert('Inicio de sesión exitoso ✅')
    router.push('/pagina-principal')

  } catch (err) {
    const res = err.response?.data
    console.error('Error al iniciar sesión:', res || err)

    // Mensajes de error
    mensaje.value = res?.message || 'Error al iniciar sesión ❌'

    if (res?.intentos_restantes !== undefined) {
      intentosRestantes.value = res.intentos_restantes
    }

    // Bloqueo
    if (res?.bloqueado_hasta) {
      mensaje.value = `Cuenta bloqueada hasta ${new Date(res.bloqueado_hasta).toLocaleString()}`
    }

    // Alerta adicional
    if (res?.message?.includes('bloqueada')) {
      alert('⚠️ Tu cuenta está bloqueada temporalmente.')
    }
  }
}
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
