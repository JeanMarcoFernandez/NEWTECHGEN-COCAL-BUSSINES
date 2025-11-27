<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { changePasswordFirstLogin } from '../api/auth.js'

const router = useRouter()

const newContrasena = ref('')
const showPassword1 = ref(false)
const showPassword2 = ref(false)
const error = ref('')
const message = ref('')
const correo = ref('')
const loading = ref(false)
const snackbar = ref(false);
const snackbarError = ref(false);

const changeForm = ref()

onMounted(() => {
  // 🔹 Recuperar el correo guardado por el LoginView
  correo.value = localStorage.getItem('correo_cambio') || ''
})

const handleChange = async () => {
  snackbar.value = false
  snackbarError.value = false
  error.value = ''
  message.value = ''
  loading.value = true
  
  if (!correo.value) {
    error.value = 'Error: No se encontró el correo del usuario. Vuelve a iniciar sesión.'
    snackbarError.value = true
    router.push('/login')
    return
  }

  try {
    console.log('Enviando:', { correo: correo.value, nuevaContrasena: newContrasena.value })
    const { data } = await changePasswordFirstLogin(correo.value, newContrasena.value)
    message.value = data.message || 'Contraseña cambiada exitosamente.'
    snackbar.value = true

    // limpiar datos y redirigir
    localStorage.removeItem('correo_cambio')
    changeForm.value.reset()
    router.push('/login')
  } catch (err) {
    console.error('Error al cambiar contraseña:', err.response?.data || err)
    error.value = err.response?.data?.message || 'Error al cambiar la contraseña.'
    snackbarError.value = true
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <v-container fluid class="reset-page">
    <v-card class="reset-card" elevation="3">
        <v-card-title class="reset-title">Cambia tu contraseña</v-card-title>
        <v-form ref="changeForm" @submit.prevent="handleChange">
            <v-row class="px-4 pb-6">
                <p>
                    Por motivos de seguridad, debes cambiar tu contraseña antes de continuar.
                </p>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-text-field
                    v-model="newContrasena"
                    label="Contraseña"
                    :type="showPassword1 ? 'text' : 'password'"
                    :rules="[
                        v => !!v || 'Este campo no puede estar vacío.',
                        v => v.length >= 8 || 'La contraseña debe tener al menos 8 caracteres.'
                    ]"
                    :append-inner-icon="showPassword1 ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword1 = !showPassword1"
                    required
                    />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                    <v-text-field
                    label="Confirmar Contraseña"
                    :type="showPassword2 ? 'text' : 'password'"
                    :rules="[
                        v => !!v || 'Este campo no puede estar vacío.',
                        v => v === newContrasena || 'Las contraseñas no coinciden.'
                    ]"
                    :append-inner-icon="showPassword2 ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword2 = !showPassword2"
                    required
                    />
                </v-col>
            </v-row>
            <v-row class="py-4">
                <v-btn
                type="submit"
                class="reset-btn"
                :loading="loading"
                block
                rounded
                >
                Cambiar contraseña
                </v-btn>
            </v-row>
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

.reset-page {
  position: relative;
  height: 100vh;
  background: linear-gradient(135deg, rgba(49, 89, 174, 0.4), rgba(241, 240, 236, 0.4));
  background-size: 200% 200%;
  animation: gradientAnimation 5s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reset-page::before {
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

.reset-card {
  padding: 32px;
  max-width: 420px;
  width: 100%;
  border-radius: 20px;
  background-color: rgba(231, 236, 243, 0.85);
}

.reset-title {
  font-family: "Funnel Display", sans-serif;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: x-large;
  color: #061244;
  white-space: normal; 
  word-wrap: break-word;
}
p {
font-family: "Zalanda Sans", sans-serif;
  text-align: justify;
  font-size: large;
  color: #061244;
}

.reset-input {
  width: 100%;
  margin-bottom: 14px;
  border-radius: 10px;
  font-family: "Funnel Display", sans-serif;
  background-color: #e7ecf3;
  font-size: large;
  transition: border 0.3s ease, background-color 0.3s ease;
}

.reset-btn {
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

.reset-btn:hover {
  background: linear-gradient(to right, #183581, #3159AE);
  transform: scale(1.02);
}

.snackbar-message {
    font-family: 'Zalando Sans', sans-serif;
    font-size: larger;
    text-align: justify;
    color: #061244;
}

.link {
    color: #183581;
    font-family: 'Zalanda Sans', sans-serif;
    font-size: medium;
}

.link:hover {
    color: #3159ae;
}
</style>