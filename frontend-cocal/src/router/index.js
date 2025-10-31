import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import resetPasswordView from '../views/resetPasswordView.vue';
import changePasswordView from '../views/changePasswordView.vue';
import createUserView from '../views/createUserView.vue';
import Verificar2FA from '../views/Verificar2FA.vue'; 
import PaginaPrincipal from '../views/PaginaPrincipal.vue'; 
import RestablecerPasswordView from '../views/RestablecerPasswordView.vue';


const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/reset-password', component: resetPasswordView },
  { path: '/password/primer-login', component: changePasswordView, props: true },
  { path: '/create-user', component: createUserView },
  { path: '/verificar-2fa', component: Verificar2FA },
  { path: '/pagina-principal', component: PaginaPrincipal, meta: { requiresAuth: true } },
  { path: '/restablecer/:token', component: RestablecerPasswordView, props: true },

 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
