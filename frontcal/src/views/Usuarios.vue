<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../api';
const empresas = ref([]);
const users = ref([]);
const form = ref({ id_empresa:null, correo:'', contrasena:'', nombre:'', apellido:'', cargo:'', rol:'EMPLEADO', telefono:'' });

async function load(){
  empresas.value = await api.empresas.list();
  users.value = await api.usuarios.list();
}
async function add(){
  await api.usuarios.create(form.value);
  form.value = { id_empresa:null, correo:'', contrasena:'', nombre:'', apellido:'', cargo:'', rol:'EMPLEADO', telefono:'' };
  load();
}
onMounted(load);
</script>

<template>
  <h2>Usuarios</h2>
  <div>
    <select v-model="form.id_empresa">
      <option :value="null" disabled>Empresa</option>
      <option v-for="e in empresas" :value="e.id" :key="e.id">{{ e.nombre }}</option>
    </select>
    <input v-model="form.correo" placeholder="Correo" />
    <input v-model="form.contrasena" type="password" placeholder="Contraseña" />
    <input v-model="form.nombre" placeholder="Nombre" />
    <input v-model="form.apellido" placeholder="Apellido" />
    <input v-model="form.cargo" placeholder="Cargo" />
    <select v-model="form.rol"><option>EMPLEADO</option><option>SUPERVISOR</option><option>ADMIN</option><option>RRHH</option><option>CLIENTE</option></select>
    <input v-model="form.telefono" placeholder="Teléfono" />
    <button @click="add">Crear</button>
  </div>
  <ul>
    <li v-for="u in users" :key="u.id">
      {{ u.nombre }} {{ u.apellido }} — {{ u.correo }} — ({{ u.rol }})
    </li>
  </ul>
</template>
