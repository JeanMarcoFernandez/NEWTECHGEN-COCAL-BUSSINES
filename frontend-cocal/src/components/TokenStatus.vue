<template>
  <div
    v-if="tiempoRestante > 0"
    class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-md text-sm font-semibold transition-colors"
    :class="{
      'bg-green-600 text-white': activo,
      'bg-yellow-600 text-white': !activo && tiempoRestante > 10,
      'bg-red-600 text-white': tiempoRestante <= 10
    }"
  >
    {{ activo ? '🟢 Sesión activa' : `Inactivo (${tiempoRestante}s)` }}
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tiempoRestante = ref(0)
const activo = ref(true)
let intervalo = null
let temporizadorInactividad = null


function resetInactividad() {
  activo.value = true
  clearTimeout(temporizadorInactividad)
  temporizadorInactividad = setTimeout(() => {
    activo.value = false
  }, 8000) 
}


function calcularTiempoRestante() {
  const token = localStorage.getItem('token')
  if (!token) {
    tiempoRestante.value = 0
    return
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expMS = payload.exp * 1000
    const diff = Math.max(0, Math.floor((expMS - Date.now()) / 1000))
    tiempoRestante.value = diff

    
    if (diff <= 0) {
      console.warn('Token expirado por tiempo real')
      cerrarSesion()
    }
  } catch (err) {
    console.error('Error al leer token:', err)
    cerrarSesion()
  }
}


function cerrarSesion() {
  clearInterval(intervalo)
  clearTimeout(temporizadorInactividad)
  localStorage.clear()
  alert('Tu sesión ha expirado.')
  router.push('/login')
}


function contar() {
  if (!activo.value) {
    tiempoRestante.value--
    if (tiempoRestante.value <= 0) cerrarSesion()
  }
}

onMounted(() => {
  
  window.addEventListener('mousemove', resetInactividad)
  window.addEventListener('keydown', resetInactividad)
  window.addEventListener('scroll', resetInactividad)

  resetInactividad()
  calcularTiempoRestante()
  intervalo = setInterval(() => {
    contar()
    calcularTiempoRestante() 
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalo)
  clearTimeout(temporizadorInactividad)
  window.removeEventListener('mousemove', resetInactividad)
  window.removeEventListener('keydown', resetInactividad)
  window.removeEventListener('scroll', resetInactividad)
})
</script>
