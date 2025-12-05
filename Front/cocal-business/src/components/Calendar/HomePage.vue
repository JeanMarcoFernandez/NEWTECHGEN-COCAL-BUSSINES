<template>
  <v-container fluid class="ma-0 pa-0">
    <div class="register-page">
    <div class="register-card">
      <!-- Header con icono -->
      <div class="header-section">
        <div class="icon-container">
          <svg class="success-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1 class="register-title">
          ¡Bienvenido a la plataforma!
        </h1>
        <p class="register-subtitle">
          Has iniciado sesión correctamente
        </p>
      </div>

      <!-- Información del usuario -->
      <div class="user-info">
        <div class="role-badge">
          <svg class="role-icon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
          </svg>
          <span>Tu rol actual es: <strong>{{ rol }}</strong></span>
        </div>
      </div>

      <!-- Acciones -->
      <div class="actions-section">
        <button
          v-if="rol === 'ADMIN'"
          @click="goToCreateUser"
          class="register-btn"
        >
          <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
          </svg>
          Crear Usuario
        </button>
      </div>
    </div>
  </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const rol = ref(null);

onMounted(() => {
  rol.value = localStorage.getItem('rol');
  const token = localStorage.getItem('token');
  
  if (!token) {
    router.push('/login');
  }
});

const goToCreateUser = () => {
  router.push('/create-user');
};
</script>

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
  max-width: 440px;
  width: 100%;
  border-radius: 20px;
  background-color: rgba(231, 236, 243, 0.85);
  text-align: center;
}

.header-section {
  margin-bottom: 2rem;
}

.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(to right, #183581, #3159AE);
  border-radius: 50%;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(24, 53, 129, 0.3);
}

.success-icon {
  width: 40px;
  height: 40px;
  color: #E7ECF3;
}

.register-title {
  font-family: "Funnel Display", sans-serif;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
  font-size: x-large;
  color: #061244;
}

.register-subtitle {
  font-family: "Funnel Display", sans-serif;
  color: #3159AE;
  font-size: large;
  margin-bottom: 0.5rem;
}

.user-info {
  margin-bottom: 2rem;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(231, 236, 243, 0.9);
  padding: 1rem 1.5rem;
  border-radius: 10px;
  border: 2px solid rgba(24, 53, 129, 0.2);
  font-family: "Funnel Display", sans-serif;
  font-size: large;
  color: #061244;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.role-icon {
  width: 20px;
  height: 20px;
  color: #3159AE;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register-btn {
  width: 100%;
  margin-top: 0.5rem;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.register-btn:hover {
  background: linear-gradient(to right, #183581, #3159AE);
  transform: scale(1.02);
}

.logout-btn {
  background: linear-gradient(to right, #dc2626, #ef4444);
}

.logout-btn:hover {
  background: linear-gradient(to right, #dc2626, #ef4444);
  transform: scale(1.02);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

@media screen and (max-width: 767px) {
  .register-page {
    padding: 50px 10px;
  }
  
  .register-card {
    padding: 24px 20px;
    margin: 1rem;
  }
  
  .register-title {
    font-size: large;
  }
  
  .register-subtitle {
    font-size: medium;
  }
  
  .role-badge {
    font-size: medium;
    padding: 0.75rem 1rem;
  }
  
  .icon-container {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }
  
  .success-icon {
    width: 30px;
    height: 30px;
  }
}
</style>