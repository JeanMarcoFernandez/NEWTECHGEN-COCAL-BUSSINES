<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { register } from '../../api/auth';

const router = useRouter();

const showPassword1 = ref(false)
const showPassword2 = ref(false)
const message = ref('')
const error = ref('')
const loading = ref(false)
const snackbar = ref(false);
const snackbarError = ref(false);

const nombre = ref('');
const apellido = ref('');
const correo = ref('');
const telefono = ref('');
const cargo = ref('');
const contrasena = ref('');

const registerForm = ref()

const handleRegister = async () => {
  snackbar.value = false
  snackbarError.value = false
  error.value = ''
  message.value = ''
  loading.value = true

  try {
    await register({
      nombre: nombre.value,
      apellido: apellido.value,
      correo: correo.value,
      telefono: telefono.value,
      cargo: cargo.value,
      contrasena: contrasena.value
    });

    message.value = 'Registro exitoso.'
    snackbar.value = true 
    // limpiar campos
    registerForm.value.reset()
    // redirigir a login
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al registrarse.';
    snackbarError.value = true
  }
};
</script>

<template>
  <v-container fluid class="register-page">
    <v-card class="register-card" elevation="3">
        <v-card-title class="register-title">Crea tu cuenta</v-card-title>
        <v-form ref="registerForm" @submit.prevent="handleRegister">
             <v-row>
                <v-col cols="12" md="6">
                    <v-text-field
                    v-model="nombre"
                    class="register-input"
                    label="Nombre"
                    :rules="[
                        v => !!v || 'Este campo no puede estar vacío.'
                    ]"
                    required
                    />
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                    v-model="apellido"
                    class="register-input"
                    label="Apellido"
                    :rules="[
                        v => !!v || 'Este campo no puede estar vacío.'
                    ]"
                    required
                    />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-text-field
                    v-model="correo"
                    class="register-input"
                    label="Correo electrónico"
                    type="email"
                    :rules="[
                        v => !!v || 'Este campo no puede estar vacío.',
                        v => /.+@.+\..+/.test(v) || 'El correo electrónico no es válido.'
                    ]"
                    required
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field
                    v-model="cargo"
                    class="register-input"
                    label="Cargo"
                    :rules="[
                        v => !!v || 'Este campo no puede estar vacío.'
                    ]"
                    required
                    />
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                    v-model="telefono"
                    class="register-input"
                    label="Teléfono"
                    :rules="[
                        v => !!v || 'Este campo no puede estar vacío.',
                        v => /^[0-9]{8}$/.test(v) || 'El teléfono debe tener 8 dígitos.'
                    ]"
                    required
                    />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field
                    v-model="contrasena"
                    class="register-input"
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
                <v-col cols="12" md="6">
                    <v-text-field
                    label="Confirmar Contraseña"
                    class="register-input"
                    :type="showPassword2 ? 'text' : 'password'"
                    :rules="[
                        v => !!v || 'Este campo no puede estar vacío.',
                        v => v === contrasena || 'Las contraseñas no coinciden.'
                    ]"
                    :append-inner-icon="showPassword2 ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword2 = !showPassword2"
                    required
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-btn
                type="submit"
                class="register-btn"
                :loading="loading"
                block
                rounded
                >
                Registrarse
                </v-btn>
            </v-row>
            <v-row class="justify-center pt-4">
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

.register-page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(49, 89, 174, 0.4), rgba(241, 240, 236, 0.4));
  background-size: 200% 200%;
  animation: gradientAnimation 5s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-page::before {
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

.register-card {
  padding: 32px;
  max-width: 820px;
  width: 100%;
  border-radius: 20px;
  background-color: rgba(231, 236, 243, 0.85);
}

.register-title {
  font-family: "Funnel Display", sans-serif;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: x-large;
  color: #061244;
}

.register-input {
  width: 100%;
  margin-bottom: 14px;
  border-radius: 10px;
  font-family: "Funnel Display", sans-serif;
  background-color: #e7ecf3;
  font-size: large;
  transition: border 0.3s ease, background-color 0.3s ease;
}

.register-btn {
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

.register-btn:hover {
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

@media screen and (max-width: 767px) {
    .register-page {
        padding: 50px 10px;
    }
}
</style>