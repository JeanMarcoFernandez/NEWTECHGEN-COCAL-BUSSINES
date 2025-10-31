<script setup>
import { ref } from 'vue';

const images = [
  '/assets/cocalbusiness_logo_transparent.png',
  '/assets/calendar_illus.png',
  '/assets/ntg_logo_transparent.png',
];

const imagesContact = [
  'https://cdni.iconscout.com/illustration/premium/thumb/contact-us-illustration-svg-download-png-2912020.png',
  'https://images.vexels.com/media/users/3/208149/isolated/preview/c37e035a45bba197db58df20be32b0da-contact-cellphone-illustration.png',
  'https://cdni.iconscout.com/illustration/premium/thumb/contact-us-illustration-svg-download-png-5059493.png',
];

const cards = [
  {
    title: 'Visión',
    content: 'En New Gen Tech, visualizamos un futuro donde la tecnología simplifique la vida empresarial, creando herramientas intuitivas que faciliten la colaboración, la gestión del tiempo y el crecimiento de las empresas, independientemente de su tamaño.'
  },
  {
    title: 'Misión',
    content: 'Nuestra misión es transformar la manera en que las empresas organizan sus equipos y recursos, ofreciendo soluciones innovadoras como CoCal Business. Buscamos mejorar la productividad, la comunicación y la eficiencia a través de tecnología avanzada, creando plataformas que faciliten el trabajo colaborativo y ayuden a las organizaciones a alcanzar su máximo potencial.'
  }
];

const expanded = ref(Array(cards.length).fill(false));

const toggleExpansion = (index) => {
  expanded.value[index] = !expanded.value[index];
};

const valid = ref(false)
const snackbar = ref(false);
const contactForm = ref()

const form = ref({
  name: '',
  email: '',
  message: '',
});

const submitForm = () => {
    snackbar.value = true;
    
    contactForm.value.reset()
};
</script>

