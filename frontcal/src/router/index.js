import { createRouter, createWebHistory } from "vue-router";
import EmpresaRegistro from "../views/EmpresaRegistro.vue";
import UsuarioRegistro from "../views/UsuarioRegistro.vue";
import TipoCalendario from "../views/TipoCalendario.vue";
import CalendarioPersonal from "../views/CalendarioPersonal.vue"; 
import Login from "../views/Login.vue";

const routes = [
  { path: "/", redirect: "/empresa" },
  { path: "/empresa", component: EmpresaRegistro },
  { path: "/usuario", component: UsuarioRegistro },
  { path: "/login", component: Login },
  { path: "/calendario/tipo", component: TipoCalendario },
  { path: "/calendario/personal", component: CalendarioPersonal }, 
  // /calendario/grupo se agregará en Sprint 5
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔓 Modo libre para maquetar (sin login todavía)
router.beforeEach((to, from, next) => {
  const publicPaths = [
    "/empresa",
    "/usuario",
    "/login",
    "/calendario/tipo",
    "/calendario/personal",
  ];
  if (publicPaths.includes(to.path)) return next();
  next("/login");
});

export default router;
