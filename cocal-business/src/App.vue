<script setup>
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { ref } from 'vue'

const drawer = ref(false)

</script>

<template>

<v-app>
  <v-app-bar class="pa-6" flat fully-hide>
    <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-row class="hidden-sm-and-down align-center pa-4 app-bar">
      <v-col cols="1" class="justify-start">
        <router-link to="/">
          <v-img src="/assets/ntg_logo.jpg" max-width="63" class="rounded-lg"/> 
        </router-link>
      </v-col>
      <v-col cols="11" class="d-flex justify-end">
        <v-btn
          class="app-bar-login-btn"
          size="x-large"
        >Inicar Sesión</v-btn>
        <v-btn
          class="app-bar-register-btn"
          size="x-large"
        >Regístrate</v-btn>
      </v-col>
    </v-row>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" class="hidden-md-and-up">
    <v-list>
      <v-list-item to="/">
        <v-list-item-title>Inicio</v-list-item-title>
      </v-list-item>
      <v-list-item>
        Iniciar Sesión
      </v-list-item>
      <v-list-item>
        Regístrate
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main >
    <v-container>
      <RouterView/>
    </v-container>
  </v-main>

  <v-footer>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-img src="/assets/ntg_logo.jpg" max-width="60" class="rounded-lg"/>
          </v-col>
          <v-col cols="12" sm="4">
            <p class="footer-title">Síguenos en nuestras redes sociales</p>
            <v-row>
              <v-btn icon="mdi-facebook"/>
              <v-btn icon="mdi-instagram"/>
              <v-btn icon="mdi-twitter"/>
            </v-row>
          </v-col>
          <v-col cols="12" sm="4">
            <p class="footer-title">Contáctanos</p>
            <p class="footer-text">
              Av. 14 de septiembre, Calle 2
            </p>
            <p class="footer-text">
              +591 7005060
            </p>
            <p class="footer-text">
              support@ntg.com
            </p>
          </v-col>
        </v-row>
        <v-row class="d-flex flex-row justify-end">
          <p>&copy New Tech Gen</p>
        </v-row>
      </v-col>
    </v-row>
  </v-footer>
</v-app>

</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Slabo+27px&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Red+Hat+Text:ital,wght@0,300..700;1,300..700&family=Roboto+Flex:opsz,wght@8..144,100..1000&family=Slabo+27px&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Red+Hat+Text:ital,wght@0,300..700;1,300..700&family=Roboto+Flex:opsz,wght@8..144,100..1000&family=Slabo+27px&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap');


.v-app-bar{
  background-color: transparent !important;
}

.v-main {
  padding-top: 30px;
  background: linear-gradient(50deg, #778fd9, #bbc8f0);
}

.v-footer{
  max-height: 500px;
  background-color: #324375 !important;
}

.footer-title{
  font-family: 'Tinos', serif;
  color: white;
  font-weight: bold;
  font-size: large;
}

.footer-text{
  font-family: 'Red Hat Text', sans-serif;
  color: white;
  font-size: medium;
}

</style>
