import { createRouter, createWebHistory } from "vue-router";
import EmpresaRegistro from "../views/EmpresaRegistro.vue";
import UsuarioRegistro from "../views/UsuarioRegistro.vue";
import TipoCalendario from "../views/TipoCalendario.vue"; // 🔥 próximo paso

const routes = [
  { path: "/", redirect: "/empresa" },
  { path: "/empresa", component: EmpresaRegistro },
  { path: "/usuario", component: UsuarioRegistro },
  { path: "/calendario/tipo", component: TipoCalendario },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
