<template>
  <div
    v-if="tiempoRestante > 0"
    class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-md text-sm font-semibold transition-colors"
    :class="tiempoRestante <= 10 ? 'bg-red-600 text-white' : 'bg-black text-white'"
  >
     Token expira en: {{ tiempoRestante }}s
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tiempoRestante = ref(0)
let intervalo = null

function calcularTiempo() {
  const token = localStorage.getItem('token')
  if (!token) {
    tiempoRestante.value = 0
    return
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const diff = Math.floor((payload.exp * 1000 - Date.now()) / 1000)

    if (diff <= 0) {
      console.warn('💣 Token expirado, cerrando sesión.')
      clearInterval(intervalo)
      localStorage.clear()
      router.push('/login')
      tiempoRestante.value = 0
      return
    }

    tiempoRestante.value = diff
  } catch (err) {
    console.error('Error al decodificar token:', err)
    localStorage.clear()
    router.push('/login')
    tiempoRestante.value = 0
  }
}

onMounted(() => {
  calcularTiempo()
  intervalo = setInterval(calcularTiempo, 1000)
})

onUnmounted(() => clearInterval(intervalo))
</script>
