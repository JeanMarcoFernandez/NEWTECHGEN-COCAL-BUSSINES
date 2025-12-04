<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

const tooltipVisible = ref(false);

const iframeSrc = ref(
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.068279914626!2d-68.11199119999999!3d-16.522650199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f20ee187a3103%3A0x2f2bb2b7df32a24d!2sUniversidad%20Cat%C3%B3lica%20Boliviana%20%22San%20Pablo%22!5e0!3m2!1ses-419!2sbo!4v1761892974380!5m2!1ses-419!2sbo"
);

const redirectToGoogleMaps = () => {
  window.open('https://maps.app.goo.gl/3hh1pJWFbBhMSJ5A7', '_blank');
};

const openFB = () => {
  window.open('https://www.facebook.com', '_blank');
}

const openIG = () => {
  window.open('https://www.instagram.com/rackie707?igsh=YjRwOHU2M2NhaDZs&utm_source=qr', '_blank');
}

const openTWT = () => {
  window.open('https://www.x.com', '_blank');
}


onMounted(() => {
  tooltipVisible.value = false;
});

</script>

<template>

<v-app>
  
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
          <v-btn class="social-media" icon="mdi-facebook" color="#E7ECF3" variant="text" @click="openFB"/>
          <v-btn class="social-media" icon="mdi-instagram" color="#E7ECF3" variant="text" @cllck="openIG"/>
          <v-btn class="social-media" icon="mdi-twitter" color="#E7ECF3" variant="text" @click="openTWT"/>
        </v-row>
      </v-col>
      <v-col cols="12" sm="5">
        <v-row>
          <p class="footer-title">Contáctanos</p>
        </v-row>
        <v-row class="pt-3">
          <v-tooltip class="map-tooltip" interactive location="top" :open-delay="500" v-model="tooltipVisible" >
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
@import url('https://fonts.googleapis.com/css2?family=Slabo+27px&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap'); /*Tinos*/
@import url('https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap'); /*Funnel Display*/
@import url('https://fonts.googleapis.com/css2?family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap'); /*Zalando Sans*/
@import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap'); /*Roboto Flex*/

.v-main {
  background-color: #F1F0EC;
}

</style>

<style scoped>
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
