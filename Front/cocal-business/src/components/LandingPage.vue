<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';

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

const chatbotOpen = ref(false);
const userInput = ref('');
const hasUnreadMessages = ref(false);
const showQuickQuestions = ref(true);
const chatMessages = ref([]);
const messagesContainer = ref(null);

// Add these functions to your existing script setup
const toggleChatbot = () => {
  chatbotOpen.value = !chatbotOpen.value;
  if (chatbotOpen.value) {
    hasUnreadMessages.value = false;
    // Scroll to bottom when opening
    nextTick(() => {
      scrollToBottom();
    });
  }
};

const selectQuickQuestion = (question) => {
  userInput.value = question;
  sendMessage();
};

const sendMessage = () => {
  if (!userInput.value.trim()) return;
  
  // Add user message
  chatMessages.value.push({
    text: userInput.value,
    type: 'user',
    time: getCurrentTime()
  });
  
  const userMessage = userInput.value.toLowerCase();
  userInput.value = '';
  showQuickQuestions.value = false;
  
  // Scroll to bottom after adding message
  nextTick(() => {
    scrollToBottom();
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      generateBotResponse(userMessage);
    }, 1000);
  });
};

const generateBotResponse = (userMessage) => {
  let response = '';
  
  if (userMessage.includes('plan') || userMessage.includes('precio') || userMessage.includes('costo') || userMessage.includes('tarifa')) {
    response = 'Ofrecemos tres planes adaptados a diferentes necesidades: • Básico: Ideal para startups - $29/mes • Empresarial: Para equipos medianos - $79/mes   • Enterprise: Soluciones personalizadas - Contáctanos ¿Te gustaría conocer más detalles de cada plan?';
  } else if (userMessage.includes('sincronización') || userMessage.includes('sincronizar') || userMessage.includes('funcion')) {
    response = 'La sincronización en CoCal Business funciona en tiempo real: • Conecta calendarios de Google, Outlook y Apple • Muestra disponibilidad de todo el equipo al instante • Evita conflictos de horarios automáticamente • Sincronización cross-platform las 24/7 ¿Te gustaría una demostración?';
  } else if (userMessage.includes('app') || userMessage.includes('móvil') || userMessage.includes('celular')) {
    response = '¡Sí! Tenemos app móvil nativa para: 📱 iOS: Disponible en App Store 📱 Android: Disponible en Google Play Store Características móviles: • Notificaciones en tiempo real • Gestión de reuniones on-the-go • Reserva de recursos desde cualquier lugar • Sincronización offline';
  } else if (userMessage.includes('soporte') || userMessage.includes('ayuda') || userMessage.includes('problema')) {
    response = 'Ofrecemos múltiples canales de soporte: 🕒 Horario: Lunes a Viernes 8:00-18:00 📞 Chat en vivo: Disponible en la plataforma 📧 Email: soporte@cocalbusiness.com 📚 Centro de ayuda: Documentación completa ¿En qué específicamente necesitas ayuda?';
  } else if (userMessage.includes('registro') || userMessage.includes('registrarse') || userMessage.includes('cuenta') || userMessage.includes('empezar')) {
    response = '¡Empezar es muy fácil! 1. Haz clic en "Empezar" en la página principal 2. Completa tu información básica 3. Verifica tu email 4. Configura tu equipo en 5 minutos ¿Quieres que te guíe paso a paso?';
  } else if (userMessage.includes('equipo') || userMessage.includes('colaboración')) {
    response = 'La gestión de equipos en CoCal Business incluye: • Hasta 50 miembros por equipo (según plan) • Roles y permisos personalizables • Visibilidad de disponibilidad grupal • Comentarios y retroalimentación integrada • Historial completo de actividades';
  } else if (userMessage.includes('recurso') || userMessage.includes('sala') || userMessage.includes('equipo')) {
    response = 'Puedes gestionar recursos como: 🏢 Salas de reuniones 📊 Proyectores y pantallas 💻 Equipos de videoconferencia 🚗 Vehículos corporativos Todos los recursos se reservan automáticamente evitando conflictos.';
  } else {
    response = 'Gracias por tu mensaje. Como asistente de CoCal Business, puedo ayudarte con información sobre: • Planes y precios • Funcionalidades de sincronización • App móvil • Soporte técnico • Proceso de registro • Gestión de equipos ¿Sobre cuál de estos temas te gustaría conocer más?';
  }
  
  chatMessages.value.push({
    text: response,
    type: 'bot',
    time: getCurrentTime()
  });
  
  // Scroll to bottom after bot response
  nextTick(() => {
    scrollToBottom();
  });
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const router = useRouter()

const goToStart = () => {
  const token = localStorage.getItem('token')
  if (!token){
    router.push('/login')
  } else {
    router.push('/mycalendar')
  }
}

// Auto-open chatbot after 10 seconds if user hasn't interacted
setTimeout(() => {
  if (!chatbotOpen.value) {
    hasUnreadMessages.value = true;
  }
}, 10000);
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
                            <v-btn class="btn-start" block @click="goToStart">
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

        <div class="floating-chatbot">
            <!-- Chatbot toggle button -->
            <v-btn
                class="chatbot-toggle"
                fab
                dark
                @click="toggleChatbot"
            >
                <v-icon v-if="!chatbotOpen" color="#E7ECF3">mdi-robot-happy</v-icon>
                <v-icon v-else color="#E7ECF3">mdi-close</v-icon>
                <div class="notification-dot" v-if="hasUnreadMessages"></div>
            </v-btn>

            <!-- Chatbot window -->
            <v-expand-x-transition>
                <div v-show="chatbotOpen" class="chatbot-window">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                    <v-avatar size="32" class="mr-2">
                        <v-img src="/assets/cocalbusiness_logo.jpg" alt="CoCal Assistant" />
                    </v-avatar>
                    <div>
                        <div class="assistant-name">CoCal Assistant</div>
                        <div class="status">En línea</div>
                    </div>
                    </div>
                </div>
                
                <div class="messages-container" ref="messagesContainer">
                    <!-- Welcome message -->
                    <div class="message bot welcome">
                    <div class="message-content">
                        <strong>¡Hola! Soy tu asistente de CoCal Business</strong>
                        <p>Estoy aquí para ayudarte a descubrir cómo podemos optimizar la gestión de tu equipo. ¿En qué puedo asistirte hoy?</p>
                    </div>
                    <div class="message-time">{{ getCurrentTime() }}</div>
                    </div>

                    <!-- Existing messages -->
                    <div 
                    v-for="(message, index) in chatMessages" 
                    :key="index"
                    :class="['message', message.type]"
                    >
                    <div class="message-content">
                        {{ message.text }}
                    </div>
                    <div class="message-time">
                        {{ message.time }}
                    </div>
                    </div>

                    <!-- Quick questions -->
                    <div class="quick-questions" v-if="showQuickQuestions">
                    <div class="quick-question" @click="selectQuickQuestion('¿Qué planes ofrecen?')">
                        ¿Qué planes ofrecen?
                    </div>
                    <div class="quick-question" @click="selectQuickQuestion('¿Cómo funciona la sincronización?')">
                        ¿Cómo funciona la sincronización?
                    </div>
                    <div class="quick-question" @click="selectQuickQuestion('¿Tienen app móvil?')">
                        ¿Tienen app móvil?
                    </div>
                    <div class="quick-question" @click="selectQuickQuestion('¿Ofrecen soporte técnico?')">
                        ¿Ofrecen soporte técnico?
                    </div>
                    </div>
                </div>
                
                <div class="input-container">
                    <v-text-field
                    v-model="userInput"
                    placeholder="Escribe tu mensaje..."
                    outlined
                    dense
                    hide-details
                    class="message-input"
                    @keyup.enter="sendMessage"
                    ></v-text-field>
                    <v-btn 
                    class="send-button" 
                    icon 
                    @click="sendMessage"
                    :disabled="!userInput.trim()"
                    >
                    <v-icon>mdi-send</v-icon>
                    </v-btn>
                </div>
                </div>
            </v-expand-x-transition>
            </div>
    </v-container>
</template>


<style scoped>

.hero-section {
    background: linear-gradient(0deg,var(--bg), var(--primary));
    align-content: center;
    padding: 100px 150px;
    min-height: 800px;
}

.my-carousel .v-carousel-item {
  background-size: cover;
  background-position: center;
}

.features-section {
    background-color: var(--primary);
}

.features-card-title {
    font-family: var(--font-display);
    font-size: larger;
    font-weight: 600;
    color: var(--surface);
}

.features-card-text {
    font-family: 'Zalando Sans', sans-serif;
    font-size: large;
    text-align: center;
    color: var(--surface);
}

.calendar-section {
    background: linear-gradient(90deg,var(--surface), var(--bg));
}

.mobile-section {
    background: linear-gradient(90deg, var(--surface), var(--bg));
}

.contact-section {
    background: linear-gradient(130deg, var(--surface), var(--bg));
    padding: 100px 200px;
}

.contact-card {
    border-radius: 20px;
    border: var(--secondary) solid 1px;
}

.contact-card-title {
    font-family: var(--font-tinos);
    font-size: x-large;
    color: var(--accent);
    padding: 5px 5px;
}

.contact-card-field {
    font-family: var(--font-tinos);
    font-size: x-large;
    color: var(--accent);
}

.about-section{
    background: linear-gradient(0deg, var(--primary), var(--primary), var(--secondary));
    align-content: center;
    border-top: var(--secondary) solid 5px;
}

.expandable-card {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
}

.expandable-icon {
    color: var(--surface);
}

h1{
    font-family: var(--font-tinos);
    font-size: xx-large;
    padding-bottom: 15px;
    color: var(--accent);
}

h2,
.expandable-card-title{
    font-family: var(--font-tinos);
    font-size: x-large;
    color: var(--surface);
}

.v-card-title {
  white-space: normal; 
  word-wrap: break-word; 
}

.normal-paragraph{
    font-family: 'Zalando Sans', sans-serif;
    font-size: larger;
    text-align: justify;
    color: var(--accent);
}

.center-paragraph{
    font-family: 'Zalando Sans', sans-serif;
    font-size: large;
    text-align: left;
    color: var(--surface);
}

.btn-start {
  font-family: var(--font-display);
  color: white;
  background-color: var(--primary);
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
  background-color: var(--surface);
  color: var(--primary);
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

.floating-chatbot {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  gap: 15px;
}

.chatbot-toggle {
  background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
  box-shadow: 0 4px 20px rgba(49, 89, 174, 0.3);
  position: relative;
  transition: all 0.3s ease;
}

.chatbot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(49, 89, 174, 0.4);
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 12px;
  height: 12px;
  background: #FF5252;
  border-radius: 50%;
  border: 2px solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

.chatbot-window {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.chatbot-header {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 15px 20px;
}

.chatbot-title {
  display: flex;
  align-items: center;
}

.assistant-name {
  font-family: var(--font-tinos);
  font-weight: bold;
  font-size: 16px;
}

.status {
  font-family: 'Zalando Sans', sans-serif;
  font-size: 12px;
  opacity: 0.8;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.welcome {
  max-width: 90%;
  background: white;
  border: 1px solid #e0e0e0;
  align-self: center;
  text-align: center;
}

.message.welcome .message-content {
  font-family: 'Zalando Sans', sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

.message.welcome .message-content strong {
  display: block;
  margin-bottom: 8px;
  color: var(--primary);
}

.message.user {
  align-self: flex-end;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border-bottom-right-radius: 5px;
}

.message.bot {
  align-self: flex-start;
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 5px;
}

.message-content {
  font-family: 'Zalando Sans', sans-serif;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-line;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 5px;
  text-align: right;
}

.quick-questions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.quick-question {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 10px 12px;
  font-family: 'Zalando Sans', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.quick-question:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  transform: translateY(-1px);
}

.input-container {
  display: flex;
  padding: 15px;
  background: white;
  border-top: 1px solid #e0e0e0;
  gap: 10px;
}

.message-input {
  flex: 1;
}

.message-input :deep(.v-input__control) {
  min-height: auto;
}

.send-button {
  background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
  color: white;
}

.send-button:disabled {
  background: #cccccc !important;
  color: #666666;
}

/* Scrollbar styling */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive adjustments */
@media screen and (max-width: 767px) {
  .floating-chatbot {
    bottom: 10px;
    right: 10px;
  }
  
  .chatbot-window {
    width: 300px;
    height: 450px;
  }
  
  .message {
    max-width: 90%;
  }
}

@media screen and (max-width: 480px) {
  .chatbot-window {
    width: calc(100vw - 40px);
    height: 400px;
  }
}
</style>