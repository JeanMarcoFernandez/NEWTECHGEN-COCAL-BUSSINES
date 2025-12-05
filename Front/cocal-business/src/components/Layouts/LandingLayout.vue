<script setup>
import { ref, onMounted }from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const isLogged = ref(false);

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('rol'); // Limpiar rol

  router.push('/login');
};

onMounted(() => {
  // Leer rol desde localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    isLogged.value = true;
  }
});

</script>

<template>
    <v-app-bar class="appbar pa-3" flat scroll-behavior="fully-hide" scroll-threshold="100" color="transparent" height="100">
        <v-row class="align-center">
            <v-col cols="1" class="justify-start">
            <router-link to="/">
              <div style="width: 120px;" class="flex-shrink-0">
                <v-img src="/assets/ntg_logo_transparent.png" width="120" class="rounded-lg mx-2"/> 
              </div>
            </router-link>
            </v-col>
            <v-col cols="11" class="d-flex justify-end">
            <v-btn
                v-if="isLogged"
                class="app-bar-login-btn"
                size="large"
                elevation="3"
                to="/login"
            >Acceder</v-btn>
            <v-btn
                v-if="isLogged"
                class="app-bar-register-btn hidden-sm-and-down"
                size="large"
                elevation="3"
                to="/register"
            >Crear cuenta</v-btn>
            <v-btn
                v-if="!isLogged"
                class="app-bar-login-btn"
                size="large"
                elevation="3"
                @click="logout"
            >Cerrar sesión</v-btn>
            </v-col>
        </v-row>
    </v-app-bar>
    <router-view/>
</template>

<style scoped>
.app-bar-login-btn, .app-bar-register-btn {
  font-family: var(--font-display);
  border-radius: 15px;
  margin: 5px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  outline: none; 
}
.app-bar-login-btn {
  color: var(--surface);
  background-color: var(--secondary);
  border: 2px solid transparent;
}

.app-bar-login-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-color: var(--secondary);
}

.app-bar-register-btn {
  color: var(--secondary);
  background-color: var(--surface);
  border: 2px solid transparent;
}

.app-bar-register-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-color: var(--surface);
}
</style>