import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import resetPasswordView from '../views/resetPasswordView.vue';
import changePasswordView from '../views/changePasswordView.vue';
import createUserView from '../views/createUserView.vue';
import Verificar2FA from '../views/Verificar2FA.vue'; // ✅ nueva vista
import PaginaPrincipal from '../views/PaginaPrincipal.vue'; // si no la tienes, agrégala

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/reset-password', component: resetPasswordView },
  { path: '/change-password/:token', component: changePasswordView, props: true },
  { path: '/create-user', component: createUserView },
  { path: '/verificar-2fa', component: Verificar2FA }, // ✅ ruta 2FA
  { path: '/pagina-principal', component: PaginaPrincipal, meta: { requiresAuth: true } },
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
