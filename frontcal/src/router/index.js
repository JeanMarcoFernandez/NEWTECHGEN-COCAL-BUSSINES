import { createRouter, createWebHistory } from "vue-router";
import EmpresaRegistro from "../views/EmpresaRegistro.vue";
import UsuarioRegistro from "../views/UsuarioRegistro.vue";
import TipoCalendario from "../views/TipoCalendario.vue";
import Login from "../views/Login.vue"; // 🔒 Pantalla de acceso

const routes = [
  { path: "/", redirect: "/empresa" }, // 🔥 inicia en registro de empresa
  { path: "/empresa", component: EmpresaRegistro },
  { path: "/usuario", component: UsuarioRegistro },
  { path: "/login", component: Login },
  { path: "/calendario/tipo", component: TipoCalendario },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🧠 Middleware: protege las rutas internas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // rutas libres (empresa, usuario y login)
  if (["/empresa", "/usuario", "/login"].includes(to.path)) {
    return next();
  }

  // rutas de calendario requieren token
  if (to.path.startsWith("/calendario") && !token) {
    return next("/login");
  }

  next();
});

export default router;
