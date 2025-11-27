import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/components/LandingPage.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import ResetPassword from '@/components/ResetPassword.vue'
import ChangePassword from '@/components/ChangePassword.vue'
import Verify2FA from '@/components/Verify2FA.vue'
import CreateUser from '@/components/CreateUser.vue'
import HomePage from '@/components/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/forgotPassword',
      name: 'ForgotPassword',
      component: ForgotPassword,
    },
    {
      path: '/password/first-login',
      name: 'ChangePassword',
      component: ChangePassword,
      props: true
    },
    {
      path: '/verify-2fa',
      name: 'Verify2FA',
      component: Verify2FA,
    },
    {
      path: '/restablish/:token',
      name: 'ResetPassword',
      component: ResetPassword,
      props: true
    },
    {
      path: '/create-user',
      name: 'CreateUser',
      component: CreateUser
    },
    {
      path: '/home',
      name: 'HomePage',
      component: HomePage
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router
