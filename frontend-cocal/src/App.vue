<template>
  <router-view />
  <TokenStatus v-if="tieneToken" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TokenStatus from './components/TokenStatus.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tieneToken = ref(false)

function verificarExpiracionToken() {
  const token = localStorage.getItem('token')
  if (!token) {
    tieneToken.value = false
    return
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expira = payload.exp * 1000
    const ahora = Date.now()

    if (ahora >= expira) {
      console.warn(' Token expirado: limpiando sesión...')
      localStorage.clear()
      tieneToken.value = false
      router.push('/login')
    } else {
      tieneToken.value = true
    }
  } catch (err) {
    console.error('Error al leer token:', err)
    localStorage.clear()
    tieneToken.value = false
  }
}

onMounted(() => {
  verificarExpiracionToken()

  
  setInterval(() => verificarExpiracionToken(), 1000)

 
  window.addEventListener('storage', verificarExpiracionToken)
})
</script>
