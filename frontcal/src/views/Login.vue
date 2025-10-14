<script setup>
import { ref } from 'vue';
import { useAuth } from '../stores/auth';
const auth = useAuth();
const correo = ref('admin@cocal.dev');
const contrasena = ref('admin123');
async function submit(){ await auth.login(correo.value, contrasena.value); }
</script>

<template>
  <div class="container">
    <h2>Login</h2>
    <input v-model="correo" placeholder="correo" />
    <input v-model="contrasena" type="password" placeholder="contraseña" />
    <button @click="submit">Entrar</button>
    <p v-if="auth.user">Bienvenido, {{ auth.user.nombre }}</p>
  </div>
</template>
