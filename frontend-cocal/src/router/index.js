import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import resetPasswordView from '../views/resetPasswordView.vue';
import changePasswordView from '../views/changePasswordView.vue';
import createUserView from '../views/createUserView.vue';
import PaginaPrincipal from '../views/PaginaPrincipal.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/reset-password', component: resetPasswordView },
  { path: '/password/primer-login', component: changePasswordView, props: true },
  { path: '/create-user', component: createUserView },
  { path: '/paginaprincipal', component: PaginaPrincipal },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
