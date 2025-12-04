<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const drawer = ref(false)
const username = ref('')
const role = ref('')

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol'); // Limpiar rol

router.push('/');
};

onMounted(() => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    router.push('/')
  }

  username.value = localStorage.getItem('nombre');
  role.value = localStorage.getItem('rol');
});

</script>

<template>
    <v-app-bar class="appbar pa-5">
        <v-app-bar-nav-icon @click="drawer = !drawer" color="#E7ECF3"></v-app-bar-nav-icon>
        <v-row class="align-center">
            <v-col cols="1" class="justify-start">
                <router-link to="/">
                    <v-img src="/assets/ntg_logo_transparent.png" max-height="100" class="rounded-lg"/> 
                </router-link>
            </v-col>
            <v-col cols="8" class="justify-start">
                <v-row class="app-title">Collaborative Calendar</v-row>
                <v-row class="app-subtitle">Mi Calendario</v-row>
            </v-col>
            <v-col cols="2" class="justify-end hidden-sm-and-down">
                <v-row class="username">Hola, {{ username }}</v-row>
                <v-row class="role">{{ role }}</v-row>
            </v-col>
            <v-col cols="1">
                <v-btn
                icon="mdi-logout"
                size="large"
                color="#E7ECF3"
                @click="logout"/>
            </v-col>
      </v-row>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      class="drawer pt-10"
      app
      color="#3159ae"
    >
      <v-list nav dense>
        <v-list-item to="/" exact>
            <template v-slot:prepend>
                <v-icon class="drawer-icon">mdi-calendar-account</v-icon>
            </template>
          <v-list-item-title class="nav-item">Mi Calendario</v-list-item-title>
        </v-list-item>

        <v-list-item to="/">
            <template v-slot:prepend>
                <v-icon class="drawer-icon">mdi-account-group</v-icon>
            </template>
          <v-list-item-title class="nav-item">Equipos</v-list-item-title>
        </v-list-item>

        <v-list-item to="/">
            <template v-slot:prepend>
                <v-icon class="drawer-icon">mdi-projector</v-icon>
            </template>
          <v-list-item-title class="nav-item">Recursos</v-list-item-title>
        </v-list-item>

        <v-list-item to="/">
            <template v-slot:prepend>
                <v-icon class="drawer-icon">mdi-chart-bar</v-icon>
            </template>
          <v-list-item-title class="nav-item">Reportes</v-list-item-title>
        </v-list-item>

        <v-list-item to="/">
            <template v-slot:prepend>
                <v-icon class="drawer-icon">mdi-shield-crown-outline</v-icon>
            </template>
          <v-list-item-title class="nav-item">Administración</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <router-view/>
</template>

<style scoped>
.appbar {
    background: linear-gradient(135deg, #183581, #3159AE) !important; 
}

.app-title {
    font-family: 'Funnel Display',sans-serif;
    font-size: large;
    font-weight: bold;
    color: #E7ECF3;
}

.app-subtitle {
    font-family: 'Funnel Display',sans-serif;
    font-size: medium;
    color: #E7ECF3;
}

.username {
    font-family: 'Tinos', sans-serif;
    font-size: large;
    font-weight: bold;
    color: #E7ECF3;
    justify-content: end;
}

.role {
    font-family: 'Tinos', sans-serif;
    font-size: medium;
    color: #E7ECF3;
    justify-content: end;
}

.drawer {
    background: linear-gradient(135deg, #183581, #3159AE);
}

.drawer-icon {
    color: #E7ECF3;
}

.nav-item {
  font-family: 'Funnel Display', sans-serif;
  font-size: large;
  color: #E7ECF3;
}

</style>