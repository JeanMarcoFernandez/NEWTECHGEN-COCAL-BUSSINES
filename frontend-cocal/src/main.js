import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/style.css'; // opcional si agregas estilos globales

createApp(App).use(router).mount('#app');
