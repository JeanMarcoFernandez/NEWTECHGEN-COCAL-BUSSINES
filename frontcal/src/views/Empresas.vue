<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../api';
const items = ref([]);
const form = ref({ nombre:'', nit:'', rubro:'' });

async function load(){ items.value = await api.empresas.list(); }
async function add(){ await api.empresas.create(form.value); form.value={nombre:'',nit:'',rubro:''}; load(); }
async function del(id){ await api.empresas.remove(id); load(); }
onMounted(load);
</script>

<template>
  <h2>Empresas</h2>
  <div>
    <input v-model="form.nombre" placeholder="Nombre" />
    <input v-model="form.nit" placeholder="NIT" />
    <input v-model="form.rubro" placeholder="Rubro" />
    <button @click="add">Crear</button>
  </div>
  <ul>
    <li v-for="e in items" :key="e.id">
      {{ e.nombre }} — {{ e.rubro }}
      <button @click="del(e.id)">Eliminar</button>
    </li>
  </ul>
</template>
