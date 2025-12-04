<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { login } from '../../api/auth'

const router = useRouter()

const showPassword = ref(false);
const correo = ref('')
const contrasena = ref('')
const error = ref('')
const message = ref('')
const remainingAttempts = ref('')
const loading = ref(false)
const snackbar = ref(false);
const snackbarError = ref(false);

const loginForm = ref()

const handleLogin = async () => {
    snackbar.value = false
    snackbarError.value = false
    error.value = ''
    message.value = ''
    remainingAttempts.value = null
    loading.value = true

    try {
      const { data } = await login({ correo: correo.value, contrasena: contrasena.value })

      // 🔹 Caso: requiere 2FA
      if (data.requiere2FA) {
        router.push({
          path: '/verify-2fa',
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
        localStorage.setItem('correo_cambio', correo.value)
        router.push('/password/first-login')
        return
      }

      // 🔹 Caso: login normal
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      message.value = 'Inicio de sesión exitoso.'
      snackbar.value = true
      router.push('/home')

    } catch (err) {
      const res = err.response?.data
      console.error('Error al iniciar sesión:', res || err)

      // Mensajes de error
      error.value = res?.message || 'Error al iniciar sesión.'
      snackbarError.value = true

      if (res?.intentos_restantes !== undefined) {
        remainingAttempts.value = res.intentos_restantes
      }

      // Bloqueo
      if (res?.bloqueado_hasta) {
        message.value = `Cuenta bloqueada hasta ${new Date(res.bloqueado_hasta).toLocaleString()}`
        snackbar.value = true
      }

      // Alerta adicional
      if (res?.message?.includes('bloqueada')) {
        message.value = 'Tu cuenta está bloqueada temporalmente.'
        snackbar.value = true
      }
    } finally {
      loading.value = false
    }

    loginForm.value.reset()
}
</script>

<template>
  <v-container fluid class="login-page">
    <v-card class="login-card" elevation="3">
        <v-row class="justify-center">
            <v-img src="/assets/cocalbusiness_logo_transparent.png" max-width="250"/>
        </v-row>
        <v-card-title class="login-title">Iniciar Sesión</v-card-title>
        <v-form ref="loginForm" @submit.prevent="handleLogin">
            <v-row>
                <v-text-field
                v-model="correo"
                label="Correo electrónico"
                type="email"
                :rules="[
                    v => !!v || 'Este campo no puede estar vacío.',
                    v => /.+@.+\..+/.test(v) || 'El correo electrónico no es válido.']"
                class="login-input"
                variant="outlined"
            />
            </v-row>
            <v-row>
                <v-text-field
                v-model="contrasena"
                label="Contraseña"
                :type="showPassword ? 'text' : 'password'"
                :rules="[v => !!v || 'Este campo no puede estar vacío.']"
                class="login-input"
                variant="outlined"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                />
                <router-link class="link" to="/forgotPassword">¿Olvidaste tu contraseña?</router-link>
            </v-row>
            <v-row class="py-4">
                <v-btn
                type="submit"
                class="login-btn"
                :loading="loading"
                block
                rounded
                >
                Entrar
                </v-btn>
            </v-row>
            <p class="pt-4">
                ¿No tienes una cuenta?
                <router-link class="link" to="/register">Regístrate</router-link>
            </p>
        </v-form>
    </v-card>

    <v-snackbar v-model="snackbar" :timeout="4000" color="#A0B5E4" top>
      <span class="snackbar-message">{{ message }}</span>
    </v-snackbar>

    <v-snackbar v-model="snackbarError" :timeout="4000" color="#f29191" top>
      <span class="snackbar-message">{{ error }}</span>
    </v-snackbar>
  </v-container>
</template>

<style scoped>

.login-page {
  position: relative;
  height: 100vh;
  background: linear-gradient(135deg, rgba(49, 89, 174, 0.4), rgba(241, 240, 236, 0.4));
  background-size: 200% 200%;
  animation: gradientAnimation 5s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(v, 0.6), rgba(49, 89, 174, 0.6), rgba(241, 240, 236, 0.3));
  background-size: 150% 150%;
  backdrop-filter: blur(10px); 
  z-index: -1;
  animation: spotsAnimation 13s infinite ease-in-out;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes spotsAnimation {
  0% {
    background-size: 120% 120%;
  }
  50% {
    background-size: 140% 140%;
  }
  100% {
    background-size: 120% 120%;
  }
}

.login-card {
  padding: 32px;
  max-width: 420px;
  width: 100%;
  border-radius: 20px;
  background-color: rgba(231, 236, 243, 0.85);
}

.login-title {
  font-family: "Funnel Display", sans-serif;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: x-large;
  color: #061244;
}

.login-input {
  width: 100%;
  margin-bottom: 14px;
  border-radius: 10px;
  font-family: "Funnel Display", sans-serif;
  background-color: #e7ecf3;
  font-size: large;
  transition: border 0.3s ease, background-color 0.3s ease;
}

.login-btn {
  width: 100%;
  margin-top: 1rem;
  height: 48px;
  background: linear-gradient(to right, #183581, #3159AE);
  color: #E7ECF3;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  font-family: "Quicksand", sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.4s ease, transform 0.2s ease;
}

.login-btn:hover {
  background: linear-gradient(to right, #183581, #3159AE);
  transform: scale(1.02);
}

.link {
    color: #183581;
    font-family: 'Zalanda Sans', sans-serif;
    font-size: medium;
    text-decoration: none;
}

.link:hover {
    color: #3159ae;
    text-decoration: underline;
}

.snackbar-message {
    font-family: 'Zalando Sans', sans-serif;
    font-size: larger;
    text-align: justify;
    color: #061244;
}
</style>