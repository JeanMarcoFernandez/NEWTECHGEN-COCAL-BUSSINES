import { createRouter, createWebHistory } from 'vue-router'

import LandingLayout from '@/components/Layouts/LandingLayout.vue'
import LoginLayout from '@/components/Layouts/LoginLayout.vue'
import CalendarLayout from '@/components/Layouts/CalendarLayout.vue'

import LandingPage from '@/components/LandingPage.vue'
import Login from '@/components/Login/Login.vue'
import Register from '@/components/Login/Register.vue'
import ForgotPassword from '@/components/Login/ForgotPassword.vue'
import ResetPassword from '@/components/Login/ResetPassword.vue'
import ChangePassword from '@/components/Login/ChangePassword.vue'
import Verify2FA from '@/components/Login/Verify2FA.vue'
import CreateUser from '@/components/Login/CreateUser.vue'

import MyCalendar from '@/components/Calendar/MyCalendar.vue'
import GroupCalendar from '@/components/Calendar/GroupCalendar.vue'
import Resources from '@/components/Calendar/Resources.vue'
import Empresas from '@/components/Calendar/CompanyManagement.vue'
import Analitic from '@/components/Calendar/Analitics.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LandingLayout,
      children: [
        { path: '', name: 'landing', component: LandingPage }
      ]
    },
    {
      path: '/login',
      component: LoginLayout,
      children: [
        { path: '', name: 'login', component: Login },
        { path: '/register', name: 'register', component: Register },
        { path: '/forgotPassword', name: 'ForgotPassword', component: ForgotPassword },
        { path: '/password/first-login', name: 'ChangePassword', component: ChangePassword, props: true },
        { path: '/verify-2fa', name: 'Verify2FA', component: Verify2FA },
        { path: '/restablish/:token', name: 'ResetPassword', component: ResetPassword, props: true },
        { path: '/create-user', name: 'CreateUser', component: CreateUser }
      ]
    },
    {
      path: '/mycalendar',
      component: CalendarLayout,
      children: [
        { path: '', name: 'MyCalendar', component: MyCalendar },
        { path: '/groups', name: 'Grupos', component:  GroupCalendar},
        { path: '/resources', name: 'Recursos', component:  Resources},
        { path: '/empresas', name: 'Empresas', component:  Empresas},
        { path: '/analisis', name: 'Analisis', component:  Analitic}
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/' 
    }
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
