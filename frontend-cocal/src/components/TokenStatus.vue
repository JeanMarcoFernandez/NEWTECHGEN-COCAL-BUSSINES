<template>
  <div
    v-if="tiempoRestante > 0"
    class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-md text-sm font-semibold transition-colors"
    :class="tiempoRestante <= 5 ? 'bg-red-600 text-white' : 'bg-black text-white'"
  >
    ⏳ Token expira en: {{ tiempoRestante }}s
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tiempoRestante = ref(0)
let intervalo = null

onMounted(() => {
  intervalo = setInterval(() => {
    const token = localStorage.getItem('token')

    // Si no hay token, no mostramos nada
    if (!token) {
      tiempoRestante.value = 0
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const segundos = Math.max(
        0,
        Math.floor((payload.exp * 1000 - Date.now()) / 1000)
      )
      tiempoRestante.value = segundos

      // Si el token ya expiró → cerrar sesión automáticamente
      if (segundos === 0) {
        clearInterval(intervalo)
        alert('⚠️ Tu sesión ha expirado automáticamente.')
        localStorage.clear()
        router.push('/login')
      }
    } catch (err) {
      console.error('Error al decodificar token:', err)
      tiempoRestante.value = 0
    }
  }, 1000)
})

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
})
</script>
