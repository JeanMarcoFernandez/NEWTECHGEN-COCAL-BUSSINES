<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { verificar2FA, reenviar2FA } from "../api/auth.js";

const route = useRoute();
const router = useRouter();

const correo = route.query.correo || "";
const usuario_id = route.query.usuario_id || "";
const nombre = route.query.nombre || "";

const codigo = ref(null)
const message = ref('')
const error = ref('')
const loading = ref(false)
const snackbar = ref(false);
const snackbarError = ref(false);

async function verifyCode() {
  snackbar.value = false
  snackbarError.value = false
  error.value = ''
  message.value = ''
  loading.value = true

  try {
    const { data } = await verificar2FA(correo, codigo.value);
    message.value = "Verificación exitosa. Redirigiendo...";
    snackbar.value = true
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    localStorage.setItem("rol", data.usuario.rol);

    router.push("/home");
  } catch (err) {
    error.value = err.response?.data?.message || "Error al verificar el código.";
    snackbarError.value = true;
  } finally {
    loading.value = false;
  }
}

async function resend() {
  try {
    await reenviar2FA(usuario_id, correo, nombre);
    message.value = "Nuevo código enviado al correo.";
    snackbar.value = true
  } catch (err) {
    error.value = "No se pudo reenviar el código.";
    snackbarError.value = true;
  }
}

</script>

<template>
  <v-container fluid class="reset-page">
    <v-card class="reset-card" elevation="3">
        <v-card-title class="reset-title">Verificación de dos pasos</v-card-title>
        <v-form ref="resetForm" @submit.prevent="verifyCode">
            <v-row class="px-4 pb-6">
                <p>
                    Ingresa el código de verificación enviado a tu correo electrónico.
                </p>
            </v-row>
            <v-row>
                <v-text-field
                v-model="codigo"
                type="number"
                :rules="[
                    v => !!v || 'Este campo no puede estar vacío.',
                    v => /^[0-9]{6}$/.test(v) || 'El código debe tener 6 dígitos.']"
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
                Enviar
              </v-btn>
            </v-row>
        </v-form>
        <v-row class="py-4">
            <v-btn
            class="reset-btn"
            :loading="loading"
            block
            rounded
            @click="resend"
            >
            Reenviar código
          </v-btn>
        </v-row>
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