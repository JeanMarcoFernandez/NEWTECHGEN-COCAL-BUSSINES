<script setup>
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { ref, onMounted, watch  } from 'vue'

const drawer = ref(false);

const route = useRoute();
const showAppBar = ref(true);

watch(
  () => route.path, 
  (newPath) => {
    showAppBar.value = !['/login', '/register', '/forgotPassword'].includes(newPath);
  }
);

const tooltipVisible = ref(false);

const iframeSrc = ref(
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.068279914626!2d-68.11199119999999!3d-16.522650199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f20ee187a3103%3A0x2f2bb2b7df32a24d!2sUniversidad%20Cat%C3%B3lica%20Boliviana%20%22San%20Pablo%22!5e0!3m2!1ses-419!2sbo!4v1761892974380!5m2!1ses-419!2sbo"
);

const redirectToGoogleMaps = () => {
  window.open('https://maps.app.goo.gl/3hh1pJWFbBhMSJ5A7', '_blank');
};

onMounted(() => {
  tooltipVisible.value = false;
});
</script>

<template>

<v-app>
  <v-app-bar v-if="showAppBar" class="appbar pa-5" flat scroll-behavior="fully-hide" scroll-threshold="100" color="transparent">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
    <v-row class="align-center hidden-sm-and-down">
        <v-col cols="1" class="justify-start">
        <router-link to="/">
            <v-img src="/assets/ntg_logo_transparent.png" max-height="100" class="rounded-lg"/> 
        </router-link>
        </v-col>
        <v-col cols="11" class="d-flex justify-end">
        <v-btn
            class="app-bar-login-btn"
            size="large"
            elevation="3"
            to="/login"
        >Acceder</v-btn>
        <v-btn
            class="app-bar-register-btn"
            size="large"
            elevation="3"
        >Crear cuenta</v-btn>
        </v-col>
      </v-row>
  </v-app-bar>

  <v-navigation-drawer
      v-model="drawer"
      app
      class="hidden-md-and-up"
      hidden
      color="#3159ae"
    >
      <v-list nav dense>
        <v-list-item to="/" exact>
          <v-list-item-title class="nav-item">Inicio</v-list-item-title>
        </v-list-item>

        <v-list-item to="/login">
          <v-list-item-title class="nav-item">Acceder</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title class="nav-item">Crear cuenta</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

  <v-main class="d-flex flex-column justify-center align-center pa-0 ma-0">
    <RouterView />
  </v-main>

  <v-footer class="py-8 px-5 d-flex flex-row justify-start align-start">
    <v-row>
      <v-col class="ntg-col d-flex flex-row justify-end align-start pr-12" cols="12" sm="2">
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
          <v-tooltip class="map-tooltip" interactive location="top" :open-delay="500" v-model="tooltipVisible">
            <template v-slot:activator="{ props: activatorProps }">
              <v-icon
                v-bind="activatorProps"
                class="footer-icon social-media"
                @click="redirectToGoogleMaps"
              >
                mdi-map-marker
              </v-icon>
              <p class="footer-text">
                Av. 14 de Septiembre Nº 4807 esquina, La Paz
              </p>
            </template>

            <div
              class="map-container"
              @click="redirectToGoogleMaps"
            >
              <iframe
                :src="iframeSrc"
                width="200"
                height="200"
                style="border:0; cursor: pointer;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </v-tooltip>
        </v-row>
        <v-row>
          <v-icon class="footer-icon social-media">mdi-phone</v-icon>
          <p class="footer-text">
            +591 78800693
          </p>
        </v-row>
        <v-row>
          <v-icon class="footer-icon social-media">mdi-gmail</v-icon>
          <p class="footer-text">
            raquel.osorio@ucb.edu.bo
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

</style>

<style scoped>

.app-bar-login-btn, .app-bar-register-btn {
  font-family: 'Funnel Display', sans-serif;
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
  color: #E7ECF3;
  background-color: #183581;
  border: 2px solid transparent;
}

.app-bar-login-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-color: #183581;
}

.app-bar-register-btn {
  color: #183581;
  background-color: #E7ECF3;
  border: 2px solid transparent;
}

.app-bar-register-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-color: #E7ECF3;
}

.nav-item {
  font-family: 'Tinos', sans-serif;
  font-size: medium;
  color: #E7ECF3;
}

.v-footer{
  min-height: 200px;
  background: linear-gradient(120deg, #061244, #183581);
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
  transition: transform 0.4s ease-in-out;
  cursor: pointer;
}

.social-media:hover {
  transform: rotateY(180deg); 
}

@media screen and (max-width: 767px) {
  .ntg-col {
    padding: 10px 0px 25px 5px !important;
  }
}

.map-tooltip {
  color: #E7ECF3;
  border-radius: 20px;
}

.map-container {
  cursor: pointer;
  max-width: 350px;
  max-height: 350px; 
  overflow: hidden;
  border-radius: 20px;
}

</style>
