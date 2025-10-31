import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/components/LandingPage.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'

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
  ],
})

export default router
