<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../api';
const empresas = ref([]);
const deps = ref([]);
const form = ref({ id_empresa:null, nombre:'', area:'SISTEMAS', visibilidad:'INTERNO' });

async function load(){
  empresas.value = await api.empresas.list();
  deps.value = await api.departamentos.list();
}
async function add(){
  await api.departamentos.create(form.value);
  form.value = { id_empresa:null, nombre:'', area:'SISTEMAS', visibilidad:'INTERNO' };
  load();
}
async function del(id){ await api.departamentos.remove(id); load(); }

onMounted(load);
</script>

<template>
  <h2>Departamentos</h2>
  <div>
    <select v-model="form.id_empresa">
      <option :value="null" disabled>Empresa</option>
      <option v-for="e in empresas" :value="e.id" :key="e.id">{{ e.nombre }}</option>
    </select>
    <input v-model="form.nombre" placeholder="Nombre" />
    <select v-model="form.area">
      <option>SISTEMAS</option><option>GERENCIA</option><option>MARKETING</option>
      <option>RECURSOS_HUMANOS</option><option>CONTABILIDAD</option><option>PRODUCCION</option>
    </select>
    <select v-model="form.visibilidad"><option>INTERNO</option><option>PUBLICO</option><option>PRIVADO</option></select>
    <button @click="add">Crear</button>
  </div>
  <ul>
    <li v-for="d in deps" :key="d.id">
      {{ d.nombre }} — {{ d.area }} — (Empresa #{{ d.id_empresa }})
      <button @click="del(d.id)">Eliminar</button>
    </li>
  </ul>
</template>
