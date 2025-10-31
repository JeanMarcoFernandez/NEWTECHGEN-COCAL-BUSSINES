<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-96">
      <h2 class="text-center text-xl font-bold mb-3 text-gray-800">
        Cambiar contraseña
      </h2>

      <!-- 🔹 Mostrar el correo del usuario -->
      <p v-if="correo" class="text-center text-sm text-gray-700 mb-2">
        <strong>Correo asociado:</strong> {{ correo }}
      </p>

      <p class="text-sm text-gray-600 text-center mb-6">
        Por motivos de seguridad, debes cambiar tu contraseña antes de continuar.
      </p>

      <form @submit.prevent="handleChange" class="space-y-4">
        <!-- NUEVA CONTRASEÑA -->
        <div>
          <label class="flex items-center justify-between text-gray-700 font-medium mb-1">
            <span>Nueva contraseña</span>
            <button
              type="button"
              @click="mostrarNueva = !mostrarNueva"
              class="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {{ mostrarNueva ? 'Ocultar' : 'Mostrar' }}
            </button>
          </label>

          <input
            :type="mostrarNueva ? 'text' : 'password'"
            v-model="nuevaContrasena"
            placeholder="********"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.nuevaContrasena }"
          />
          <p v-if="errores.nuevaContrasena" class="error-text">
            {{ errores.nuevaContrasena }}
          </p>
        </div>

        <!-- CONFIRMAR CONTRASEÑA -->
        <div>
          <label class="flex items-center justify-between text-gray-700 font-medium mb-1">
            <span>Confirmar contraseña</span>
            <button
              type="button"
              @click="mostrarConfirmar = !mostrarConfirmar"
              class="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {{ mostrarConfirmar ? 'Ocultar' : 'Mostrar' }}
            </button>
          </label>

          <input
            :type="mostrarConfirmar ? 'text' : 'password'"
            v-model="confirmarContrasena"
            placeholder="********"
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            :class="{ 'border-red-500': errores.confirmarContrasena }"
          />
          <p v-if="errores.confirmarContrasena" class="error-text">
            {{ errores.confirmarContrasena }}
          </p>
        </div>

        <!-- BOTÓN GUARDAR -->
        <button
          type="submit"
          class="w-full bg-green-600 text-white font-semibold py-2 rounded-lg mt-2 hover:bg-green-700 transition duration-200 shadow-sm"
        >
          Guardar nueva contraseña
        </button>
      </form>

      <p v-if="mensaje" class="text-center text-sm mt-4 text-gray-600">
        {{ mensaje }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { changePasswordFirstLogin } from '../api/auth.js'

const router = useRouter()

const nuevaContrasena = ref('')
const confirmarContrasena = ref('')
const errores = ref({})
const mensaje = ref('')
const correo = ref('')
const mostrarNueva = ref(false)
const mostrarConfirmar = ref(false)

onMounted(() => {
  // 🔹 Recuperar el correo guardado por el LoginView
  correo.value = localStorage.getItem('correo_cambio') || ''
})

const handleChange = async () => {
  errores.value = {}

  // 🔍 Validaciones
  if (!nuevaContrasena.value) errores.value.nuevaContrasena = 'La contraseña es obligatoria'
  if (!confirmarContrasena.value) errores.value.confirmarContrasena = 'Confirma tu contraseña'
  if (nuevaContrasena.value && nuevaContrasena.value.length < 6)
    errores.value.nuevaContrasena = 'Debe tener al menos 6 caracteres'
  if (nuevaContrasena.value !== confirmarContrasena.value)
    errores.value.confirmarContrasena = 'Las contraseñas no coinciden'

  if (!correo.value) {
    alert('Error: No se encontró el correo del usuario. Vuelve a iniciar sesión.')
    router.push('/login')
    return
  }

  if (Object.keys(errores.value).length > 0) return

  try {
    console.log('📦 Enviando:', { correo: correo.value, nuevaContrasena: nuevaContrasena.value })
    const { data } = await changePasswordFirstLogin(correo.value, nuevaContrasena.value)
    alert(data.message || 'Contraseña cambiada exitosamente ✅')

    // limpiar datos y redirigir
    localStorage.removeItem('correo_cambio')
    nuevaContrasena.value = ''
    confirmarContrasena.value = ''
    router.push('/login')
  } catch (err) {
    console.error('❌ Error al cambiar contraseña:', err.response?.data || err)
    const msg = err.response?.data?.message || 'Error al cambiar la contraseña ❌'
    mensaje.value = msg
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
