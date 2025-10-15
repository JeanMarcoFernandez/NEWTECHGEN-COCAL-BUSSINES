<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Acceso al Sistema</h1>

      <form @submit.prevent="loginUser">
        <div class="form-group">
          <label for="correo">Correo electrónico</label>
          <input type="email" id="correo" v-model="correo" placeholder="ejemplo@empresa.com" required />
        </div>

        <div class="form-group">
          <label for="contrasena">Contraseña</label>
          <input type="password" id="contrasena" v-model="contrasena" placeholder="********" required />
        </div>

        <button type="submit" class="btn-primary">Iniciar sesión</button>

        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const correo = ref('')
const contrasena = ref('')
const error = ref('')
const router = useRouter()

async function loginUser() {
  error.value = ''
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: correo.value, contrasena: contrasena.value })
    })

    const data = await res.json()
    if (!data.ok) throw new Error(data.message || 'Error al iniciar sesión')

    // Guardar token y datos del usuario
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    router.push('/calendario/tipo')
  } catch (e) {
    error.value = e.message
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #2b2b2b, #444);
}

.login-box {
  background: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  width: 350px;
  text-align: center;
}

h1 {
  margin-bottom: 1.5rem;
  color: #222;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  color: #333;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: all 0.2s;
}

input:focus {
  border-color: #007bff;
}

.btn-primary {
  width: 100%;
  padding: 0.8rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.error-msg {
  margin-top: 1rem;
  color: red;
  font-weight: 500;
}
</style>
