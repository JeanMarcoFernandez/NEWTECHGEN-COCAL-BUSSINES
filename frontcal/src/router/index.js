import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Empresas from '../views/Empresas.vue';
import Departamentos from '../views/Departamentos.vue';
import Usuarios from '../views/Usuarios.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path:'/', redirect:'/empresas' },
    { path:'/login', component: Login },
    { path:'/empresas', component: Empresas },
    { path:'/departamentos', component: Departamentos },
    { path:'/usuarios', component: Usuarios }
  ]
});