<template>
    <v-container fluid class="pa-0">
        <v-sheet class="hero-section">
            <v-row class="d-flex flex-row align-center pt-8">
                <v-col class="pa-2" cols="12" sm="7">
                    <h1>Sincroniza tu equipo en tiempo real, sin estrés.</h1>
                    <p class="normal-paragraph">
                        No importa si eres una startup o una gran corporación, 
                        CoCal Business te ofrece una solución ágil y potente 
                        para gestionar calendarios, reuniones y proyectos de forma colaborativa, 
                        ahorrando tiempo y aumentando la eficiencia de tu equipo.
                    </p>
                    <v-row class="pt-8 d-flex flex-row justify-left align-center">
                        <v-col cols="12" sm="9">
                            <p class="normal-paragraph" style="text-align: end;">
                                ¿Estás listo para transformar tus reuniones? Comienza ahora con CoCal Business
                            </p>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <v-btn class="btn-start" block>
                                <span class="btn-text">Empezar</span>
                                <v-icon class="arrow-icon">mdi-arrow-right</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" sm="5">
                    <v-carousel
                        cycle                      
                        height="400px"             
                        class="my-carousel"
                        hide-delimiters
                        :show-arrows="false"
                        :transition-duration="800"
                        interval="2000"
                    >
                        <v-carousel-item
                        v-for="(image, index) in images"
                        :key="index"
                        :src="image"
                        />
                    </v-carousel>
                </v-col>
            </v-row>
        </v-sheet>

        <v-sheet class="features-section py-12">
            <v-row>
                <v-col cols="12" sm="4" class="text-center">
                    <v-icon size="x-large" color="#E7ECF3" class="custom-icon">mdi-account-group-outline</v-icon>
                    <v-card flat>
                        <v-card-title class="features-card-title">Conecta a tu equipo en un solo clic</v-card-title>
                        <v-card-text class="features-card-text">
                            Gestiona equipos de forma sencilla, integrando múltiples calendarios y 
                            permitiendo ver los horarios disponibles de todos al instante.
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="4" class="text-center">
                    <v-icon size="x-large" color="#E7ECF3" class="custom-icon">mdi-calendar-check</v-icon>
                    <v-card flat>
                        <v-card-title class="features-card-title">Calendarios sincronizados, reuniones sin estrés</v-card-title>
                        <v-card-text class="features-card-text">
                            Con CoCal Business, puedes combinar 
                            los calendarios de tu equipo y ver los espacios libres de todos en tiempo real, asegurando 
                            que nunca más se solapen horarios.
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="4" class="text-center">
                    <v-icon size="x-large" color="#E7ECF3" class="custom-icon">mdi-projector</v-icon>
                    <v-card flat>
                        <v-card-title class="features-card-title">Optimiza recursos en tiempo real</v-card-title>
                        <v-card-text class="features-card-text">
                            ¿Necesitas una sala de reuniones o equipo específico para un evento? 
                            Reserva recursos como salas de reuniones, 
                            proyectores, y otros equipos esenciales, todo desde la misma plataforma.
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-sheet>

        <v-sheet width="100%" class="calendar-section">
            <v-row class="d-flex flex-row align-center px-8">
                <v-col cols="12" sm="5">
                    <v-img src="/assets/calendar_illus.png" max-width="600"/>
                </v-col>
                <v-col cols="12" sm="7">
                    <h1>Visibilidad total sobre calendarios y recursos de tu equipo</h1>
                    <p class="normal-paragraph">
                        Con CoCal Business, tendrás acceso a la disponibilidad de todos los
                        miembros de tu equipo, así como a la gestión de recursos como salas de reuniones y equipos. 
                        Podrás ver los espacios libres y coordinar reuniones sin preocupaciones, optimizando el tiempo de todos.
                    </p>
                </v-col>
            </v-row>
        </v-sheet>

        <v-sheet width="100%" class="mobile-section">
            <v-row class="d-flex flex-row align-center px-8 py-4">
                <v-col cols="12" sm="7">
                    <v-row class="d-flex flex-row justify-end">
                        <h1 style="text-align: end;">Lleva tu Productividad al Siguiente Nivel con la App Móvil</h1>
                        <p class="normal-paragraph" style="text-align: end;">
                            Con la app móvil de CoCal Business, puedes revisar el resumen de cada reunión después de que haya terminado 
                            y proporcionar comentarios al instante. Nunca más olvidarás detalles importantes o retrasos, y podrás dar 
                            retroalimentación en tiempo real, mejorando la comunicación y la colaboración.
                        </p>
                    </v-row>
                    <v-row class="download-col d-flex flex-row justify-end mt-6 pa-2">
                        <v-btn class="btn-start">
                            <span class="btn-text">Descarga la App</span>
                            <v-icon class="arrow-icon">mdi-arrow-right</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="12" sm="5" class="pa-4">
                    <v-img src="/assets/cocal_mobile.png" max-height="350"/>
                </v-col>
            </v-row>
        </v-sheet>

        <v-sheet class="contact-section">
            <v-row>
                <v-col cols="12" sm="6">
                    <v-card class="contact-card" elevation="3">
                        <v-card-title>
                            <span class="contact-card-title">Contáctanos</span>
                            </v-card-title>
                            <v-card-text>
                            <v-form ref="contactForm" v-model="valid" @submit.prevent="submitForm">
                                <v-text-field
                                class="contact-card-field"
                                v-model="form.name"
                                label="Su nombre"
                                :rules="[v => !!v || 'Su nombre es requerido.']"
                                required
                                ></v-text-field>

                                <v-text-field
                                class="contact-card-field"
                                v-model="form.email"
                                label="Su email"
                                :rules="[v => !!v || 'Su email es requerido.']"
                                required
                                ></v-text-field>

                                <v-textarea
                                class="contact-card-field"
                                v-model="form.message"
                                label="Su mensaje"
                                :rules="[v => !!v || 'Su mensaje es requerido.']"
                                required
                                ></v-textarea>

                                <v-btn
                                class="btn-start"
                                :disabled="!valid"
                                type="submit"
                                block
                                >
                                Mandar mensaje
                                </v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-carousel
                        cycle                      
                        height="400px"             
                        class="my-carousel"
                        hide-delimiters
                        :show-arrows="false"
                        :transition-duration="800"
                        interval="2000"
                    >
                        <v-carousel-item
                        v-for="(image, index) in imagesContact"
                        :key="index"
                        :src="image"
                        />
                    </v-carousel>
                </v-col>
            </v-row>

        </v-sheet>

        <v-sheet width="100%" class="about-section pt-6 px-10">
            <v-row>
                <v-col cols="12" class="text-center">
                <h1 style="color: #E7ECF3;">Acerca de NewTechGen()</h1>
                <p class="center-paragraph pt-2" style="text-align: center;">NewTechGen() es un equipo de visionarios, diseñadores e ingenieros dedicados a crear soluciones tecnológicas que optimicen 
                    la forma en que las empresas interactúan, planifican y ejecutan sus proyectos. Creemos que la tecnología debe ser 
                    un aliado que impulse el éxito, no una barrera que lo limite.</p>
                </v-col> 
            </v-row>
            <v-row class="pt-3">
                <v-col
                    v-for="(card, index) in cards"
                    :key="index"
                    cols="12" sm="6"
                    >
                    <v-card class="expandable-card" @click="toggleExpansion(index)">
                        <v-card-title class="d-flex align-center">
                        <span class="mr-2 expandable-card-title">{{ card.title }}</span>
                        <v-icon class="expandable-icon">{{ expanded[index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                        </v-card-title>

                        <v-expand-transition>
                        <div v-show="expanded[index]">
                            <v-card-text>
                            <p class="center-paragraph pt-2">{{ card.content }}</p>
                            </v-card-text>
                        </div>
                        </v-expand-transition>
                    </v-card>
                </v-col>
            </v-row>
            <v-row class="pt-16 justify-center">
                <h2>Nuestros valores</h2>
            </v-row>
            <v-row>
                <v-col cols="12" sm="6" class="text-center">
                    <v-icon color="#E7ECF3" class="custom-icon">mdi-lightbulb-on-20</v-icon>
                    <v-card flat>
                        <v-card-title class="features-card-title">Innovación constante</v-card-title>
                        <v-card-text class="features-card-text">Buscamos siempre nuevas formas de mejorar y adaptarnos a los cambios del mercado.</v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" class="text-center">
                    <v-icon color="#E7ECF3" class="custom-icon">mdi-account-heart</v-icon>
                    <v-card flat>
                        <v-card-title class="features-card-title">Colaboración abierta</v-card-title>
                        <v-card-text class="features-card-text">Fomentamos un entorno de trabajo colaborativo, donde cada idea es bienvenida y se valora.</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" class="text-center">
                    <v-icon color="#E7ECF3" class="custom-icon">mdi-flare</v-icon>
                    <v-card flat>
                        <v-card-title class="features-card-title">Simplicidad y eficiencia</v-card-title>
                        <v-card-text class="features-card-text">Creemos en herramientas que sean poderosas, pero fáciles de usar.</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-sheet>

        <v-snackbar v-model="snackbar" :timeout="4000" color="#A0B5E4" top>
            <span class="normal-paragraph">¡Gracias por contactarnos! Nos pondemos en contacto contigo pronto.</span>
        </v-snackbar>
    </v-container>
</template>


<style scoped>

.hero-section {
    background: linear-gradient(0deg,#F1F0EC, #3159AE);
    align-content: center;
    padding: 100px 150px;
    min-height: 800px;
}

.my-carousel .v-carousel-item {
  background-size: cover;
  background-position: center;
}

.features-section {
    background-color: #3159ae;
}

.features-card-title {
    font-family: 'Funnel Display', sans-serif;
    font-size: larger;
    font-weight: 600;
    color: #E7ECF3;
}

.features-card-text {
    font-family: 'Zalando Sans', sans-serif;
    font-size: large;
    text-align: center;
    color: #E7ECF3;
}

.calendar-section {
    background: linear-gradient(90deg,#E7ECF3, #F1F0EC);
}

.mobile-section {
    background: linear-gradient(90deg, #E7ECF3, #F1F0EC);
}

.contact-section {
    background: linear-gradient(130deg, #E7ECF3, #F1F0EC);
    padding: 100px 200px;
}

.contact-card {
    border-radius: 20px;
    border: #183581 solid 1px;
}

.contact-card-title {
    font-family: 'Tinos', serif;
    font-size: x-large;
    color: #061244;
    padding: 5px 5px;
}

.contact-card-field {
    font-family: 'Tinos', serif;
    font-size: x-large;
    color: #061244;
}

.about-section{
    background: linear-gradient(0deg, #3159AE, #3159AE, #183581);
    align-content: center;
    border-top: #183581 solid 5px;
}

.expandable-card {
  background: linear-gradient(135deg, #3159AE, #183581);
}

.expandable-icon {
    color: #E7ECF3;
}

h1{
    font-family: 'Tinos', serif;
    font-size: xx-large;
    padding-bottom: 15px;
    color: #061244;
}

h2,
.expandable-card-title{
    font-family: 'Tinos', serif;
    font-size: x-large;
    color: #E7ECF3;
}

.v-card-title {
  white-space: normal; 
  word-wrap: break-word; 
}

.normal-paragraph{
    font-family: 'Zalando Sans', sans-serif;
    font-size: larger;
    text-align: justify;
    color: #061244;
}

.center-paragraph{
    font-family: 'Zalando Sans', sans-serif;
    font-size: large;
    text-align: left;
    color: #E7ECF3;
}

.btn-start {
  font-family: 'Funnel Display', sans-serif;
  color: white;
  background-color: #3159ae;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 15px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.btn-text {
  transition: transform 0.3s ease;
}

.arrow-icon {
  position: absolute;
  right: -30px;
  opacity: 0;
  transition: all 0.3s ease;
}

.btn-start:hover {
  background-color: #E7ECF3;
  color: #3159ae;
}

.btn-start:hover .btn-text {
  transform: translateX(-10px);
}

.btn-start:hover .arrow-icon {
  right: 10px; 
  opacity: 1;  
}

.v-card{
    background-color: transparent;
}

@media screen and (max-width: 767px) {
  .hero-section {
    padding: 70px 20px;
  }
  .features-section {
    padding: 10px 10px;
  }
  .calendar-section,
  .mobile-section,
  .contact-section,
  .about-section {
    padding: 10px 20px;
  }
  h1 {
    text-align: start !important;
  }
  .normal-paragraph,
  .center-paragraph{
    text-align: justify !important;
  }
  .download-col {
    justify-self: center;
  }
}

.custom-icon {
  transition: transform 0.4s ease-in-out;
  cursor: pointer;
}

.custom-icon:hover {
  transform: rotateY(180deg);
}
</style>