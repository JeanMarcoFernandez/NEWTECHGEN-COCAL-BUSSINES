import { createRouter, createWebHistory } from "vue-router";
import EmpresaRegistro from "../views/EmpresaRegistro.vue";
import UsuarioRegistro from "../views/UsuarioRegistro.vue";
import TipoCalendario from "../views/TipoCalendario.vue";
import Login from "../views/Login.vue"; // 🔒 Pantalla de acceso

const routes = [
  { path: "/", redirect: "/empresa" },
  { path: "/empresa", component: EmpresaRegistro },
  { path: "/usuario", component: UsuarioRegistro },
  { path: "/login", component: Login },
  { path: "/calendario/tipo", component: TipoCalendario },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🧠 Middleware ajustado (modo dev sin bloqueo)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // 🔓 Permitir acceso libre durante el maquetado
  // (empresa, usuario, calendario, login)
  const publicPaths = ["/empresa", "/usuario", "/login", "/calendario/tipo"];

  if (publicPaths.includes(to.path)) {
    return next();
  }

  // 🔒 En el futuro, cuando haya login funcional:
  if (to.path.startsWith("/calendario") && !token) {
    return next("/login");
  }

  next();
});

export default router;
