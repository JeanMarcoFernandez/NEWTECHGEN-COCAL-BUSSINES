<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const drawer = ref(false)
const username = ref('')
const role = ref('')

const navItems = ref([
  {
    title: 'Mi Calendario',
    icon: 'mdi-calendar-account',
    to: '/mycalendar',
    subtitle: 'Mi Calendario',
    roles: ['ADMIN', 'EMPLEADO'] 
  },
  {
    title: 'Grupos',
    icon: 'mdi-account-group',
    to: '/groups',
    subtitle: 'Calendarios grupales',
    roles: ['ADMIN', 'EMPLEADO'] 
  },
  {
    title: 'Recursos',
    icon: 'mdi-projector',
    to: '/resources',
    subtitle: 'Administración de recursos',
    roles: ['ADMIN', 'EMPLEADO'] 
  },
  {
    title: 'Reportes',
    icon: 'mdi-chart-bar',
    to: '/',
    subtitle: 'Estadísticas y reportes',
    roles: ['ADMIN', 'EMPLEADO'] 
  },
  {
    title: 'Administración',
    icon: 'mdi-shield-crown-outline',
    to: '/',
    subtitle: 'Panel de administración',
    roles: ['ADMIN'] 
  }
])

const currentSubtitle = computed(() => {
  const match = navItems.value.find(item => item.to === route.path)
  return match ? match.subtitle : 'Mi Calendario'
})

const filteredNav = computed(() => {
  return navItems.value.filter(item =>
    item.roles.includes(role.value)
  )
})

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol'); // Limpiar rol

router.push('/');
};

onMounted(() => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    router.push('/login')
  }

  
  const raw = localStorage.getItem('usuario');
  const jsonIndex = raw.indexOf('{');
  const jsonString = raw.slice(jsonIndex);
  const user = JSON.parse(jsonString);
  
  username.value = user.nombre
  role.value = localStorage.getItem('rol');
});
</script>

<template>
    <v-app-bar class="appbar pa-5">
        <v-app-bar-nav-icon @click="drawer = !drawer" color="#E7ECF3"></v-app-bar-nav-icon>
        <v-row class="align-center">
            <v-col cols="1" class="justify-start">
                <router-link to="/">
                    <v-img src="/assets/ntg_logo_transparent.png" max-height="100" class="rounded-lg hidden-sm-and-down"/> 
                </router-link>
            </v-col>
            <v-col cols="8" class="justify-start">
                <v-row class="app-title">Collaborative Calendar</v-row>
                <v-row class="app-subtitle">{{ currentSubtitle }}</v-row>
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
        <v-list-item
            v-for="item in filteredNav"
            :key="item.title"
            :to="item.to"
            >
            <template #prepend>
                <v-icon class="drawer-icon">{{ item.icon }}</v-icon>
            </template>

            <v-list-item-title class="nav-item">
                {{ item.title }}
            </v-list-item-title>
            </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <router-view/>
</template>

<style scoped>
.appbar {
    background: linear-gradient(135deg, var(--accent), var(--secondary)) !important; 
}

.app-title {
    font-family: var(--font-display);
    font-size: large;
    font-weight: bold;
    color: var(--surface);
}

.app-subtitle {
    font-family: var(--font-display);
    font-size: medium;
    color: var(--surface);
}

.username {
    font-family: var(--font-tinos);
    font-size: large;
    font-weight: bold;
    color: var(--surface);
    justify-content: end;
}

.role {
    font-family: var(--font-tinos);
    font-size: medium;
    color: var(--surface);
    justify-content: end;
}

.drawer {
    background: linear-gradient(135deg, var(--accent), var(--secondary));
}

.drawer-icon {
    color: var(--surface);
}

.nav-item {
  font-family: var(--font-display);
  font-size: large;
  color: var(--surface);
}

</style>