<script setup>
import { ref } from 'vue'
import { solicitarRestablecimiento } from "../../api/auth.js";

const correo = ref('')
const message = ref('')
const error = ref('')
const loading = ref(false)
const snackbar = ref(false);
const snackbarError = ref(false);

async function request() {
  snackbar.value = false
  snackbarError.value = false
  error.value = ''
  message.value = ''
  loading.value = true

  try {
    const { data } = await solicitarRestablecimiento(correo.value);
    message.value = data.message;
    snackbar.value = true
  } catch (err) {
    error.value = err.response?.data?.message || "Error al enviar el correo.";
    snackbarError.value = true
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container fluid class="reset-page">
    <v-card class="reset-card" elevation="3">
        <v-card-title class="reset-title">Restablece tu contraseña</v-card-title>
        <v-form ref="resetForm" @submit.prevent="request">
            <v-row class="px-4 pb-6">
                <p>
                    Ingresa tu dirección de correo electrónico. Te enviaremos un enlace para restablecer tu contraseña. <br/>
                    Si no recibes el enlace en unos minutos, revisa la carpeta de spam o intenta con otro correo.
                </p>
            </v-row>
            <v-row>
                <v-text-field
                v-model="correo"
                label="Correo electrónico"
                type="email"
                :rules="[
                    v => !!v || 'Este campo no puede estar vacío.',
                    v => /.+@.+\..+/.test(v) || 'El correo electrónico no es válido.']"
                class="reset-input"
                variant="outlined"
            />
            </v-row>
            <v-row class="py-4">
                <v-btn
                type="submit"
                class="reset-btn"
                :loading="loading"
                block
                rounded
                >
                Restablecer contraseña
                </v-btn>
            </v-row>
            <v-row class="justify-center pt-2">
                <router-link class="link" to="/login">Volver al Inicio de Sesión</router-link>
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

.error-text {
  color: #ef5350;
  margin-top: 14px;
  font-size: 0.9rem;
  text-align: center;
  font-family: "Roboto Flex", sans-serif;
}

.link {
    color: #183581;
    font-family: 'Zalanda Sans', sans-serif;
    font-size: medium;
}

.link:hover {
    color: #3159ae;
}

.snackbar-message {
    font-family: 'Zalando Sans', sans-serif;
    font-size: larger;
    text-align: justify;
    color: #061244;
}
</style>