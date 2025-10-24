<template>
    <v-sheet width="100%" class="hero-section pb-12">
        <v-app-bar class="appbar pa-5" flat scroll-behavior="fully-hide" scroll-threshold="100" color="transparent">
            <v-row class="align-center">
                <v-col cols="1" class="justify-start">
                <router-link to="/">
                    <v-img src="/assets/ntg_logo_transparent.png" max-width="100" class="rounded-lg"/> 
                </router-link>
                </v-col>
                <v-col cols="11" class="d-flex justify-end">
                <v-btn
                    class="app-bar-login-btn"
                    size="large"
                    elevation="3"
                >Inicar Sesión</v-btn>
                <v-btn
                    class="app-bar-register-btn"
                    size="large"
                    elevation="3"
                >Regístrate</v-btn>
                </v-col>
            </v-row>
        </v-app-bar>

        <v-row class="d-flex flex-row align-center pt-12">
        <v-col class="pa-2" cols="12" sm="7">
            <h1>Sincroniza tu equipo en tiempo real, sin estrés.</h1>
            <p class="normal-paragraph">
                No importa si eres una startup o una gran corporación, 
                CoCal Business te ofrece una solución ágil y potente 
                para gestionar calendarios, reuniones y proyectos de forma colaborativa, 
                ahorrando tiempo y aumentando la eficiencia de tu equipo.
            </p>
            <v-row class="pt-8 d-flex flex-row justify-left align-center">
                <v-col cols="9">
                    <p class="normal-paragraph" style="text-align: end;">
                        ¿Estás listo para transformar tus reuniones? Comienza ahora con CoCal Business
                    </p>
                </v-col>
                <v-col cols="3">
                    <v-btn class="btn-start" block>
                        <span class="btn-text">Empezar</span>
                        <v-icon class="arrow-icon">mdi-arrow-right</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" sm="5">
            <v-img src="/assets/cocalbusiness_logo_transparent.png" max-height="400"/>
        </v-col>
    </v-row>
    </v-sheet>

    <v-sheet width="100%" class="features-section pt-12">
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
        <v-row class="d-flex flex-row align-center">
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
        <v-row class="d-flex flex-row align-center">
            <v-col cols="12" sm="7">
                <v-row class="d-flex flex-row justify-end">
                    <h1 style="text-align: end;">Lleva tu Productividad al Siguiente Nivel con la App Móvil</h1>
                    <p class="normal-paragraph" style="text-align: end;">
                        Con la app móvil de CoCal Business, puedes revisar el resumen de cada reunión después de que haya terminado 
                        y proporcionar comentarios al instante. Nunca más olvidarás detalles importantes o retrasos, y podrás dar 
                        retroalimentación en tiempo real, mejorando la comunicación y la colaboración.
                    </p>
                </v-row>
                <v-row class="d-flex flex-row justify-end mt-6">
                    <v-btn class="btn-start">
                        <span class="btn-text">Descarga la App</span>
                        <v-icon class="arrow-icon">mdi-arrow-right</v-icon>
                    </v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" sm="5">
                <v-img src="/assets/cocal_mobile.png" max-height="400"/>
            </v-col>
        </v-row>
    </v-sheet>

    <v-sheet width="100%" class="about-section">
        <v-row>
            <v-col cols="12" class="text-center">
            <h1 style="color: #E7ECF3;">Acerca de nosotros</h1>
            <p class="center-paragraph pt-2" style="text-align: center;">Somos un equipo de visionarios, diseñadores e ingenieros dedicados a crear soluciones tecnológicas que optimicen 
                la forma en que las empresas interactúan, planifican y ejecutan sus proyectos. Creemos que la tecnología debe ser 
                un aliado que impulse el éxito, no una barrera que lo limite.</p>
            </v-col> 
        </v-row>
        <v-row class="pt-3">
            <v-col cols="12" sm="6">
                <h2>Visión</h2>
                <p class="center-paragraph pt-2">En New Gen Tech, visualizamos un futuro donde la tecnología simplifique 
                    la vida empresarial, creando herramientas intuitivas que faciliten la 
                    colaboración, la gestión del tiempo y el crecimiento de las empresas, 
                    independientemente de su tamaño.</p>
            </v-col>
            <v-col cols="12" sm="6">
                <h2>Misión</h2>
                <p class="center-paragraph pt-2">Nuestra misión es transformar la manera en que las empresas organizan sus equipos y 
                    recursos, ofreciendo soluciones innovadoras como CoCal Business. Buscamos mejorar la 
                    productividad, la comunicación y la eficiencia a través de tecnología avanzada, 
                    creando plataformas que faciliten el trabajo colaborativo y ayuden a las organizaciones 
                    a alcanzar su máximo potencial.</p>
            </v-col>
        </v-row>
        <v-row class="pt-12 justify-center">
            <h2>Nuestros valores</h2>
        </v-row>
        <v-row>
            <v-col cols="6" class="text-center">
                <v-icon color="#E7ECF3" class="custom-icon">mdi-lightbulb-on-20</v-icon>
                <v-card flat>
                    <v-card-title class="features-card-title">Innovación constante</v-card-title>
                    <v-card-text class="features-card-text">Buscamos siempre nuevas formas de mejorar y adaptarnos a los cambios del mercado.</v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6" class="text-center">
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
</template>


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
  background-color: #3159ae;
  border: 2px solid transparent;
}

.app-bar-login-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-color: #3159ae;
}

.app-bar-register-btn {
  color: #3159ae;
  background-color: #E7ECF3;
  border: 2px solid transparent;
}

.app-bar-register-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-color: #E7ECF3;
}

.hero-section {
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(0deg,#F1F0EC, #E7ECF3, #E7ECF3, #3159AE);
    padding: 10px 200px;
    min-height: 800px;
    align-content: center;
}

.features-section {
    margin-top: 800px;
    background-color: #3159ae;
    padding: 50px 20px;
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
    padding: 50px 150px;
    background: linear-gradient(90deg,#E7ECF3, #F1F0EC);
}

.mobile-section {
    padding: 50px 150px;
    background: linear-gradient(90deg, #E7ECF3, #F1F0EC);
}

.about-section{
    background: linear-gradient(0deg, #3159AE, #3159AE, #183581);
    padding: 50px 200px;
    align-content: center;
    border-top: #183581 solid 5px;
}

h1{
    font-family: 'Tinos', serif;
    font-size: xx-large;
    padding-bottom: 15px;
    color: #061244;
}

h2{
    font-family: 'Tinos', serif;
    font-size: x-large;
    color: #E7ECF3;
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
    padding: 10px 10px;
  }
  .features-section {
    padding: 10px 10px;
  }
  .calendar-section {
    padding: 10px 10px;
  }
  .mobile-section {
    padding: 10px 10px;
  }
}

.custom-icon {
  transition: all 0.2s ease;
  cursor: pointer;
}

.custom-icon:hover {
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