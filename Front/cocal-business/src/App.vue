<script setup>
import { RouterView, RouterLink, useRoute } from 'vue-router'

</script>

<template>

<v-app>

  <v-main class="d-flex flex-column justify-center align-center">
      <RouterView />
  </v-main>

  <v-footer class="pt-8 px-5 d-flex flex-row justify-start align-start">
    <v-row>
      <v-col class="d-flex flex-row justify-end align-start pr-12" cols="12" sm="2">
        <v-img src="/assets/ntg_logo_transparent.png" max-width="150"/>
      </v-col>
      <v-col cols="12" sm="5">
        <v-row>
          <p class="footer-title">Síguenos en nuestras redes sociales</p>
        </v-row>
        <v-row class="pt-2">
          <v-btn class="social-media" icon="mdi-facebook" color="#E7ECF3" variant="text"/>
          <v-btn class="social-media" icon="mdi-instagram" color="#E7ECF3" variant="text"/>
          <v-btn class="social-media" icon="mdi-twitter" color="#E7ECF3" variant="text"/>
        </v-row>
      </v-col>
      <v-col cols="12" sm="5">
        <v-row>
          <p class="footer-title">Contáctanos</p>
        </v-row>
        <v-row class="pt-3">
          <v-icon class="footer-icon social-media">mdi-map-marker</v-icon>
          <p class="footer-text">
            Av. 14 de Septiembre Nº 4807 esquina, La Paz
          </p>
        </v-row>
        <v-row>
          <v-icon class="footer-icon social-media">mdi-phone</v-icon>
          <p class="footer-text">
            +591 7005060
          </p>
        </v-row>
        <v-row>
          <v-icon class="footer-icon social-media">mdi-gmail</v-icon>
          <p class="footer-text">
            support@ntg.com
          </p>
        </v-row>
      </v-col>
    </v-row>
  </v-footer>
</v-app>

</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Slabo+27px&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap');

.v-main {
  background-color: #F1F0EC;
}

.v-footer{
  min-height: 200px;
  background: linear-gradient(120deg, #061244, #183581) !important;
}

.footer-title{
  font-family: 'Tinos', serif;
  color: #E7ECF3;
  font-weight: bold;
  font-size: large;
}

.footer-text{
  font-family: 'Red Hat Text', sans-serif;
  color: #E7ECF3;
  font-size: medium;
}

.footer-icon {
  margin: 5px 15px;
  color: #E7ECF3;
}

.social-media {
  transition: all 0.2s ease;
  cursor: pointer;
}

.social-media:hover {
  animation: jump 0.5s ease-in-out;
  transform: translateY(-5px); 
}

@keyframes jump {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px); 
  }
  100% {
    transform: translateY(0); 
  }
}

</style>
